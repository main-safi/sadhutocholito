let verbRules = { pronouns: {}, verb_suffixes: [] };

async function loadRules() {
  try {
    const response = await fetch('./data/verb_rules.json');
    verbRules = await response.json();
  } catch (error) {
    console.error('Error loading conversion rules:', error);
  }
}

function convertCholitoToSadhu(text) {
  if (!text.trim()) return '';

  const words = text.trim().split(/\s+/);

  const convertedWords = words.map(word => {
    const cleanWord = word.replace(/[।,?!]/g, '');
    const punctuation = word.slice(cleanWord.length);

    // 1. Direct Pronoun & High-Frequency Words Replacement
    if (verbRules.pronouns[cleanWord]) {
      return verbRules.pronouns[cleanWord] + punctuation;
    }

    // 2. Verb Suffix Matching
    for (const rule of verbRules.verb_suffixes) {
      if (cleanWord.endsWith(rule.cholito)) {
        const root = cleanWord.slice(0, -rule.cholito.length);
        return root + rule.sadhu + punctuation;
      }
    }

    return word;
  });

  return convertedWords.join(' ');
}

loadRules();
