async function searchDoa() {
  const query = encodeURIComponent("filename:doa.json language:json");
  const url = `https://api.github.com/search/code?q=${query}`;
  console.log("Searching Github for doa.json...");
  
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Node.js' } });
    const data = await res.json();
    
    if (data.items) {
      for (const item of data.items.slice(0, 5)) {
        console.log(`- ${item.repository.full_name}: ${item.path}`);
        // To get the raw file:
        const rawUrl = `https://raw.githubusercontent.com/${item.repository.full_name}/master/${item.path}`;
        console.log(`  Raw URL: ${rawUrl}`);
      }
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err.message);
  }
}
searchDoa();
