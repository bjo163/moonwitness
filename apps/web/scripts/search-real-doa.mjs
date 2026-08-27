async function searchRealData() {
  const urls = [
    'https://raw.githubusercontent.com/islamic-network/hisnulmuslim/master/data/id/hisnulmuslim.json',
    'https://raw.githubusercontent.com/gadingnst/hisnul-muslim-api/master/data/id.json',
    'https://raw.githubusercontent.com/rnzfa/hisnul-muslim-indonesia/master/db.json',
    'https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ind-hisnulmuslim.json', // Fawaz Ahmed Hisnul Muslim?
    'https://raw.githubusercontent.com/mhmoudtech/Hisnul-Muslim-API/main/data/id.json'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[FOUND] ${url}`);
        const data = await res.json();
        console.log("Sample:", Object.keys(data).slice(0, 5));
        return;
      }
    } catch(e) {}
  }
  
  // If not found, let's search github API
  const searchUrl = 'https://api.github.com/search/repositories?q=dzikir+pagi+sore+json';
  const res = await fetch(searchUrl, { headers: { 'User-Agent': 'node.js' } });
  const data = await res.json();
  console.log("Github search results:");
  data.items?.slice(0, 3).forEach(i => console.log(i.full_name));
}

searchRealData();
