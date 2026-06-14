import { Catalog } from "../models/Catalog.js";
import { generateAllCourses } from "./courseCatalogGenerator.js";

function looksGenericCourse(course = {}) {
  const chapterTitles = (course.chapters || []).map((chapter) => chapter.title);
  const topicTitles = (course.chapters || []).flatMap((chapter) => (chapter.topics || []).map((topic) => topic.title));
  const subtopics = (course.chapters || []).flatMap((chapter) =>
    (chapter.topics || []).flatMap((topic) => topic.subtopics || [])
  );

  return (
    chapterTitles.includes("Architecture and Design") ||
    chapterTitles.includes("Implementation") ||
    topicTitles.includes("Practical Application") ||
    subtopics.includes("Overview") ||
    subtopics.includes("Components")
  );
}

function mergeTopicResources(storedTopic = {}, generatedTopic = {}) {
  const storedResources = storedTopic.resources || [];

  return (generatedTopic.resources || []).map((resource) => {
    const matchingStoredResource =
      storedResources.find((candidate) => candidate.id === resource.id) ||
      storedResources.find((candidate) => candidate.title === resource.title && candidate.type === resource.type);

    if (!matchingStoredResource) {
      return resource;
    }

    return {
      ...resource,
      summary: matchingStoredResource.summary || resource.summary || "",
      focusPoints:
        Array.isArray(matchingStoredResource.focusPoints) && matchingStoredResource.focusPoints.length > 0
          ? matchingStoredResource.focusPoints
          : resource.focusPoints || [],
      quizFacts:
        Array.isArray(matchingStoredResource.quizFacts) && matchingStoredResource.quizFacts.length > 0
          ? matchingStoredResource.quizFacts
          : resource.quizFacts || [],
      sourceText: matchingStoredResource.sourceText || resource.sourceText || ""
    };
  });
}

function mergeGeneratedCourseWithStoredData(generatedCourse = {}, storedCourse = {}) {
  const storedChapters = storedCourse.chapters || [];

  return {
    ...generatedCourse,
    chapters: (generatedCourse.chapters || []).map((chapter) => {
      const storedChapter =
        storedChapters.find((candidate) => candidate.id === chapter.id) ||
        storedChapters.find((candidate) => candidate.title === chapter.title);
      const storedTopics = storedChapter?.topics || [];

      return {
        ...chapter,
        topics: (chapter.topics || []).map((topic) => {
          const storedTopic =
            storedTopics.find((candidate) => candidate.id === topic.id) ||
            storedTopics.find((candidate) => candidate.title === topic.title);

          return {
            ...topic,
            resources: mergeTopicResources(storedTopic, topic)
          };
        })
      };
    })
  };
}

export async function getCatalogMap() {
  const documents = await Catalog.find().lean();
  const generatedCatalog = generateAllCourses();
  return documents.reduce((accumulator, item) => {
    const generatedCourse = generatedCatalog[item.subject];
    const resolvedCourse =
      generatedCourse && looksGenericCourse(item)
        ? mergeGeneratedCourseWithStoredData(generatedCourse, item)
        : item;

    accumulator[item.subject] = {
      title: resolvedCourse.title,
      overview: resolvedCourse.overview,
      estimatedHours: resolvedCourse.estimatedHours,
      chapters: resolvedCourse.chapters || []
    };
    return accumulator;
  }, {});
}

export async function getCatalogSubject(subject) {
  return Catalog.findOne({ subject });
}
