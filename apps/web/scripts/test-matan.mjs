const texts = [
  "Telah menceritakan kepada kami [Sufyan] yang berkata... saya mendengar Rasulullah shallallahu 'alaihi wasallam bersabda: \"Semua perbuatan tergantung niatnya, dan (balasan)...\"",
  "Dari Abu Hurairah r.a., ia berkata: Rasulullah SAW bersabda, 'Barangsiapa yang beriman...'",
  "Telah menceritakan kepada kami fulan... ia berkata, 'Aku melihat Nabi...'"
]

function extractMatan(text) {
  if (!text) return "";
  
  // Try to find the last occurrence of these keywords followed by some separator
  const keywords = ['bersabda', 'berkata', 'mengatakan', 'berfirman'];
  let lastIndex = -1;
  let keywordUsed = '';
  
  for (const kw of keywords) {
    const idx = text.lastIndexOf(kw);
    if (idx > lastIndex) {
      lastIndex = idx;
      keywordUsed = kw;
    }
  }
  
  if (lastIndex !== -1) {
    let matan = text.substring(lastIndex + keywordUsed.length).trim();
    // Clean up leading punctuation
    matan = matan.replace(/^[\s:;,"'“]+/, '');
    // Clean up trailing punctuation
    matan = matan.replace(/[\s,"'”]+$/, '');
    
    // If the extracted matan is reasonably long, it's probably correct
    if (matan.length > 20) return matan;
  }
  
  return text;
}

texts.forEach(t => {
  console.log("ORIGINAL:", t);
  console.log("MATAN   :", extractMatan(t));
  console.log("---");
})
