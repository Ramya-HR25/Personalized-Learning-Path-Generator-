export async function searchWebForExactLink(query) {
  try {
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      return null;
    }
    const html = await response.text();
    // Match the first actual result link and snippet in DuckDuckGo HTML
    const urlMatch = html.match(/class="result__url" href="([^"]+)"/);
    const snippetMatch = html.match(/class="result__snippet[^>]*>([\s\S]*?)<\/a>/);
    
    if (urlMatch && urlMatch[1]) {
      let url = urlMatch[1];
      if (url.includes('uddg=')) {
        const urlParams = new URLSearchParams(url.substring(url.indexOf('?')));
        const uddg = urlParams.get('uddg');
        if (uddg) url = decodeURIComponent(uddg);
      } else if (!url.startsWith('http')) {
        url = 'https:' + url;
      }
      
      let snippet = "";
      if (snippetMatch && snippetMatch[1]) {
        snippet = snippetMatch[1].replace(/<[^>]+>/g, '').trim();
      }
      
      return { url, snippet };
    }
  } catch (err) {
    console.error("Web search failed for query:", query, err.message);
  }
  return null;
}
