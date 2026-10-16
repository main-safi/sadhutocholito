let verbRules = { pronouns: {}, verb_suffixes: [] };

// Load conversion rule matrix from local or raw source
async function loadRules() {
  try {
    const response = await fetch('./data/verb_rules.json');
    verbRules = await response.json();
  } catch (error) {
    console.error('Error loading verb rules:', error);
  }
}

// Transform Cholito input sentence into Sadhu Bhasha
function convertToSadhu(text) {
  if (!text.trim()) return '';

  const words = text.trim().split(/\s+/);

  const convertedWords = words.map(word => {
    const cleanWord = word.replace(/[।,?!]/g, '');
    const punctuation = word.slice(cleanWord.length);

    // 1. Pronoun check
    if (verbRules.pronouns[cleanWord]) {
      return verbRules.pronouns[cleanWord] + punctuation;
    }

    // 2. Verb suffix match check
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
