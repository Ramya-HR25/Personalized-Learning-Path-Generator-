import { Catalog } from "../models/Catalog.js";
import { Feedback } from "../models/Feedback.js";
import { User } from "../models/User.js";
import { getCatalogMap, getCatalogSubject } from "../services/catalogService.js";
import { generateAllCourses } from "../services/courseCatalogGenerator.js";
import { buildQuizQuestionsFromFacts, generateQuizFactsFromResourceText } from "../services/resourceQuizIngestionService.js";

export async function getAdminOverview(_req, res, next) {
  try {
    const [users, feedback, catalog] = await Promise.all([
      User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean(),
      Feedback.find().sort({ createdAt: -1 }).lean(),
      getCatalogMap()
    ]);

    const quizTakers = users.filter((user) => {
      const allPaths = [user.path, ...(user.paths || [])].filter(Boolean);
      return allPaths.some((path) =>
        path.chapters?.some((chapter) => chapter.quiz?.completed)
      );
    }).length;

    return res.json({ users, feedback, catalog, quizTakers });
  } catch (error) {
    next(error);
  }
}

function updateTopicInDocument(subjectEntry, chapterId, topicId, updater) {
  if (!subjectEntry) {
    throw new Error("Learning path subject not found.");
  }

  let topicFound = false;

  subjectEntry.chapters = subjectEntry.chapters.map((chapter) => {
    if (chapter.id !== chapterId) {
      return chapter;
    }

    return {
      ...chapter,
      topics: chapter.topics.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        topicFound = true;
        return updater(topic);
      })
    };
  });

  if (!topicFound) {
    throw new Error("Topic not found.");
  }
}

function ensureCatalogStructure(subjectEntry, subject, chapterId, topicId) {
  const generatedCatalog = generateAllCourses();
  const generatedCourse = generatedCatalog[subject];

  if (!generatedCourse) {
    return;
  }

  const generatedChapter = generatedCourse.chapters.find((chapter) => chapter.id === chapterId);
  if (!generatedChapter) {
    return;
  }

  if (!subjectEntry.chapters.some((chapter) => chapter.id === chapterId)) {
    subjectEntry.chapters.push(structuredClone(generatedChapter));
    return;
  }

  subjectEntry.chapters = subjectEntry.chapters.map((chapter) => {
    if (chapter.id !== chapterId) {
      return chapter;
    }

    const generatedTopic = generatedChapter.topics.find((topic) => topic.id === topicId);
    if (!generatedTopic || chapter.topics.some((topic) => topic.id === topicId)) {
      return chapter;
    }

    return {
      ...chapter,
      topics: [...chapter.topics, structuredClone(generatedTopic)]
    };
  });
}

export async function upsertCatalogTopic(req, res, next) {
  try {
    const { subject, chapterId, topic } = req.body;
    if (!subject || !chapterId || !topic?.id || !topic?.title) {
      return res.status(400).json({ message: "Subject, chapter, and topic details are required." });
    }

    let subjectEntry = await getCatalogSubject(subject);
    if (!subjectEntry) {
      subjectEntry = new Catalog({
        subject,
        title: subject,
        overview: "Custom added subject.",
        estimatedHours: 10,
        chapters: []
      });
    }

    let chapterFound = false;
    subjectEntry.chapters = subjectEntry.chapters.map((chapter) => {
      if (chapter.id !== chapterId) {
        return chapter;
      }
      chapterFound = true;
      const exists = chapter.topics.some((entry) => entry.id === topic.id);
      return {
        ...chapter,
        topics: exists
          ? chapter.topics.map((entry) => (entry.id === topic.id ? topic : entry))
          : [...chapter.topics, topic]
      };
    });

    if (!chapterFound) {
      subjectEntry.chapters.push({
        id: chapterId,
        title: req.body.chapterTitle || chapterId,
        description: "Custom chapter",
        topics: [topic]
      });
    }

    subjectEntry.markModified("chapters");
    await subjectEntry.save();

    return res.json(await getCatalogMap());
  } catch (error) {
    next(error);
  }
}

export async function deleteCatalogTopic(req, res, next) {
  try {
    const { subject, chapterId, topicId } = req.body;
    if (!subject || !chapterId || !topicId) {
      return res.status(400).json({ message: "Subject, chapter, and topic id are required." });
    }

    const subjectEntry = await getCatalogSubject(subject);
    if (!subjectEntry) {
      throw new Error("Learning path subject not found.");
    }

    subjectEntry.chapters = subjectEntry.chapters.map((chapter) => {
      if (chapter.id !== chapterId) {
        return chapter;
      }

      return {
        ...chapter,
        topics: chapter.topics.filter((topic) => topic.id !== topicId)
      };
    });

    subjectEntry.markModified("chapters");
    await subjectEntry.save();

    return res.json(await getCatalogMap());
  } catch (error) {
    next(error);
  }
}

export async function createTopicResource(req, res, next) {
  try {
    const { subject, chapterId, topicId, resource } = req.body;
    if (!subject || !chapterId || !topicId || !resource?.title || !resource?.type || !resource?.url) {
      return res.status(400).json({ message: "Subject, chapter, topic, and full resource details are required." });
    }

    let subjectEntry = await getCatalogSubject(subject);
    if (!subjectEntry) {
      subjectEntry = new Catalog({
        subject,
        title: subject,
        overview: "Custom added subject.",
        estimatedHours: 10,
        chapters: []
      });
    }

    ensureCatalogStructure(subjectEntry, subject, chapterId, topicId);

    let chapter = subjectEntry.chapters.find(c => c.id === chapterId);
    if (!chapter) {
       subjectEntry.chapters.push({
         id: chapterId,
         title: chapterId,
         description: "Custom chapter",
         topics: []
       });
    }

    chapter = subjectEntry.chapters.find(c => c.id === chapterId);
    let targetTopic = chapter.topics.find(t => t.id === topicId);
    if (!targetTopic) {
       chapter.topics.push({
         id: topicId,
         title: topicId,
         durationMinutes: 60,
         subtopics: [],
         resources: []
       });
    }
    updateTopicInDocument(subjectEntry, chapterId, topicId, (topic) => ({
        ...topic,
        resources: [
          ...(topic.resources || []),
          {
            id: resource.id || `resource-${Date.now()}`,
            type: resource.type,
            title: resource.title,
            url: resource.url,
            durationMinutes: Number(resource.durationMinutes || 10),
            summary: resource.summary || "",
            focusPoints: resource.focusPoints || [],
            quizFacts: resource.quizFacts || [],
            sourceText: resource.sourceText || ""
          }
        ]
      }));

    subjectEntry.markModified("chapters");
    await subjectEntry.save();

    return res.status(201).json(await getCatalogMap());
  } catch (error) {
    next(error);
  }
}

export async function ingestResourceQuizContent(req, res, next) {
  try {
    const { subject, chapterId, topicId, resourceId, sourceText } = req.body;
    if (!subject || !chapterId || !topicId || !resourceId || !sourceText) {
      return res.status(400).json({ message: "Subject, chapter, topic, resource, and pasted text are required." });
    }

    const subjectEntry = await getCatalogSubject(subject);
    if (!subjectEntry) {
      throw new Error("Learning path subject not found.");
    }

    ensureCatalogStructure(subjectEntry, subject, chapterId, topicId);
    let generatedPayload = null;

    updateTopicInDocument(subjectEntry, chapterId, topicId, (topic) => ({
      ...topic,
      resources: (topic.resources || []).map((resource) => {
        if (resource.id !== resourceId) {
          return resource;
        }

        generatedPayload = generateQuizFactsFromResourceText(sourceText, resource.title);
        return {
          ...resource,
          summary: generatedPayload.summary,
          focusPoints: generatedPayload.focusPoints,
          quizFacts: generatedPayload.quizFacts,
          sourceText: generatedPayload.sourceText
        };
      })
    }));

    if (!generatedPayload) {
      throw new Error("Resource not found.");
    }

    subjectEntry.markModified("chapters");
    await subjectEntry.save();

    return res.json({
      message: "Quiz facts generated from pasted transcript/PDF text.",
      generated: generatedPayload,
      questions: buildQuizQuestionsFromFacts(generatedPayload.quizFacts),
      catalog: await getCatalogMap()
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTopicResource(req, res, next) {
  try {
    const { subject, chapterId, topicId, resourceId } = req.body;
    if (!subject || !chapterId || !topicId || !resourceId) {
      return res.status(400).json({ message: "Subject, chapter, topic, and resource id are required." });
    }

    const subjectEntry = await getCatalogSubject(subject);
    updateTopicInDocument(subjectEntry, chapterId, topicId, (topic) => ({
        ...topic,
        resources: (topic.resources || []).filter((resource) => resource.id !== resourceId)
      }));

    subjectEntry.markModified("chapters");
    await subjectEntry.save();

    return res.json(await getCatalogMap());
  } catch (error) {
    next(error);
  }
}

export async function deleteFeedback(req, res, next) {
  try {
    const { feedbackId } = req.params;
    await Feedback.findByIdAndDelete(feedbackId);
    return res.json({ message: "Feedback removed." });
  } catch (error) {
    next(error);
  }
}
