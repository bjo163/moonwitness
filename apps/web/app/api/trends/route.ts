export async function GET() {
  try {
    const response = await fetch("https://trends.google.com/trending/rss?geo=US&t=" + Date.now(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Google Trends responded with ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    // Lightweight Regex XML parsing since it's a simple, predictable RSS feed
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/.exec(itemContent);
      const trafficMatch = /<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/.exec(itemContent);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent);
      
      if (titleMatch) {
        items.push({
          title: titleMatch[1],
          traffic: trafficMatch ? trafficMatch[1] : "Unknown",
          pubDate: pubDateMatch ? pubDateMatch[1] : ""
        });
      }
    }
    
    return Response.json({ success: true, data: items.slice(0, 10) });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return Response.json({ success: false, error: "Failed to fetch trends" }, { status: 500 });
  }
}
