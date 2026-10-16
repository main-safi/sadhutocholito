let verbRules = { irregular_verbs: {}, pronouns: {}, verb_suffixes: [] };

async function loadRules() {
  try {
    const response = await fetch('./data/verb_rules.json');
    if (response.ok) {
      verbRules = await response.json();
      if (verbRules.verb_suffixes) {
        verbRules.verb_suffixes.sort((a, b) => b.cholito.length - a.cholito.length);
      }
    }
  } catch (error) {
    console.error('Error loading rules:', error);
  }
}

function convertCholitoToSadhu(text) {
  if (!text || !text.trim()) return '';

  const tokens = text.trim().split(/(\s+|[।,.?!:-])/);

  const convertedTokens = tokens.map(token => {
    if (!token || /^\s+$/.test(token) || /[।,.?!:-]/.test(token)) {
      return token;
    }

    // 1. Check Irregular Verbs first (fixes "খাচ্ছে" -> "খাইতেছে")
    if (verbRules.irregular_verbs && verbRules.irregular_verbs[token]) {
      return verbRules.irregular_verbs[token];
    }

    // 2. Check Pronouns & Direct Words
    if (verbRules.pronouns && verbRules.pronouns[token]) {
      return verbRules.pronouns[token];
    }

    // 3. Check General Suffixes
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

loadRules();
