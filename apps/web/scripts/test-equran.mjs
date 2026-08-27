async function test() {
  const url = 'https://equran.id/api/doa';
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      console.log(`[OK] Fetched items!`);
      if (Array.isArray(data)) {
        console.log(data.length);
      } else {
        console.log("Keys: ", Object.keys(data));
        console.log("data.data length: ", data.data?.length);
        console.log("Sample: ", data.data?.[0] || data[Object.keys(data)[0]]);
      }
    } else {
      console.log(`[FAIL] ${res.status}`);
    }
  } catch (e) {
    console.log(`[ERR] ${e.message}`);
  }
}
test();
