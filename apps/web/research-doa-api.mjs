async function testApi() {
  const urls = [
    'https://raw.githubusercontent.com/idhammubarrok/kumpulan-doa/master/data/doa.json',
    'https://raw.githubusercontent.com/sutanlab/doa-hari-ini/master/api/data.json',
    'https://doa-doa-api-ahmadramadhan.fly.dev/api'
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`[OK] ${url}`);
        console.log(Array.isArray(data) ? data[0] : Object.keys(data));
      } else {
        console.log(`[FAIL] ${url}`);
      }
    } catch (e) {
      console.log(`[ERR] ${url} - ${e.message}`);
    }
  }
}
testApi();
