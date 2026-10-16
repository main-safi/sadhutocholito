let sadhuDict = [];

// Load primary dictionary
async function loadDictionary() {
  try {
    const response = await fetch('./data/sadhu_dict.json');
    if (response.ok) {
      sadhuDict = await response.json();
      console.log('Dictionary loaded successfully.');
    }
  } catch (error) {
    console.error('Error fetching sadhu_dict.json:', error);
  }
}

// UI Tab Switcher
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

  const activeTab = document.getElementById(`tab-${tabName}`);
  const activePanel = document.getElementById(`panel-${tabName}`);

  if (activeTab && activePanel) {
    activeTab.classList.add('active');
    activePanel.classList.add('active');
  }
}

// Free Translation API Call (English -> Cholito Bangla)
async function translateEnglishToCholito(englishText) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|bn`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('API returned empty output');
  } catch (error) {
    console.error('Translation API error:', error);
    return null;
  }
}

// Full Translation Handler
async function handleEnglishToSadhuTranslation() {
  const inputElem = document.getElementById('english-input');
  const outputElem = document.getElementById('sadhu-output');

  if (!inputElem || !outputElem) return;

  const englishText = inputElem.value.trim();
  if (!englishText) {
    outputElem.innerText = 'Please enter an English sentence...';
    return;
  }

  // Ensure conversion rules are loaded before translating
  if (!rulesLoaded) {
    outputElem.innerText = 'Loading rules engine, please try again in a moment...';
    await loadRules();
  }

  outputElem.innerText = 'Translating... (অনুবাদ করা হচ্ছে...)';

  // Step 1: English -> Cholito
  const cholitoText = await translateEnglishToCholito(englishText);

  if (!cholitoText) {
    outputElem.innerText = 'Translation failed. Please check internet connection or try again.';
    return;
  }

  // Step 2: Cholito -> Sadhu
  const sadhuText = convertCholitoToSadhu(cholitoText);

  outputElem.innerHTML = `
    <strong>সাধু রূপ:</strong>
    <p style="font-size: 1.25rem; color: #8b0000; margin: 8px 0;">${sadhuText}</p>
    <small style="color: #666;">(চলিত রূপ: ${cholitoText})</small>
  `;
}

// Dictionary Search
function handleSearch() {
  const searchInput = document.getElementById('dict-search');
  const resultsContainer = document.getElementById('dict-results');
  if (!searchInput || !resultsContainer) return;

  const query = searchInput.value.toLowerCase().trim();
  resultsContainer.innerHTML = '';

  if (!query) return;

  const matches = sadhuDict.filter(item => 
    (item.english && item.english.toLowerCase().includes(query)) ||
    (item.sadhu && item.sadhu.includes(query)) ||
    (item.cholito && item.cholito.includes(query))
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<p>কোনো শব্দ পাওয়া যায়নি।</p>';
    return;
  }

  matches.forEach(item => {
    const card = document.createElement('div');
    card.className = 'dict-card';
    card.innerHTML = `
      <h3>${item.sadhu} <small>(${item.pos || 'N/A'})</small></h3>
      <p><strong>English:</strong> ${item.english}</p>
      <p><strong>Cholito:</strong> ${item.cholito}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  loadDictionary();
});
