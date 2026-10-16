let verbRules = { pronouns: {}, verb_suffixes: [] };
let rulesLoaded = false;

// Async function to load rules with fallback path checking
async function loadRules() {
  const paths = [
    './data/verb_rules.json',
    '../data/verb_rules.json',
    '/data/verb_rules.json'
  ];

  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        verbRules = await response.json();
        
        // Sort verb suffixes by length descending (longest rules match first)
        if (verbRules.verb_suffixes) {
          verbRules.verb_suffixes.sort((a, b) => b.cholito.length - a.cholito.length);
        }
        
        rulesLoaded = true;
        console.log('Verb rules successfully loaded from:', path);
        return;
      }
    } catch (e) {
      // Continue trying next fallback path
    }
  }
  console.error('Failed to load verb_rules.json from all attempted paths.');
}

// Main conversion logic
function convertCholitoToSadhu(text) {
  if (!text || !text.trim()) return '';

  // Separate Bangla words and preserve punctuation marks (।, ?, !, commas)
  const tokens = text.trim().split(/(\s+|[।,.?!:-])/);

  const convertedTokens = tokens.map(token => {
    if (!token || /^\s+$/.test(token) || /[।,.?!:-]/.test(token)) {
      return token; // Leave whitespace and punctuation untouched
    }

    // 1. Direct Pronoun & Static Word Match
    if (verbRules.pronouns && verbRules.pronouns[token]) {
      return verbRules.pronouns[token];
    }

    // 2. Verb Suffix Replacement (Longest matching suffix first)
    if (verbRules.verb_suffixes) {
      for (const rule of verbRules.verb_suffixes) {
        if (token.endsWith(rule.cholito)) {
          const root = token.slice(0, -rule.cholito.length);
          return root + rule.sadhu;
        }
      }
    }

    return token;
  });

  return convertedTokens.join('');
}

// Trigger initial loading
loadRules();
