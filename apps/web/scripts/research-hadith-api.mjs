async function checkApis() {
  const apis = [
    { name: 'Fawaz Ahmed (GitHub CDN)', url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json' },
    { name: 'SutanLab API (Indonesian)', url: 'https://api.hadith.gading.dev/books' }
  ];

  for (const api of apis) {
    try {
      console.log(`Checking ${api.name}...`);
      const res = await fetch(api.url, { timeout: 5000 });
      if (res.ok) {
        const data = await res.json();
        console.log(`[SUCCESS] ${api.name}`);
        if (api.name.includes('Gading')) {
           console.log(data.data.map(b => `${b.name}: ${b.available}`).join(', '));
        } else {
           console.log(Object.keys(data).slice(0, 5), '...');
        }
      } else {
        console.log(`[FAILED] ${api.name} - HTTP ${res.status}`);
      }
    } catch (err) {
      console.log(`[ERROR] ${api.name} - ${err.message}`);
    }
  }
}

checkApis();
