function normalizeWhitespace(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text = "") {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 35);
}

function uniqueItems(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function titleCase(value = "") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function rotateOptions(options = [], index = 0) {
  if (!options.length) {
    return options;
  }

  const shift = index % options.length;
  return options.slice(shift).concat(options.slice(0, shift));
}

function ensureFourOptions(answer, distractors = [], fallbackPool = [], index = 0) {
  const merged = [answer];

  for (const option of [...distractors, ...fallbackPool]) {
    const normalized = normalizeWhitespace(option);
    if (!normalized || merged.includes(normalized) || normalized === answer) {
      continue;
    }
    merged.push(normalized);
    if (merged.length === 4) {
      break;
    }
  }

  while (merged.length < 4) {
    merged.push(`${answer} detail ${merged.length}`);
  }

  return rotateOptions(merged, index);
}

function buildQuestionFromSentence(sentence, sentenceIndex, answerPool) {
  const match = sentence.match(/^(.{3,80}?)\s+(is|are|means|refers to|uses|provides|supports|includes|contains|enables)\s+(.{8,160})$/i);
  if (!match) {
    return null;
  }

  const subject = normalizeWhitespace(match[1].replace(/^(the|a|an)\s+/i, ""));
  const verb = match[2].toLowerCase();
  const predicate = normalizeWhitespace(match[3].replace(/[.]+$/, ""));

  if (!subject || !predicate) {
    return null;
  }

  const distractors = answerPool
    .filter((item) => item !== predicate)
    .slice(sentenceIndex, sentenceIndex + 6)
    .slice(0, 3);

  if (distractors.length < 3) {
    return null;
  }

  return {
    prompt: `According to the provided resource text, ${titleCase(subject)} ${verb}...`,
    answer: predicate,
    distractors,
    explanation: sentence,
    sourceExcerpt: sentence
  };
}

function buildDefinitionQuestion(sentence, sentenceIndex, answerPool) {
  const words = sentence
    .replace(/[^\w\s/-]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < 8) {
    return null;
  }

  const concept = words.slice(0, Math.min(4, words.length)).join(" ");
  const answer = words.slice(Math.min(4, words.length), Math.min(10, words.length)).join(" ");

  if (concept.length < 8 || answer.length < 12) {
    return null;
  }

  const distractors = answerPool
    .filter((item) => item !== answer)
    .slice(sentenceIndex, sentenceIndex + 6)
    .slice(0, 3);

  if (distractors.length < 3) {
    return null;
  }

  return {
    prompt: `Which phrase best completes this resource-backed statement about "${concept}"?`,
    answer,
    distractors,
    explanation: sentence,
    sourceExcerpt: sentence
  };
}

export function generateQuizFactsFromResourceText(text, resourceTitle = "Resource") {
  const normalizedText = normalizeWhitespace(text);
  if (!normalizedText || normalizedText.length < 120) {
    throw new Error("Please paste richer transcript or PDF text so quiz facts can be generated.");
  }

  const sentences = splitIntoSentences(normalizedText).slice(0, 24);
  if (sentences.length < 3) {
    throw new Error("The pasted text needs at least a few meaningful sentences.");
  }

  const answerPool = uniqueItems(
    sentences.map((sentence) => {
      const cleaned = sentence.replace(/[.?!]+$/, "");
      const parts = cleaned.split(/,|;|:|\band\b|\bbut\b/i).map((part) => normalizeWhitespace(part));
      return parts.find((part) => part.length >= 12 && part.length <= 90) || cleaned;
    })
  );

  const quizFacts = [];
  const focusPoints = [];
  const summaries = [];

  sentences.forEach((sentence, index) => {
    const exactQuestion =
      buildQuestionFromSentence(sentence, index, answerPool) ||
      buildDefinitionQuestion(sentence, index, answerPool);

    if (exactQuestion && quizFacts.length < 12) {
      quizFacts.push(exactQuestion);
    }

    if (focusPoints.length < 8) {
      const nounLike = sentence.match(/\b[A-Z][a-zA-Z0-9/-]*(?:\s+[A-Z][a-zA-Z0-9/-]*){0,2}\b/g) || [];
      const fallbackPhrase = sentence
        .replace(/[.?!]+$/, "")
        .split(/,|;|:/)[0]
        .trim();
      const candidate = nounLike[0] || fallbackPhrase;

      if (candidate && candidate.length >= 4 && candidate.length <= 80 && !focusPoints.includes(candidate)) {
        focusPoints.push(candidate);
      }
    }

    if (summaries.length < 3) {
      summaries.push(sentence);
    }
  });

  if (quizFacts.length < 3) {
    throw new Error(`Could not extract enough exact quiz facts from the pasted text for ${resourceTitle}. Try cleaner transcript or notes text.`);
  }

  return {
    summary: summaries.join(" ").slice(0, 500),
    focusPoints: focusPoints.slice(0, 8),
    quizFacts: quizFacts.slice(0, 10),
    sourceText: normalizedText
  };
}

export function buildQuizQuestionsFromFacts(quizFacts = [], level = "Beginner") {
  const fallbackPool = uniqueItems(
    quizFacts.flatMap((fact) => [fact.answer, ...(fact.distractors || [])]).map((item) => normalizeWhitespace(item))
  );

  return quizFacts
    .filter((fact) => fact?.prompt && fact?.answer)
    .map((fact, index) => {
      const options = ensureFourOptions(
        normalizeWhitespace(fact.answer),
        (fact.distractors || []).map((item) => normalizeWhitespace(item)),
        fallbackPool,
        index
      );

      return {
        id: `resource-question-${index + 1}`,
        prompt: fact.prompt,
        options,
        correctIndex: options.indexOf(normalizeWhitespace(fact.answer)),
        explanation: fact.explanation || fact.sourceExcerpt || `The ingested resource states that ${fact.answer}.`,
        level,
        sourceExcerpt: fact.sourceExcerpt || ""
      };
    });
}

export function generateResourceQuizFromText(text, resourceTitle = "Resource", level = "Beginner") {
  const generated = generateQuizFactsFromResourceText(text, resourceTitle);
  return {
    ...generated,
    questions: buildQuizQuestionsFromFacts(generated.quizFacts, level)
  };
}
