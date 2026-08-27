async function testFawaz() {
  const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-hisnulmuslim.json';
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      console.log(`[OK] Fetched ${data.hadiths?.length || 0} items!`);
      if (data.hadiths) {
        console.log(data.hadiths.slice(0, 2));
      }
    } else {
      console.log(`[FAIL] ${res.status}`);
      // Let's test the arabic one just in case
      const res2 = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-hisnulmuslim.json');
      console.log("ara-hisnulmuslim: ", res2.status);
    }
  } catch (e) {
    console.log(`[ERR] ${e.message}`);
  }
}
testFawaz();
