let sadhuDict = [];

// Fetch dictionary dynamically via API / GitHub Raw URL
async function loadDictionaryFromAPI() {
  // Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub info once published
  const apiUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/sadhu_dict.json';
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('API network response failed');
    sadhuDict = await response.json();
    console.log('Dictionary loaded successfully via API.');
  } catch (error) {
    console.warn('API fetch failed, falling back to local file:', error);
    try {
      const localResponse = await fetch('./data/sadhu_dict.json');
      sadhuDict = await localResponse.json();
    } catch (localError) {
      console.error('Local fallback also failed:', localError);
    }
  }
}

// UI Tab Navigation Switcher
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

  if (tabName === 'convert') {
    document.getElementById('tab-convert').classList.add('active');
    document.getElementById('panel-convert').classList.add('active');
  } else {
    document.getElementById('tab-dict').classList.add('active');
    document.getElementById('panel-dict').classList.add('active');
  }
}

// Handle Sentence Conversion action
function handleConversion() {
  const input = document.getElementById('cholito-input').value;
  const outputBox = document.getElementById('sadhu-output');
  
  const converted = convertToSadhu(input);
  outputBox.innerText = converted || 'ফলাফল এখানে প্রদর্শিত হবে...';
}

// Handle Dictionary Search action
function handleSearch() {
  const query = document.getElementById('dict-search').value.toLowerCase().trim();
  const resultsContainer = document.getElementById('dict-results');
  resultsContainer.innerHTML = '';

  if (!query) return;

  const matches = sadhuDict.filter(item => 
    item.english.toLowerCase().includes(query) ||
    item.sadhu.includes(query) ||
    item.cholito.includes(query)
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

document.addEventListener('DOMContentLoaded', () => {
  loadDictionaryFromAPI();
});
