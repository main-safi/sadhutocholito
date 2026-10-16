// Function to translate English to Cholito Bangla via free API
async function translateEnglishToCholito(englishText) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|bn`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('Translation failed');
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Full Pipeline: English -> Cholito -> Sadhu Bhasha
async function handleEnglishToSadhuTranslation() {
  const input = document.getElementById('english-input').value.trim();
  const outputBox = document.getElementById('sadhu-output');

  if (!input) {
    outputBox.innerText = 'অনুগ্রহ করে ইংরেজি বাক্য লিখুন...';
    return;
  }

  outputBox.innerText = 'রূপান্তর করা হচ্ছে... (Translating...)';

  // Step 1: Translate English -> Cholito Bangla
  const cholitoText = await translateEnglishToCholito(input);

  if (!cholitoText) {
    outputBox.innerText = 'অনুবাদ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
    return;
  }

  // Step 2: Convert Cholito Bangla -> Sadhu Bhasha
  const sadhuText = convertCholitoToSadhu(cholitoText);

  outputBox.innerHTML = `
    <strong>সাধু রূপ:</strong>
    <p style="font-size: 1.2rem; color: #8b0000; margin-top: 5px;">${sadhuText}</p>
    <small style="color: #666;">(চলিত রূপ: ${cholitoText})</small>
  `;
}
