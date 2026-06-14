import {
  buildDashboardSummary,
  buildLearningPath,
  calculateProgress,
  learningOptions,
  refreshLearningPathVariant
} from "../services/learningPathService.js";
import { getCatalogMap } from "../services/catalogService.js";
import { courseCategories } from "../services/courseCatalogGenerator.js";
import { buildQuizQuestionsFromFacts, generateResourceQuizFromText } from "../services/resourceQuizIngestionService.js";
import { User } from "../models/User.js";

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function slugify(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, "-");
}

function deriveLegacyPathId(path) {
  const purpose = path?.strategy?.purpose || path?.purpose || "Skill development";
  const level = path?.strategy?.level || path?.level || "Beginner";
  return `${slugify(path?.topic || "path")}-${slugify(purpose)}-${slugify(level)}`;
}

function getPathIdentity(path, fallbackIndex = 0) {
  return path?.pathId || `${deriveLegacyPathId(path)}-${fallbackIndex}`;
}

function findPathIndex(paths = [], identifier = {}) {
  if (!Array.isArray(paths) || paths.length === 0) {
    return -1;
  }

  if (identifier.pathId) {
    const exactIndex = paths.findIndex((path) => getPathIdentity(path) === identifier.pathId || path.pathId === identifier.pathId);
    if (exactIndex >= 0) {
      return exactIndex;
    }
  }

  if (identifier.topic) {
    const matchingTopicPaths = paths
      .map((path, index) => ({ path, index }))
      .filter(({ path }) => path.topic === identifier.topic);

    if (matchingTopicPaths.length === 1) {
      return matchingTopicPaths[0].index;
    }

    if (matchingTopicPaths.length > 1 && identifier.activePathId) {
      const activeMatch = matchingTopicPaths.find(({ path }) => getPathIdentity(path) === identifier.activePathId);
      if (activeMatch) {
        return activeMatch.index;
      }
    }

    if (matchingTopicPaths.length > 0) {
      return matchingTopicPaths
        .sort((left, right) => new Date(right.path.generatedAt || 0) - new Date(left.path.generatedAt || 0))[0]
        .index;
    }
  }

  return -1;
}

async function hydrateUserPaths(user) {
  if (!user) {
    return { user, paths: [], activePathId: null, activePath: null };
  }

  let changed = false;
  const existingPaths = Array.isArray(user.paths) ? [...user.paths] : [];
  const paths = existingPaths.length > 0 ? existingPaths : [];

  if (user.path && paths.length === 0) {
    paths.push(user.path);
    changed = true;
  }

  const usedIds = new Set();
  const normalizedPaths = paths.map((path, index) => {
    let resolvedId = path.pathId || deriveLegacyPathId(path);
    while (usedIds.has(resolvedId)) {
      resolvedId = `${deriveLegacyPathId(path)}-${index + 1}`;
    }
    usedIds.add(resolvedId);

    if (path.pathId !== resolvedId) {
      changed = true;
    }

    return {
      ...path,
      pathId: resolvedId
    };
  });

  let activePathIndex = findPathIndex(normalizedPaths, { pathId: user.activePathId, topic: user.activePathId });
  if (activePathIndex < 0 && user.path) {
    activePathIndex = findPathIndex(normalizedPaths, {
      pathId: user.path.pathId,
      topic: user.path.topic,
      activePathId: user.activePathId
    });
  }
  if (activePathIndex < 0 && normalizedPaths.length > 0) {
    activePathIndex = 0;
  }

  const activePath = activePathIndex >= 0 ? normalizedPaths[activePathIndex] : null;
  const activePathId = activePath ? getPathIdentity(activePath, activePathIndex) : null;

  if (user.activePathId !== activePathId) {
    changed = true;
  }

  if (changed) {
    await User.findByIdAndUpdate(user._id, {
      paths: normalizedPaths,
      activePathId,
      path: activePath
    });
  }

  user.paths = normalizedPaths;
  user.activePathId = activePathId;
  user.path = activePath;

  return { user, paths: normalizedPaths, activePathId, activePath };
}

async function persistCalculatedPath(user, calculatedPath, activity = user.activity || []) {
  const hydrated = await hydrateUserPaths(user);
  const updatedPaths = [...hydrated.paths];
  const pathIndex = findPathIndex(updatedPaths, {
    pathId: calculatedPath.pathId,
    topic: calculatedPath.topic,
    activePathId: hydrated.activePathId
  });

  if (pathIndex >= 0) {
    updatedPaths[pathIndex] = calculatedPath;
  } else {
    updatedPaths.push(calculatedPath);
  }

  await User.findByIdAndUpdate(user._id, {
    path: calculatedPath,
    paths: updatedPaths,
    activePathId: calculatedPath.pathId,
    activity
  });

  return updatedPaths;
}

async function refreshUserPath(path) {
  if (!path?.topic) {
    return path;
  }

  const catalog = await getCatalogMap();
  return refreshLearningPathVariant(path, catalog);
}

function findCatalogResource(catalog, subject, chapterId, topicId, resourceId) {
  const course = catalog?.[subject];
  const chapter = course?.chapters?.find((item) => item.id === chapterId);
  const topic = chapter?.topics?.find((item) => item.id === topicId);
  const resource = topic?.resources?.find((item) => item.id === resourceId);

  return { course, chapter, topic, resource };
}

export function getOptions(_req, res) {
  return res.json(learningOptions);
}

export async function searchCourses(req, res, next) {
  try {
    const { query } = req.query;
    const catalog = await getCatalogMap();
    
    if (!query || query.trim() === '') {
      // Return all subjects organized by categories
      const results = Object.entries(catalog).map(([key, course]) => ({
        subject: key,
        title: course.title,
        overview: course.overview,
        estimatedHours: course.estimatedHours
      })).sort((a, b) => a.title.localeCompare(b.title));
      
      return res.json({ 
        results, 
        categories: courseCategories,
        total: results.length 
      });
    }
    
    // Fuzzy search across subjects, titles, and overviews
    const searchTerm = query.toLowerCase().trim();
    const results = Object.entries(catalog)
      .filter(([key, course]) => {
        const inSubject = key.toLowerCase().includes(searchTerm);
        const inTitle = course.title.toLowerCase().includes(searchTerm);
        const inOverview = course.overview.toLowerCase().includes(searchTerm);
        return inSubject || inTitle || inOverview;
      })
      .map(([key, course]) => ({
        subject: key,
        title: course.title,
        overview: course.overview,
        estimatedHours: course.estimatedHours,
        relevance: (
          (key.toLowerCase() === searchTerm ? 100 : 0) +
          (course.title.toLowerCase().includes(searchTerm) ? 50 : 0) +
          (key.toLowerCase().includes(searchTerm) ? 30 : 0)
        )
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20); // Return top 20 results
    
    res.json({ results, categories: courseCategories, total: results.length });
  } catch (error) {
    next(error);
  }
}

export async function savePreferences(req, res, next) {
  try {
    const { topic, purpose, level } = req.body;

    if (!topic || !purpose || !level) {
      return res.status(400).json({ message: "Please complete all preference steps." });
    }

    const catalog = await getCatalogMap();
    if (!catalog[topic]) {
      return res.status(404).json({ message: "Selected learning topic was not found." });
    }

    const newPath = await buildLearningPath({ topic, purpose, level }, catalog);
    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);
    const duplicateIdExists = hydrated.paths.some((path) => getPathIdentity(path) === newPath.pathId);

    if (duplicateIdExists) {
      newPath.pathId = `${newPath.pathId}-${Date.now()}`;
    }

    const updatedPaths = [...hydrated.paths, newPath];

    await User.findByIdAndUpdate(req.user._id, {
      paths: updatedPaths,
      activePathId: newPath.pathId,
      preferences: { topic, purpose: newPath.purpose, level },
      path: newPath
    });

    const updatedUser = await User.findById(req.user._id);

    return res.json({
      user: sanitizeUser(updatedUser.toObject()),
      path: newPath,
      paths: updatedPaths,
      message: "New learning path added!"
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentPath(req, res, next) {
  try {
    const { topic, pathId } = req.query;
    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);

    if (!hydrated.activePath && hydrated.paths.length === 0) {
      return res.status(404).json({ message: "Learning path not created yet. Please complete your preferences first." });
    }

    const requestedIndex =
      pathId || topic
        ? findPathIndex(hydrated.paths, { pathId, topic, activePathId: hydrated.activePathId })
        : findPathIndex(hydrated.paths, { pathId: hydrated.activePathId });

    const selectedPath = requestedIndex >= 0 ? hydrated.paths[requestedIndex] : hydrated.activePath;
    if (!selectedPath) {
      return res.status(404).json({ message: "Learning path not found for this identifier." });
    }

    const refreshedPath = await refreshUserPath(selectedPath);
    const calculatedPath = calculateProgress(refreshedPath);
    await persistCalculatedPath(user, calculatedPath, user.activity || []);

    return res.json(calculatedPath);
  } catch (error) {
    console.error("Error getting path:", error);
    next(error);
  }
}

// Get all user paths
export async function getAllPaths(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);

    if (hydrated.paths.length === 0) {
      return res.json({ paths: [], activePathId: null, totalPaths: 0 });
    }

    const pathsWithProgress = await Promise.all(
      hydrated.paths.map(async (path, index) => {
        const refreshedPath = await refreshUserPath(path);
        const pathWithProgress = calculateProgress(refreshedPath);
        const identity = getPathIdentity(pathWithProgress, index);

        return {
          pathId: identity,
          topic: pathWithProgress.topic,
          title: pathWithProgress.title,
          purpose: pathWithProgress.purpose || pathWithProgress.strategy?.purpose || "Skill development",
          level: pathWithProgress.level || pathWithProgress.strategy?.level || "Beginner",
          overallProgress: pathWithProgress.overallProgress,
          completedTopics: pathWithProgress.completedTopics,
          totalTopics: pathWithProgress.totalTopics,
          remainingHours: pathWithProgress.remainingHours,
          quizzesCompleted: pathWithProgress.chapters.filter((chapter) => typeof chapter.quiz?.score === "number").length,
          totalChapterQuizzes: pathWithProgress.chapters.length,
          chaptersCount: pathWithProgress.chapters.length,
          isActive: hydrated.activePathId === identity,
          createdAt: pathWithProgress.generatedAt || path.generatedAt
        };
      })
    );

    return res.json({
      paths: pathsWithProgress,
      activePathId: hydrated.activePathId,
      totalPaths: hydrated.paths.length
    });
  } catch (error) {
    console.error("Error getting all paths:", error);
    next(error);
  }
}

// Switch active path
export async function switchPath(req, res, next) {
  try {
    const { pathId, topic } = req.body;

    if (!pathId && !topic) {
      return res.status(400).json({ message: "Path ID or topic is required." });
    }

    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);
    const pathIndex = findPathIndex(hydrated.paths, { pathId, topic, activePathId: hydrated.activePathId });
    const path = pathIndex >= 0 ? await refreshUserPath(hydrated.paths[pathIndex]) : null;

    if (!path) {
      return res.status(404).json({ message: "Learning path not found for this identifier." });
    }

    const activeId = getPathIdentity(path, pathIndex);

    await User.findByIdAndUpdate(req.user._id, {
      activePathId: activeId,
      path,
      preferences: {
        topic: path.topic,
        purpose: path.strategy?.purpose || path.purpose || "Skill development",
        level: path.strategy?.level || path.level || "Beginner"
      }
    });

    return res.json({
      message: `Switched to ${path.title} path`,
      path,
      activePathId: activeId
    });
  } catch (error) {
    next(error);
  }
}

export async function trackResource(req, res, next) {
  try {
    const { topicId, resourceId, action, watchedPercentage = 0, minutes = 0 } = req.body;

    if (!topicId || !resourceId || !action) {
      return res.status(400).json({ message: "Tracking data is incomplete." });
    }

    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);
    const activePath = await refreshUserPath(hydrated.activePath);

    if (!activePath) {
      throw new Error("Learning path not found.");
    }

    const updatedChapters = activePath.chapters.map((chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic) => {
          if (topic.id !== topicId || !topic.unlocked) {
            return topic;
          }

          return {
            ...topic,
            resources: topic.resources.map((resource) => {
              if (resource.id !== resourceId) {
                return resource;
              }

              const interaction = { ...resource.interaction, opened: true };
              if (action === "watch") {
                interaction.watchedPercentage = Math.max(interaction.watchedPercentage, watchedPercentage);
              }
              if (action === "read") {
                interaction.readMinutes += minutes;
              }
              if (action === "complete-course") {
                interaction.completed = true;
              }

              return { ...resource, interaction };
            })
          };
        })
      }));

    const updatedPath = { ...activePath, chapters: updatedChapters };
    const calculatedPath = calculateProgress(updatedPath);
    
    const newActivity = {
      id: `activity-${Date.now()}`,
      pathId: calculatedPath.pathId,
      topicId,
      resourceId,
      action,
      minutes: action === "watch" ? Math.round(minutes || 0) : minutes,
      timestamp: new Date().toISOString()
    };
    
    const updatedActivity = [...(user.activity || []), newActivity];
    await persistCalculatedPath(user, calculatedPath, updatedActivity);

    const dashboard = buildDashboardSummary(calculatedPath, updatedActivity);

    return res.json({ path: calculatedPath, dashboard });
  } catch (error) {
    next(error);
  }
}

export async function submitChapterQuiz(req, res, next) {
  try {
    const { chapterId, answers = [] } = req.body;

    if (!chapterId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Chapter id and quiz answers are required." });
    }

    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);
    const refreshedPath = await refreshUserPath(hydrated.activePath);

    if (!refreshedPath) {
      return res.status(404).json({ message: "Learning path not found." });
    }

    // Ensure we have the latest progress calculated before checking quiz lock status
    const activePath = calculateProgress(refreshedPath);

    const chapter = activePath.chapters.find((item) => item.id === chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    if (!chapter.quiz?.unlocked) {
      return res.status(400).json({ message: "Finish the chapter topics before taking the quiz." });
    }

    const questionResults = chapter.quiz.questions.map((question, index) => {
      const selectedIndex = Number(answers[index]);
      const isCorrect = selectedIndex === question.correctIndex;

      return {
        questionId: question.id,
        selectedIndex,
        correctIndex: question.correctIndex,
        correct: isCorrect,
        explanation: question.explanation
      };
    });

    const correctAnswers = questionResults.filter((result) => result.correct).length;

    const score = chapter.quiz.questions.length === 0
      ? 0
      : Math.round((correctAnswers / chapter.quiz.questions.length) * 100);

    const updatedChapters = activePath.chapters.map((item) =>
      item.id === chapterId
        ? {
            ...item,
            quiz: {
              ...item.quiz,
              score,
              attempts: (item.quiz?.attempts || 0) + 1,
              completed: true,
              correctAnswers,
              totalQuestions: item.quiz.questions.length,
              results: questionResults,
              submittedAt: new Date().toISOString()
            }
          }
        : item
    );

    const updatedPath = { ...activePath, chapters: updatedChapters };
    const calculatedPath = calculateProgress(updatedPath);
    
    const newActivity = {
      id: `quiz-${Date.now()}`,
      pathId: calculatedPath.pathId,
      chapterId,
      action: "quiz",
      minutes: 10,
      score,
      correctAnswers,
      totalQuestions: chapter.quiz.questions.length,
      timestamp: new Date().toISOString()
    };
    
    const updatedActivity = [...(user.activity || []), newActivity];
    await persistCalculatedPath(user, calculatedPath, updatedActivity);

    return res.json({
      score,
      correctAnswers,
      totalQuestions: chapter.quiz.questions.length,
      results: questionResults,
      path: calculatedPath,
      dashboard: buildDashboardSummary(calculatedPath, updatedActivity)
    });
  } catch (error) {
    next(error);
  }
}

export async function getResourceQuiz(req, res, next) {
  try {
    const {
      subject,
      chapterId,
      topicId,
      resourceId,
      sourceText,
      resourceTitle,
      level = "Beginner"
    } = req.body;

    if (sourceText) {
      const generated = generateResourceQuizFromText(sourceText, resourceTitle || "Pasted Resource", level);
      return res.json({
        source: "pasted-text",
        title: resourceTitle || "Pasted Resource",
        summary: generated.summary,
        focusPoints: generated.focusPoints,
        quizFacts: generated.quizFacts,
        questions: generated.questions
      });
    }

    if (!subject || !chapterId || !topicId || !resourceId) {
      return res.status(400).json({
        message: "Provide pasted sourceText or subject, chapterId, topicId, and resourceId."
      });
    }

    const catalog = await getCatalogMap();
    const { course, chapter, topic, resource } = findCatalogResource(catalog, subject, chapterId, topicId, resourceId);

    if (!course || !chapter || !topic || !resource) {
      return res.status(404).json({ message: "Requested resource was not found in the catalog." });
    }

    if ((!resource.quizFacts || resource.quizFacts.length === 0) && resource.sourceText) {
      const generated = generateResourceQuizFromText(resource.sourceText, resource.title, level);
      return res.json({
        source: "catalog-resource-text",
        subject,
        chapterTitle: chapter.title,
        topicTitle: topic.title,
        title: resource.title,
        summary: generated.summary,
        focusPoints: generated.focusPoints,
        quizFacts: generated.quizFacts,
        questions: generated.questions
      });
    }

    if (!resource.quizFacts || resource.quizFacts.length === 0) {
      return res.status(400).json({
        message: "This resource has no ingested transcript/PDF text yet. Paste text through admin ingestion first or send sourceText directly."
      });
    }

    return res.json({
      source: "catalog-quiz-facts",
      subject,
      chapterTitle: chapter.title,
      topicTitle: topic.title,
      title: resource.title,
      summary: resource.summary || "",
      focusPoints: resource.focusPoints || [],
      quizFacts: resource.quizFacts,
      questions: buildQuizQuestionsFromFacts(resource.quizFacts, level)
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const hydrated = await hydrateUserPaths(user);

    if (!hydrated.activePath) {
      return res.status(404).json({ message: "Create a learning path first." });
    }

    const refreshedPath = await refreshUserPath(hydrated.activePath);
    const calculatedPath = calculateProgress(refreshedPath);
    await persistCalculatedPath(user, calculatedPath, user.activity || []);

    return res.json(buildDashboardSummary(calculatedPath, user.activity || []));
  } catch (error) {
    next(error);
  }
}
