import { completeQuizQuestionBanks as quizQuestionBanks } from "./quizQuestionBank.js";
import { getCatalogMap } from "./catalogService.js";

export const learningOptions = {
  subjects: [], // Will be populated dynamically from database
  purposes: ["Job preparation", "Skill development", "Project development", "Academic learning", "Interview preparation", "Career switch", "Competitive exams"],
  levels: ["Beginner", "Intermediate", "Advanced"]
};

const PURPOSE_ALIASES = {
  "project development": "building projects"
};

const PURPOSE_PROFILES = {
  "job preparation": {
    contentStyle: "Career-ready topics, portfolio checkpoints, and practical revision blocks.",
    structureStyle: "Milestone-led roadmap with outcomes that map to employability.",
    quizStyle: "Application-focused questions that validate job readiness.",
    practiceStyle: "Portfolio tasks, interview checkpoints, and role-aligned exercises."
  },
  "skill development": {
    contentStyle: "Concept depth with repeated hands-on reinforcement.",
    structureStyle: "Layered path that revisits core ideas with progressively stronger practice.",
    quizStyle: "Concept checks mixed with applied reinforcement questions.",
    practiceStyle: "Skill drills, repetition, and gradual mastery loops."
  },
  "building projects": {
    contentStyle: "Practical, hands-on content centered around deliverables.",
    structureStyle: "Build-first progression that moves from foundations to real project work.",
    quizStyle: "Scenario-based questions grounded in implementation decisions.",
    practiceStyle: "Mini builds, debugging tasks, and demo-ready project checkpoints."
  },
  "academic learning": {
    contentStyle: "Theory-first explanations with structured conceptual coverage.",
    structureStyle: "Syllabus-like sequencing with chapter-by-chapter depth.",
    quizStyle: "Theory-based questions that reinforce definitions, principles, and relationships.",
    practiceStyle: "Detailed explanations, summaries, and formal knowledge checks."
  },
  "interview preparation": {
    contentStyle: "High-yield concepts, patterns, and problem-solving essentials.",
    structureStyle: "Revision-friendly flow that surfaces important concepts quickly.",
    quizStyle: "Concept + logic-based questions designed for interview-style recall.",
    practiceStyle: "Problem solving, targeted revision, and mock-style checks."
  },
  "career switch": {
    contentStyle: "Foundations-first coverage with confidence-building practical work.",
    structureStyle: "Progressive roadmap that bridges basics into real-world competence.",
    quizStyle: "Foundational questions with real-world transition scenarios.",
    practiceStyle: "Skill transfer exercises and practical confidence builders."
  },
  "competitive exams": {
    contentStyle: "Exam-oriented content with prioritised coverage of scoring areas.",
    structureStyle: "Timed-practice-friendly sequence with systematic revision.",
    quizStyle: "Accuracy-oriented concept checks with exam-style distractors.",
    practiceStyle: "Timed review, pattern recognition, and question-heavy revision."
  }
};

const PURPOSE_RESOURCE_MAP = {
  "job preparation": {
    videoPrefix: "Career-focused",
    articlePrefix: "Hiring-aligned",
    pdfPrefix: "Job-ready",
    coursePrefix: "Placement-focused",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=career+focused+software+development+tutorial",
        "https://www.youtube.com/results?search_query=developer+career+roadmap"
      ],
      article: [
        "https://roadmap.sh/",
        "https://www.geeksforgeeks.org/"
      ],
      pdf: [
        "https://roadmap.sh/",
        "https://www.interviewbit.com/"
      ],
      course: [
        "https://www.freecodecamp.org/learn/",
        "https://www.coursera.org/"
      ]
    }
  },
  "skill development": {
    videoPrefix: "Skill-building",
    articlePrefix: "Deep-dive",
    pdfPrefix: "Practice-ready",
    coursePrefix: "Guided",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=skill+development+tutorial",
        "https://www.youtube.com/results?search_query=concept+practice+tutorial"
      ],
      article: [
        "https://developer.mozilla.org/",
        "https://www.geeksforgeeks.org/"
      ],
      pdf: [
        "https://roadmap.sh/",
        "https://refactoring.guru/"
      ],
      course: [
        "https://www.freecodecamp.org/learn/",
        "https://www.coursera.org/"
      ]
    }
  },
  "building projects": {
    videoPrefix: "Project build",
    articlePrefix: "Implementation",
    pdfPrefix: "Project blueprint",
    coursePrefix: "Hands-on project",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=build+real+project+tutorial",
        "https://www.youtube.com/results?search_query=project+development+walkthrough"
      ],
      article: [
        "https://github.com/",
        "https://roadmap.sh/"
      ],
      pdf: [
        "https://github.com/",
        "https://roadmap.sh/"
      ],
      course: [
        "https://www.freecodecamp.org/learn/",
        "https://www.kaggle.com/learn/"
      ]
    }
  },
  "academic learning": {
    videoPrefix: "Theory lecture",
    articlePrefix: "Academic notes",
    pdfPrefix: "Structured reference",
    coursePrefix: "Syllabus-based",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=theory+lecture+computer+science",
        "https://www.youtube.com/results?search_query=academic+course+lecture"
      ],
      article: [
        "https://www.tutorialspoint.com/",
        "https://www.geeksforgeeks.org/"
      ],
      pdf: [
        "https://roadmap.sh/",
        "https://ocw.mit.edu/"
      ],
      course: [
        "https://www.coursera.org/",
        "https://www.edx.org/"
      ]
    }
  },
  "interview preparation": {
    videoPrefix: "Interview-focused",
    articlePrefix: "Interview concepts",
    pdfPrefix: "Revision sheet",
    coursePrefix: "Interview prep",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=technical+interview+prep+tutorial",
        "https://www.youtube.com/results?search_query=interview+questions+explained"
      ],
      article: [
        "https://www.interviewbit.com/",
        "https://www.geeksforgeeks.org/"
      ],
      pdf: [
        "https://www.interviewbit.com/",
        "https://roadmap.sh/"
      ],
      course: [
        "https://leetcode.com/",
        "https://www.freecodecamp.org/learn/"
      ]
    }
  },
  "career switch": {
    videoPrefix: "Transition-ready",
    articlePrefix: "Foundation bridge",
    pdfPrefix: "Switch guide",
    coursePrefix: "Career switch",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=career+switch+tech+tutorial",
        "https://www.youtube.com/results?search_query=beginner+to+developer+roadmap"
      ],
      article: [
        "https://roadmap.sh/",
        "https://www.geeksforgeeks.org/"
      ],
      pdf: [
        "https://roadmap.sh/",
        "https://refactoring.guru/"
      ],
      course: [
        "https://www.freecodecamp.org/learn/",
        "https://www.coursera.org/"
      ]
    }
  },
  "competitive exams": {
    videoPrefix: "Exam-oriented",
    articlePrefix: "Objective review",
    pdfPrefix: "Exam notes",
    coursePrefix: "Competitive prep",
    links: {
      video: [
        "https://www.youtube.com/results?search_query=competitive+exam+computer+science+prep",
        "https://www.youtube.com/results?search_query=gate+cs+preparation"
      ],
      article: [
        "https://www.geeksforgeeks.org/",
        "https://www.sanfoundry.com/"
      ],
      pdf: [
        "https://www.sanfoundry.com/",
        "https://www.tutorialspoint.com/"
      ],
      course: [
        "https://www.coursera.org/",
        "https://www.freecodecamp.org/learn/"
      ]
    }
  }
};

// Function to load subjects from database
export async function loadLearningOptions() {
  try {
    const catalog = await getCatalogMap();
    learningOptions.subjects = Object.keys(catalog).sort();
    console.log(`Loaded ${learningOptions.subjects.length} subjects from database`);
  } catch (error) {
    console.error('Failed to load learning options:', error.message);
    // Fallback to default subjects if database fails
    learningOptions.subjects = ["Python", "Web Development", "Frontend", "Backend", "Technical Skills"];
  }
}

function purposeFocus(purpose) {
  switch (normalizePurpose(purpose)) {
    case "Job preparation":
      return "Prioritize project milestones, interview readiness, and portfolio checkpoints.";
    case "Skill development":
      return "Focus on depth, repetition, and hands-on practice with curated reinforcement.";
    case "Project development":
    case "Building projects":
      return "Bias toward implementation tasks, mini-builds, and demo-ready deliverables.";
    case "Academic learning":
      return "Support conceptual clarity with structured reading and milestone summaries.";
    case "Interview preparation":
      return "Emphasize problem-solving patterns, mock interviews, and technical question practice.";
    case "Career switch":
      return "Build foundational knowledge with practical projects to demonstrate new competencies.";
    case "Competitive exams":
      return "Focus on exam patterns, timed practice, and comprehensive topic coverage.";
    default:
      return "Support conceptual clarity with structured reading and milestone summaries.";
  }
}

function normalizePurpose(purpose = "Skill development") {
  const trimmed = String(purpose || "Skill development").trim();
  const canonical = PURPOSE_ALIASES[trimmed.toLowerCase()];

  if (!canonical) {
    return trimmed;
  }

  if (canonical === "building projects") {
    return "Building projects";
  }

  return trimmed;
}

function slugify(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, "-");
}

function getPurposeProfile(purpose) {
  const normalizedPurpose = normalizePurpose(purpose);
  return PURPOSE_PROFILES[normalizedPurpose.toLowerCase()] || PURPOSE_PROFILES["skill development"];
}

function getPurposeResourceProfile(purpose) {
  const normalizedPurpose = normalizePurpose(purpose);
  return PURPOSE_RESOURCE_MAP[normalizedPurpose.toLowerCase()] || PURPOSE_RESOURCE_MAP["skill development"];
}

function levelAdjustment(level) {
  switch (level) {
    case "Beginner":
      return {
        pace: "steady",
        revisionMinutes: 20,
        difficulty: "Foundational",
        contentDepth: "Guided fundamentals with frequent reinforcement.",
        hint: "Start with fundamentals and reinforce with short revision loops."
      };
    case "Intermediate":
      return {
        pace: "accelerated",
        revisionMinutes: 15,
        difficulty: "Applied",
        contentDepth: "Balanced concept review with faster progression into practice.",
        hint: "Move quickly through basics and spend more time connecting concepts."
      };
    default:
      return {
        pace: "intensive",
        revisionMinutes: 10,
        difficulty: "Advanced",
        contentDepth: "Compressed revision with challenge-heavy execution.",
        hint: "Use advanced resources and concentrate on challenge-based learning."
      };
  }
}

function getLevelResourceConfig(level) {
  switch (level) {
    case "Beginner":
      return {
        titlePrefix: "Beginner",
        durationMultiplier: 1.1,
        completionRules: { videoPercentage: 60, readMinutes: 12 },
        note: "foundation-focused"
      };
    case "Intermediate":
      return {
        titlePrefix: "Intermediate",
        durationMultiplier: 1,
        completionRules: { videoPercentage: 70, readMinutes: 10 },
        note: "application-focused"
      };
    default:
      return {
        titlePrefix: "Advanced",
        durationMultiplier: 0.9,
        completionRules: { videoPercentage: 80, readMinutes: 8 },
        note: "challenge-focused"
      };
  }
}

function rotateArray(items, index) {
  if (!items?.length) {
    return [];
  }

  const shift = index % items.length;
  return items.slice(shift).concat(items.slice(0, shift));
}

function buildSearchResourceUrl(courseTitle, chapterTitle, topicTitle, purpose, level, resourceType) {
  const query = encodeURIComponent(
    `${courseTitle} ${chapterTitle} ${topicTitle} ${purpose} ${level} ${resourceType}`
  );

  if (resourceType === "video") {
    return `https://www.youtube.com/results?search_query=${query}`;
  }

  if (resourceType === "course") {
    return `https://www.google.com/search?q=${query}+course`;
  }

  if (resourceType === "pdf") {
    return `https://www.google.com/search?q=${query}+filetype%3Apdf`;
  }

  return `https://www.google.com/search?q=${query}`;
}

import { searchYouTubeVideos } from "./youtubeService.js";
import { searchWebForExactLink } from "./webSearchService.js";

async function buildAdaptiveResource(resource, topic, chapter, purpose, level, resourceIndex, subjectName = "") {
  const purposeProfile = getPurposeResourceProfile(purpose);
  const levelProfile = getLevelResourceConfig(level);
  
  // Use resource.url directly to avoid going to the search bar panel
  let chosenLink = resource.url;
  
  // Identify placeholder videos that should be replaced with real content
  const isPlaceholder = chosenLink && (
    chosenLink.includes("8ext9G7xspg") || 
    chosenLink.includes("rfscVS0vtbw") || 
    chosenLink.includes("pTB0EiLXUC8") || 
    chosenLink.includes("UB1O30fR-EE") || 
    chosenLink.includes("bMknfKXIFA8")
  );

  // If resource.url is a search query, empty, or a placeholder, we can try to find a better fallback,
  // but prioritize the direct resource.url if it exists and is not a search link
  if (!chosenLink || chosenLink.includes("search_query") || isPlaceholder) {
     const links = purposeProfile.links[resource.type] || [resource.url];
     const rotatedLinks = rotateArray(links, resourceIndex);
     const validRotated = rotatedLinks.find(link => link && !link.includes("search_query") && !isPlaceholder);
     
     if (validRotated) {
         chosenLink = validRotated;
     } else if (!chosenLink || isPlaceholder) {
         chosenLink = buildSearchResourceUrl(subjectName, chapter.title, topic.title, purpose, level, resource.type);
     }
  }

  // If the chosen link is STILL a search query and it's a video, try to get a real video
  if (chosenLink && chosenLink.includes("search_query") && resource.type === "video") {
    try {
      // Extract query or build a very specific one for the subject
      const urlObj = new URL(chosenLink);
      const queryStr = urlObj.searchParams.get("search_query") || `${subjectName} ${topic.title} tutorial`;
      
      const videos = await searchYouTubeVideos(queryStr, 1);
      if (videos && videos.length > 0) {
        chosenLink = videos[0].url;
      }
    } catch (e) {
      console.error("Failed to fetch real youtube video, falling back to search link", e);
    }
  }

  // Transform generic homepages or search links into EXACT direct content links
  const genericHomepages = [
    "https://www.geeksforgeeks.org/", "https://roadmap.sh/", "https://www.coursera.org/", 
    "https://www.interviewbit.com/", "https://github.com/", "https://www.freecodecamp.org/learn/",
    "https://developer.mozilla.org/", "https://refactoring.guru/", "https://www.tutorialspoint.com/",
    "https://ocw.mit.edu/", "https://www.edx.org/", "https://leetcode.com/", "https://www.sanfoundry.com/",
    "https://www.kaggle.com/", "https://www.kaggle.com/learn/", "https://machinelearningmastery.com/",
    "https://www.analyticsvidhya.com/", "https://roadmap.sh/ai-data-scientist", "https://www.cybr.com/",
    "https://www.kali.org/", "https://www.nist.gov/"
  ];
  
  const isGeneric = chosenLink && genericHomepages.includes(chosenLink);
  const isSearch = chosenLink && (chosenLink.includes("search?q=") || chosenLink.includes("search_query"));

  // NEW LOGIC based on user request:
  // - Courses should open the platform (direct link if possible, otherwise platform search)
  // - Articles/PDFs (Browse) should open Google search results
  if (chosenLink && (isGeneric || isSearch)) {
    try {
      if (resource.type === "course") {
        // For courses, try to find an EXACT direct link on the platform
        const queryStr = isGeneric 
          ? `site:${new URL(chosenLink).hostname} ${subjectName} ${topic.title} course`
          : new URL(chosenLink).searchParams.get("q") || new URL(chosenLink).searchParams.get("search_query") || `${subjectName} ${topic.title} course`;
        
        const searchResult = await searchWebForExactLink(queryStr);
        if (searchResult && searchResult.url) {
          chosenLink = searchResult.url;
        }
      } else if (resource.type === "article" || resource.type === "pdf") {
        // Construct a clean, professional search query
        // Include the subjectName (e.g. "Java") to make it specific
        const queryStr = `${subjectName} ${topic.title} ${resource.title}`.replace(/  +/g, ' ').trim();
        
        // Remove redundant words (case-insensitive) to make search cleaner
        const redundantWords = ["Foundations", "Chapter", "Basics", "Tutorial", "Beginner", "Intermediate", "Advanced", "Supplemental"];
        const words = queryStr.split(' ');
        const filteredWords = words.filter((word, index) => {
          const isRedundant = redundantWords.some(r => r.toLowerCase() === word.toLowerCase());
          const isDuplicate = words.indexOf(word) !== index;
          return !isRedundant || !isDuplicate;
        });
        
        const cleanedQuery = filteredWords.join(' ');
        
        chosenLink = resource.type === "pdf" 
          ? `https://www.google.com/search?q=${encodeURIComponent(cleanedQuery)}+filetype%3Apdf`
          : `https://www.google.com/search?q=${encodeURIComponent(cleanedQuery)}`;
      }
    } catch (e) {
      console.error("Failed to handle type-specific link generation", e);
    }
  }

  // Disabling live DuckDuckGo searches to prevent rate-limiting and huge delays.
  // The system will now use the fast, predefined or search-based URLs.

  const purposePrefix = purposeProfile[`${resource.type}Prefix`] || purposeProfile.articlePrefix;
  const adaptedTitle = `${levelProfile.titlePrefix} ${purposePrefix} ${topic.title}`;
  const adaptedDuration = Math.max(10, Math.round((resource.durationMinutes || 20) * levelProfile.durationMultiplier));

  return {
    ...resource,
    id: `${resource.id}-${slugify(purpose)}-${slugify(level)}`,
    title: `${adaptedTitle}: ${resource.title}`,
    url: chosenLink,
    durationMinutes: adaptedDuration,
    adaptation: {
      purpose,
      level,
      chapter: chapter.title,
      topic: topic.title,
      originalTitle: resource.title,
      originalUrl: resource.url,
      learningStyle: levelProfile.note
    }
  };
}

async function buildPurposeLevelResources(topic, chapter, purpose, level, subjectName = "") {
  const purposeProfile = getPurposeProfile(purpose);
  const levelProfile = getLevelResourceConfig(level);
  
  const baseResources = await Promise.all(
    (topic.resources || []).map((resource, resourceIndex) =>
      buildAdaptiveResource(resource, topic, chapter, purpose, level, resourceIndex, subjectName)
    )
  );

  const searchUrl = buildSearchResourceUrl(chapter.title, chapter.title, topic.title, purpose, level, "supplemental");
  let supplementalUrl = searchUrl;
  let supplementalQuizFacts = [];
  let supplementalSummary = "";
  
  try {
    // Disabled live DuckDuckGo search for supplemental links to improve performance
  } catch (e) {
    console.error("Failed to fetch exact web link for supplemental", e);
  }

  const existingTypes = new Set(baseResources.map(r => r.type));
  let preferredType = purpose === "Interview preparation" ? "article" : purpose === "Academic learning" ? "pdf" : "course";
  
  if (existingTypes.has(preferredType)) {
    preferredType = ["video", "article", "pdf", "course"].find(t => !existingTypes.has(t)) || "course";
  }

  const supplementalResource = {
    id: `${topic.id}-${slugify(purpose)}-${slugify(level)}-supplemental`,
    type: preferredType,
    title: `${levelProfile.titlePrefix} ${topic.title} ${purposeProfile.practiceStyle}`,
    url: supplementalUrl,
    durationMinutes: purpose === "Academic learning" ? 35 : 30,
    quizFacts: supplementalQuizFacts,
    summary: supplementalSummary,
    adaptation: {
      purpose,
      level,
      chapter: chapter.title,
      topic: topic.title,
      generated: true,
      learningStyle: levelProfile.note
    },
    interaction: {
      watchedPercentage: 0,
      readMinutes: 0,
      completed: false,
      opened: false
    }
  };

  return [...baseResources, supplementalResource];
}

function buildChapterQuiz(chapter, chapterIndex, purpose = "Skill development", level = "Beginner") {
  const questions = buildPurposeSpecificChapterQuestions(chapter, chapterIndex, purpose, level).slice(0, 20);

  return {
    id: `${chapter.id}-quiz`,
    title: `${chapter.title} Quiz`,
    unlocked: chapterIndex === 0,
    completed: false,
    score: null,
    attempts: 0,
    questions,
    totalQuestions: questions.length
  };
}

function normalizeQuestionBank(bank, purpose, level = "Beginner") {
  if (!bank) {
    return [];
  }

  const normalizedPurpose = normalizePurpose(purpose).toLowerCase();

  if (Array.isArray(bank)) {
    return bank;
  }

  const purposeBucket = bank[normalizedPurpose] || bank.general || [];

  if (Array.isArray(purposeBucket)) {
    return purposeBucket;
  }

  return purposeBucket[level] || purposeBucket.Beginner || [];
}

function uniqueItems(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildOptions(correct, pool, fallback = []) {
  const options = [correct];

  for (const option of [...pool, ...fallback]) {
    if (option && option !== correct && !options.includes(option)) {
      options.push(option);
    }

    if (options.length === 4) {
      break;
    }
  }

  while (options.length < 4) {
    options.push(`${correct} review`);
  }

  return options;
}

function rotateOptions(options, index) {
  if (!options.length) {
    return options;
  }

  const shift = index % options.length;
  return options.slice(shift).concat(options.slice(0, shift));
}

function createGeneratedQuestion({ id, prompt, correct, pool, explanation, index, fallbackOptions }) {
  const options = rotateOptions(buildOptions(correct, pool, fallbackOptions), index);

  return {
    id,
    prompt,
    options,
    correctIndex: options.indexOf(correct),
    explanation
  };
}

function createResourceFactQuestion({ resource, fact, chapterId, index, level, fallbackOptions }) {
  const distractors = Array.isArray(fact?.distractors) ? fact.distractors : [];
  const question = createGeneratedQuestion({
    id: `${chapterId}-resource-fact-q${index + 1}`,
    prompt: fact.prompt,
    correct: fact.answer,
    pool: distractors,
    fallbackOptions,
    explanation: fact.explanation || `${fact.answer} is stated in ${resource.title}.`,
    index
  });

  return addLevelHintToQuestion(question, level);
}

function generateResourceFactQuestions(chapter, level) {
  const fallbackOptions = uniqueItems([
    chapter.title,
    chapter.description,
    ...chapter.topics.flatMap((topic) => topic.subtopics || []),
    ...chapter.topics.flatMap((topic) => (topic.resources || []).flatMap((resource) => resource.focusPoints || []))
  ]).filter(Boolean);

  const questions = [];

  chapter.topics.forEach((topic) => {
    (topic.resources || []).forEach((resource) => {
      (resource.quizFacts || []).forEach((fact, factIndex) => {
        if (!fact?.prompt || !fact?.answer) {
          return;
        }

        questions.push(
          createResourceFactQuestion({
            resource,
            fact,
            chapterId: chapter.id,
            index: questions.length + factIndex,
            level,
            fallbackOptions
          })
        );
      });
    });
  });

  return questions;
}

function buildPurposeSpecificChapterQuestions(chapter, chapterIndex, purpose, level) {
  const seededQuestions = normalizeQuestionBank(quizQuestionBanks[chapter.id], purpose, level)
    .map((question, index) => addLevelHintToQuestion({
      ...question,
      id: question.id || `${chapter.id}-seed-q${index + 1}`
    }, level));

  const workspaceQuestions = seededQuestions.filter(q => q.id && q.id.includes('-ws-'));
  if (workspaceQuestions.length > 0) {
    return workspaceQuestions;
  }

  const resourceFactQuestions = generateResourceFactQuestions(chapter, level);
  const generatedQuestions = generateChapterQuestions(chapter, purpose, level);
  const combined = [];
  const seenPrompts = new Set();

  for (const question of [...seededQuestions, ...resourceFactQuestions, ...generatedQuestions]) {
    const promptKey = question.prompt?.trim().toLowerCase();
    if (!promptKey || seenPrompts.has(promptKey)) {
      continue;
    }

    if (question.options?.length === 4 && typeof question.correctIndex === "number") {
      seenPrompts.add(promptKey);
      combined.push(question);
    }

    if (combined.length === 20) {
      break;
    }
  }

  if (combined.length < 20) {
    return combined.concat(generateFallbackQuestionSet(chapter, purpose, level, combined.length, 20 - combined.length));
  }

  return combined;
}

function addLevelHintToQuestion(question, level) {
  if (level === "Intermediate") {
    return {
      ...question,
      prompt: `${question.prompt} [Intermediate]`
    };
  }

  if (level === "Advanced") {
    return {
      ...question,
      prompt: `${question.prompt} [Advanced]`,
      explanation: `${question.explanation} This version expects stronger synthesis and faster recall.`
    };
  }

  return {
    ...question,
    prompt: `${question.prompt} [Beginner]`
  };
}

function generateChapterQuestions(chapter, purpose, level) {
  const normalizedPurpose = normalizePurpose(purpose);
  const purposeProfile = getPurposeProfile(normalizedPurpose);
  const topics = chapter.topics || [];
  const topicTitles = uniqueItems(topics.map((topic) => topic.title));
  const subtopics = uniqueItems(topics.flatMap((topic) => topic.subtopics || []));
  const resourceTitles = uniqueItems(topics.flatMap((topic) => (topic.resources || []).map((resource) => resource.title)));
  const resourceFocusPoints = uniqueItems(
    topics.flatMap((topic) => (topic.resources || []).flatMap((resource) => resource.focusPoints || []))
  );
  const chapterTerms = uniqueItems([...topicTitles, ...subtopics, ...resourceTitles, ...resourceFocusPoints]);
  const fallbackOptions = uniqueItems([...chapterTerms, chapter.title, chapter.description]).filter(Boolean);
  const questions = [];

  topics.forEach((topic, topicIndex) => {
    const topicPool = uniqueItems([
      ...topics.filter((candidate) => candidate.title !== topic.title).map((candidate) => candidate.title),
      ...subtopics.filter((item) => !(topic.subtopics || []).includes(item))
    ]);
    const leadSubtopic = topic.subtopics?.[0] || topic.title;
    const supportingSubtopic = topic.subtopics?.[1] || leadSubtopic;
    const resourceTitle = topic.resources?.[0]?.title || `${topic.title} walkthrough`;
    const resourceType = topic.resources?.[0]?.type || "resource";
    const resourceFocus = topic.resources?.[0]?.focusPoints?.[0] || leadSubtopic;
    const supportingResourceFocus = topic.resources?.[0]?.focusPoints?.[1] || supportingSubtopic;
    const resourceOptions = uniqueItems(
      topics.flatMap((candidate) => (candidate.resources || []).map((resource) => resource.title)).filter((title) => title !== resourceTitle)
    );
    const resourceFocusOptions = uniqueItems(
      topics.flatMap((candidate) => (candidate.resources || []).flatMap((resource) => resource.focusPoints || []))
        .filter((focusPoint) => focusPoint !== resourceFocus)
    );

    if (normalizedPurpose === "Interview preparation") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-logic-q${questions.length + 1}`,
          prompt: `During an interview, which concept from "${topic.title}" should you explain first to show clear reasoning?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is a core concept inside "${topic.title}" and is a strong starting point for an interview-style explanation.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-logic-q${questions.length + 2}`,
          prompt: `Which idea best helps a learner justify how "${topic.title}" works in a step-by-step interview answer?`,
          correct: supportingSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${supportingSubtopic} is directly tied to "${topic.title}" and supports logic-driven explanation.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-logic-q${questions.length + 3}`,
          prompt: `If an interviewer asks about "${resourceFocus}", which chapter resource should you cite first?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} explicitly covers ${resourceFocus}, so it is the strongest reference from this chapter.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (normalizedPurpose === "Academic learning") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-theory-q${questions.length + 1}`,
          prompt: `Which concept is explicitly included in the theoretical coverage of "${topic.title}"?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is one of the listed subtopics under "${topic.title}", so it belongs to this chapter's formal coverage.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-theory-q${questions.length + 2}`,
          prompt: `Which statement best matches the structured chapter focus for "${topic.title}"?`,
          correct: topic.title,
          pool: topicPool,
          fallbackOptions,
          explanation: `${topic.title} is one of the chapter's named topics and anchors its theory sequence.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-theory-q${questions.length + 3}`,
          prompt: `Which resource should be cited when explaining "${resourceFocus}" in an academic review?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} includes ${resourceFocus} as one of its focus areas, so it best supports a theory-first review.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (["Project development", "Building projects"].includes(normalizedPurpose)) {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-scenario-q${questions.length + 1}`,
          prompt: `While building a project in this chapter, which focus area from "${resourceTitle}" would you apply first?`,
          correct: resourceFocus,
          pool: resourceFocusOptions,
          fallbackOptions,
          explanation: `${resourceTitle} directly focuses on ${resourceFocus}, making it the most relevant first application point.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-scenario-q${questions.length + 2}`,
          prompt: `A real-world task depends on "${topic.title}". Which supporting focus area best strengthens the implementation?`,
          correct: supportingResourceFocus,
          pool: resourceFocusOptions,
          fallbackOptions,
          explanation: `${supportingResourceFocus} is one of the resource-backed focus areas for "${topic.title}" and strengthens implementation.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-scenario-q${questions.length + 3}`,
          prompt: `Which chapter resource would be the best reference while implementing "${resourceFocus}" in a project?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} explicitly covers ${resourceFocus}, so it is the closest implementation reference.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (normalizedPurpose === "Competitive exams") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-exam-q${questions.length + 1}`,
          prompt: `For an objective exam question from "${topic.title}", which concept should be recalled first?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is a direct concept from "${topic.title}" and matches an exam-style recall pattern.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-exam-q${questions.length + 2}`,
          prompt: `Which option is most likely to appear as a correct answer from the chapter area "${topic.title}"?`,
          correct: supportingSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${supportingSubtopic} belongs to "${topic.title}" and fits objective exam-style testing.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-exam-q${questions.length + 3}`,
          prompt: `Which learning material best supports quick revision for "${resourceFocus}" before a competitive exam?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} covers ${resourceFocus} and is the closest revision resource inside this chapter.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (normalizedPurpose === "Job preparation") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-job-q${questions.length + 1}`,
          prompt: `Which concept from "${topic.title}" is most useful when preparing for a hiring assessment?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is a core idea in "${topic.title}" and supports job-readiness preparation.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-job-q${questions.length + 2}`,
          prompt: `Which chapter concept best strengthens practical readiness for "${topic.title}"?`,
          correct: supportingSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${supportingSubtopic} supports applied understanding inside "${topic.title}" and aligns with job preparation.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-job-q${questions.length + 3}`,
          prompt: `Which resource should a learner review to become job-ready in "${resourceFocus}"?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} is the strongest chapter resource for preparing practical readiness in ${resourceFocus}.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (normalizedPurpose === "Career switch") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-switch-q${questions.length + 1}`,
          prompt: `A learner switching careers starts "${topic.title}". Which concept should be learned first?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is a foundational concept in "${topic.title}" and fits a career-transition learning order.`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-switch-q${questions.length + 2}`,
          prompt: `Which supporting idea helps a career-switch learner connect "${topic.title}" to practical work?`,
          correct: supportingSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${supportingSubtopic} supports "${topic.title}" and helps bridge theory into practical use.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-switch-q${questions.length + 3}`,
          prompt: `Which resource is the best bridge into hands-on understanding for "${resourceFocus}"?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} is directly tied to ${resourceFocus} and supports a learner transitioning into the field.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    if (normalizedPurpose === "Skill development") {
      questions.push(
        createGeneratedQuestion({
          id: `${chapter.id}-skill-q${questions.length + 1}`,
          prompt: `Which concept from "${topic.title}" should be practiced repeatedly to build skill depth?`,
          correct: leadSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${leadSubtopic} is a direct skill-building concept from "${topic.title}".`,
          index: topicIndex
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-skill-q${questions.length + 2}`,
          prompt: `Which idea best reinforces consistent practice in "${topic.title}"?`,
          correct: supportingSubtopic,
          pool: topicPool,
          fallbackOptions,
          explanation: `${supportingSubtopic} deepens understanding within "${topic.title}" and suits repetition-based practice.`,
          index: topicIndex + 1
        }),
        createGeneratedQuestion({
          id: `${chapter.id}-skill-q${questions.length + 3}`,
          prompt: `Which resource is most useful for strengthening the skill of "${resourceFocus}"?`,
          correct: resourceTitle,
          pool: resourceOptions,
          fallbackOptions,
          explanation: `${resourceTitle} is linked to ${resourceFocus} and supports repeated skill reinforcement.`,
          index: topicIndex + 2
        })
      );
      return;
    }

    questions.push(
      createGeneratedQuestion({
        id: `${chapter.id}-general-q${questions.length + 1}`,
        prompt: `Which concept is directly covered in "${topic.title}"?`,
        correct: leadSubtopic,
        pool: topicPool,
        fallbackOptions,
        explanation: `${leadSubtopic} is one of the key ideas studied in "${topic.title}".`,
        index: topicIndex
      }),
      createGeneratedQuestion({
        id: `${chapter.id}-general-q${questions.length + 2}`,
        prompt: `Which topic from this chapter should the learner connect with "${supportingSubtopic}"?`,
        correct: topic.title,
        pool: topicPool,
        fallbackOptions,
        explanation: `${supportingSubtopic} belongs under "${topic.title}" in this chapter's structure.`,
        index: topicIndex + 1
      }),
      createGeneratedQuestion({
        id: `${chapter.id}-general-q${questions.length + 3}`,
        prompt: `Which chapter resource best supports practice for "${resourceFocus}"?`,
        correct: resourceTitle,
        pool: resourceOptions,
        fallbackOptions,
        explanation: `${resourceTitle} is linked to ${resourceFocus} and supports ${purposeProfile.practiceStyle.toLowerCase()}.`,
        index: topicIndex + 2
      })
    );
  });

  return questions.map((question) => addLevelHintToQuestion(question, level));
}

function generateFallbackQuestionSet(chapter, purpose, level, startIndex, count) {
  const normalizedPurpose = normalizePurpose(purpose);
  const topics = chapter.topics || [];
  const topicTitles = uniqueItems(topics.map((topic) => topic.title));
  const subtopics = uniqueItems(topics.flatMap((topic) => topic.subtopics || []));
  const resourceTitles = uniqueItems(topics.flatMap((topic) => (topic.resources || []).map((resource) => resource.title)));
  const answerPool = uniqueItems([...topicTitles, ...subtopics, ...resourceTitles, chapter.title]).filter(Boolean);
  const fallbacks = [];

  for (let index = 0; index < count; index += 1) {
    const correct = answerPool[(startIndex + index) % answerPool.length] || chapter.title;
    const promptBase =
      normalizedPurpose === "Interview preparation"
        ? `Which chapter concept best supports a strong interview explanation in "${chapter.title}"?`
        : normalizedPurpose === "Academic learning"
          ? `Which concept belongs to the structured theory coverage of "${chapter.title}"?`
          : ["Project development", "Building projects"].includes(normalizedPurpose)
            ? `Which chapter concept is most relevant while implementing "${chapter.title}" in a practical build?`
            : `Which concept is part of "${chapter.title}"?`;

    fallbacks.push(
      addLevelHintToQuestion(createGeneratedQuestion({
        id: `${chapter.id}-fallback-q${startIndex + index + 1}`,
        prompt: `${promptBase} (${index + 1})`,
        correct,
        pool: answerPool.filter((item) => item !== correct),
        fallbackOptions: answerPool,
        explanation: `${correct} is included in the chapter content for "${chapter.title}".`,
        index: startIndex + index
      }), level)
    );
  }

  return fallbacks;
}

function ensureChapterQuiz(chapter, chapterIndex, purpose = "Skill development", level = "Beginner") {
  // If the current quiz is missing or generic (using fallback prompt),
  // and we have a specific bank available, upgrade it.
  const bank = quizQuestionBanks[chapter.id];
  const currentQuestions = chapter.quiz?.questions || [];
  const isGeneric = currentQuestions.some(q => q.prompt && q.prompt.includes("Which concept is directly covered in"));
  
  // Also regenerate if there are duplicate IDs (fixing legacy paths)
  const hasDuplicateIds = currentQuestions.length > 0 && 
    new Set(currentQuestions.map(q => q.id)).size !== currentQuestions.length;

  if ((!currentQuestions.length || isGeneric || hasDuplicateIds) && bank) {
    return buildChapterQuiz(chapter, chapterIndex, purpose, level);
  }

  if (chapter.quiz?.questions?.length && !hasDuplicateIds) {
    return chapter.quiz;
  }

  return buildChapterQuiz(chapter, chapterIndex, purpose, level);
}

// Function to generate unique path ID based on course + purpose + level
function generatePathId(topic, purpose, level) {
  const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
  const purposeSlug = purpose.toLowerCase().replace(/\s+/g, '-');
  const levelSlug = level.toLowerCase();
  return `${topicSlug}-${purposeSlug}-${levelSlug}`;
}

export async function buildLearningPath(preferences, catalog) {
  const template = structuredClone(catalog[preferences.topic]);
  const levelMeta = levelAdjustment(preferences.level);
  const normalizedPurpose = normalizePurpose(preferences.purpose);
  const purposeMeta = getPurposeProfile(normalizedPurpose);
  const milestone = purposeFocus(normalizedPurpose);
  const pathId = generatePathId(preferences.topic, normalizedPurpose, preferences.level);
  const levelResourceConfig = getLevelResourceConfig(preferences.level);

  let topicOrder = 0;
  
  const chapters = await Promise.all(
    template.chapters.map(async (chapter, chapterIndex) => {
      const topics = await Promise.all(
        chapter.topics.map(async (topic) => {
          const resources = await buildPurposeLevelResources(topic, chapter, normalizedPurpose, preferences.level, preferences.topic);
          return {
            ...topic,
            order: ++topicOrder,
            completed: false,
            unlocked: chapterIndex === 0,
            progress: 0,
            completionRules: {
              ...topic.completionRules,
              ...levelResourceConfig.completionRules
            },
            resources: resources.map((resource) => ({
              ...resource,
              interaction: resource.interaction || {
                watchedPercentage: 0,
                readMinutes: 0,
                completed: false,
                opened: false
              }
            }))
          };
        })
      );

      return {
        ...chapter,
        unlocked: chapterIndex === 0,
        completed: false,
        quiz: buildChapterQuiz(chapter, chapterIndex, normalizedPurpose, preferences.level),
        topics
      };
    })
  );

  const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);

  return {
    pathId,
    topic: preferences.topic,
    title: `${template.title} - ${normalizedPurpose} (${preferences.level})`,
    overview: `${template.overview} This version is tailored for ${normalizedPurpose.toLowerCase()} at the ${preferences.level.toLowerCase()} level.`,
    estimatedHours: Math.max(1, Math.round((template.estimatedHours || 0) * (preferences.level === "Beginner" ? 1.15 : preferences.level === "Advanced" ? 0.95 : 1))),
    purpose: normalizedPurpose,
    level: preferences.level,
    strategy: {
      purpose: normalizedPurpose,
      level: preferences.level,
      pace: levelMeta.pace,
      difficulty: levelMeta.difficulty,
      contentDepth: levelMeta.contentDepth,
      contentStyle: purposeMeta.contentStyle,
      structureStyle: purposeMeta.structureStyle,
      quizStyle: purposeMeta.quizStyle,
      practiceStyle: purposeMeta.practiceStyle,
      revisionMinutes: levelMeta.revisionMinutes,
      coachNote: `${milestone} ${levelMeta.hint}`
    },
    totalTopics,
    completedTopics: 0,
    overallProgress: 0,
    remainingHours: template.estimatedHours,
    chapters,
    generatedAt: new Date().toISOString()
  };
}

function buildResourceMatchKey(resource, index) {
  const originalTitle = resource?.adaptation?.originalTitle || resource?.title || `resource-${index}`;
  return `${resource?.type || "resource"}::${String(originalTitle).trim().toLowerCase()}::${index}`;
}

function mergeTopicResources(existingTopic = {}, refreshedTopic = {}) {
  const existingResources = existingTopic.resources || [];
  const existingResourceMap = new Map(
    existingResources.map((resource, index) => [buildResourceMatchKey(resource, index), resource])
  );

  return (refreshedTopic.resources || []).map((resource, index) => {
    const matchedResource =
      existingResourceMap.get(buildResourceMatchKey(resource, index)) ||
      existingResources.find((candidate) => {
        const candidateOriginalTitle = candidate?.adaptation?.originalTitle || candidate?.title;
        const nextOriginalTitle = resource?.adaptation?.originalTitle || resource?.title;
        return candidate?.type === resource?.type && candidateOriginalTitle === nextOriginalTitle;
      });

    return {
      ...resource,
      interaction: matchedResource?.interaction || resource.interaction
    };
  });
}

function mergeChapterQuiz(existingQuiz = {}, refreshedQuiz = {}) {
  return {
    ...refreshedQuiz,
    completed: Boolean(existingQuiz?.completed),
    score: typeof existingQuiz?.score === "number" ? existingQuiz.score : null,
    attempts: Number(existingQuiz?.attempts || 0),
    correctAnswers: existingQuiz?.correctAnswers,
    totalQuestions: refreshedQuiz.questions?.length || refreshedQuiz.totalQuestions || 0,
    results: existingQuiz?.results || [],
    submittedAt: existingQuiz?.submittedAt || null
  };
}

export async function refreshLearningPathVariant(path, catalog) {
  if (!path?.topic || !catalog?.[path.topic]) {
    return path;
  }

  const purpose = path.strategy?.purpose || path.purpose || "Skill development";
  const level = path.strategy?.level || path.level || "Beginner";
  const rebuiltPath = await buildLearningPath({ topic: path.topic, purpose, level }, catalog);
  const existingChapters = path.chapters || [];

  const chapters = rebuiltPath.chapters.map((chapter) => {
    const existingChapter = existingChapters.find((candidate) => candidate.id === chapter.id);
    const existingTopics = existingChapter?.topics || [];

    return {
      ...chapter,
      unlocked: existingChapter?.unlocked ?? chapter.unlocked,
      completed: Boolean(existingChapter?.completed),
      quiz: mergeChapterQuiz(existingChapter?.quiz, chapter.quiz),
      topics: chapter.topics.map((topic) => {
        const existingTopic = existingTopics.find((candidate) => candidate.id === topic.id);
        return {
          ...topic,
          unlocked: existingTopic?.unlocked ?? topic.unlocked,
          completed: Boolean(existingTopic?.completed),
          progress: Number(existingTopic?.progress || 0),
          resources: mergeTopicResources(existingTopic, topic)
        };
      })
    };
  });

  return {
    ...rebuiltPath,
    pathId: path.pathId || rebuiltPath.pathId,
    generatedAt: path.generatedAt || rebuiltPath.generatedAt,
    completedTopics: Number(path.completedTopics || 0),
    overallProgress: Number(path.overallProgress || 0),
    remainingHours: typeof path.remainingHours === "number" ? path.remainingHours : rebuiltPath.remainingHours,
    chapters
  };
}

export function calculateProgress(path) {
  const purpose = path.strategy?.purpose || path.purpose || "Skill development";
  const level = path.strategy?.level || path.level || "Beginner";
  const chapters = path.chapters.map((chapter, chapterIndex) => {
    const quiz = ensureChapterQuiz(chapter, chapterIndex, purpose, level);
    const topics = chapter.topics.map((topic) => {
      const videoMax = Math.max(
        ...topic.resources.filter((resource) => resource.type === "video").map((resource) => resource.interaction.watchedPercentage),
        0
      );
      const readMinutes = topic.resources
        .filter((resource) => resource.type === "article" || resource.type === "pdf")
        .reduce((sum, resource) => sum + resource.interaction.readMinutes, 0);
      const completedCourse = topic.resources.some((resource) => resource.type === "course" && resource.interaction.completed);
      const openedAny = topic.resources.some((resource) => resource.interaction.opened);

      const meetsVideo = topic.completionRules.videoPercentage ? videoMax >= topic.completionRules.videoPercentage : false;
      const meetsRead = topic.completionRules.readMinutes ? readMinutes >= topic.completionRules.readMinutes : false;
      const meetsCourse = topic.completionRules.courseCompleted ? completedCourse : false;

      // A topic is completed if ANY of the requirements are met, OR if any resource has been opened/interacted with
      const completed = meetsCourse || meetsVideo || meetsRead || openedAny;

      // Progress should reflect the maximum completion across all resource types
      const readProgress = (topic.completionRules.readMinutes && topic.completionRules.readMinutes > 0)
        ? Math.min(100, Math.round((readMinutes / topic.completionRules.readMinutes) * 100)) 
        : (readMinutes > 0 ? 100 : 0);
      
      const progress = Math.max(
        videoMax, 
        readProgress,
        completedCourse ? 100 : 0,
        openedAny ? 100 : 0
      );

      return {
        ...topic,
        progress: completed ? 100 : progress,
        completed
      };
    });

    return {
      ...chapter,
      topics,
      quiz: {
        ...quiz,
        unlocked: topics.every((topic) => topic.completed)
      },
      completed: topics.every((topic) => topic.completed) && Boolean(quiz?.completed)
    };
  });

  const unlockedChapters = chapters.map((chapter, index) => {
    const previous = chapters[index - 1];
    const unlocked = index === 0 || previous?.completed;
    return {
      ...chapter,
      unlocked,
      topics: chapter.topics.map((topic) => ({ ...topic, unlocked })),
      quiz: {
        ...chapter.quiz,
        unlocked: unlocked && chapter.quiz.unlocked
      }
    };
  });

  const totalTopics = unlockedChapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const completedTopics = unlockedChapters.reduce(
    (sum, chapter) => sum + chapter.topics.filter((topic) => topic.completed).length,
    0
  );
  const overallProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
  const totalMinutesSpent = unlockedChapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.topics.reduce(
        (topicSum, topic) =>
          topicSum +
          topic.resources.reduce((resourceSum, resource) => {
            if (resource.type === "video") {
              return resourceSum + Math.round((resource.durationMinutes * resource.interaction.watchedPercentage) / 100);
            }

            return resourceSum + resource.interaction.readMinutes;
          }, 0),
        0
      ),
    0
  );

  // If path is 100% complete, remaining hours must be 0
  const remainingHours = overallProgress >= 100 
    ? 0 
    : Math.max(0, Number(((path.estimatedHours || 0) - totalMinutesSpent / 60).toFixed(1)));

  return {
    ...path,
    chapters: unlockedChapters,
    completedTopics,
    overallProgress,
    remainingHours
  };
}

export function buildDashboardSummary(path, activity = []) {
  const totalMinutes = activity.reduce((sum, item) => sum + (item.minutes || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = activity
    .filter((item) => item.timestamp?.slice(0, 10) === today)
    .reduce((sum, item) => sum + (item.minutes || 0), 0);

  const quizScores = path.chapters
    .map((chapter) => chapter.quiz?.score)
    .filter((score) => typeof score === "number");
  const totalChapterQuizzes = path.chapters.length;
  const quizProgressPercent = totalChapterQuizzes === 0 ? 0 : Math.round((quizScores.length / totalChapterQuizzes) * 100);

  return {
    totalHoursSpent: Number((totalMinutes / 60).toFixed(1)),
    remainingHours: path.remainingHours,
    completedTopics: path.completedTopics,
    overallProgress: path.overallProgress,
    quizzesCompleted: quizScores.length,
    totalChapterQuizzes,
    quizProgressPercent,
    averageQuizScore: quizScores.length === 0 ? 0 : Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length),
    chart: path.chapters.map((chapter) => ({
      label: chapter.title,
      value: chapter.topics.length === 0 ? 0 : Math.round((chapter.topics.filter((topic) => topic.completed).length / chapter.topics.length) * 100)
    })),
    coachSummary: `You studied ${Number((todayMinutes / 60).toFixed(1))} hours today. ${path.remainingHours} hours remain, and you have completed ${quizScores.length}/${totalChapterQuizzes} chapter quizzes with an average score of ${quizScores.length === 0 ? 0 : Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)}%.`
  };
}
