const articleCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const activeRequests = new Map();

function isInvalidNamespace(title) {
  const invalidPrefixes = [
    'category:', 'categoria:',
    'special:', 'especial:',
    'wikipedia:',
    'help:', 'ajuda:',
    'file:', 'ficheiro:', 'arquivo:', 'imagem:',
    'talk:', 'discussão:',
    'user:', 'usuário:', 'utilizador:',
    'template:', 'predefinição:',
    'portal:'
  ];
  return invalidPrefixes.some(prefix => title.toLowerCase().startsWith(prefix));
}

async function searchArticle(query, lang) {
  const key = `search:${lang}:${query}`;
  const controller = new AbortController();
  activeRequests.set(key, controller);

  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=0&utf8=&format=json&origin=*`;
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    return data.query?.search?.[0]?.title || null;
  } finally {
    activeRequests.delete(key);
  }
}

async function fetchArticle(title, lang, signal) {
  const cached = getCachedArticle(title);
  if (cached) return cached;

  const url = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&redirects=1&prop=text|sections&format=json&origin=*`;
  const res = await fetch(url, { signal });
  const data = await res.json();

  if (!data.parse) return null;

  const result = {
    title: data.parse.title,
    html: data.parse.text['*'],
    sections: data.parse.sections || []
  };

  articleCache.set(title, { ...result, timestamp: Date.now() });
  return result;
}

async function getLinks(title, lang, signal) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(title)}&redirects=1&plnamespace=0&pllimit=max&format=json&origin=*`;
  const res = await fetch(url, { signal });
  const data = await res.json();

  const pages = data.query?.pages || {};
  const pageId = Object.keys(pages)[0];

  let resolvedTitle = title;
  if (data.query?.redirects?.[0]?.to) {
    resolvedTitle = data.query.redirects[0].to;
  }

  if (pageId === '-1' || !pages[pageId]?.links) {
    return { links: [], resolvedTitle };
  }

  return {
    links: pages[pageId].links.map(l => l.title),
    resolvedTitle
  };
}

function cancelRequest(key) {
  activeRequests.get(key)?.abort();
}

function clearCache() {
  articleCache.clear();
}

function getCachedArticle(title) {
  const cached = articleCache.get(title);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    articleCache.delete(title);
    return null;
  }
  return cached;
}

export { isInvalidNamespace, searchArticle, fetchArticle, getLinks, cancelRequest, clearCache, getCachedArticle };
