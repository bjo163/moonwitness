async function getMore() {
  const urls = [
    'https://islamic-api-zhirrr.vercel.app/api/doaharian',
    'https://doa-doa-api-ahmadramadhan.fly.dev/api',
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`[OK] ${url} - Count: ${data.data?.length || data.length}`);
        console.log("Sample:", (data.data || data)[0]);
      } else {
        console.log(`[FAIL] ${url} - HTTP ${res.status}`);
      }
    } catch(e) {
      console.log(`[ERR] ${url} - ${e.message}`);
    }
  }
}
getMore();
