import { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articleHtml, setArticleHtml] = useState('');
  const [sections, setSections] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [crazyHops, setCrazyHops] = useState(5);
  const articleRef = useRef(null);

  const fetchArticleByTitle = async (title) => {
    try {
      const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text|sections&format=json&origin=*`;
      
      const parseRes = await fetch(parseUrl);
      const parseData = await parseRes.json();

      if (parseData.parse) {
        setCurrentTitle(parseData.parse.title);
        setArticleHtml(parseData.parse.text['*']);
        setSections(parseData.parse.sections);
        
        if (articleRef.current) {
          articleRef.current.scrollTop = 0;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomInternalLink = async (articleTitle) => {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(articleTitle)}&plnamespace=0&pllimit=max&format=json&origin=*`;
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];

      if (pageId === '-1' || !pages[pageId].links) {
        return null;
      }

      const links = pages[pageId].links;
      const randomIndex = Math.floor(Math.random() * links.length);

      return links[randomIndex].title;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsLoading(true);
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`;
    
    try {
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.query.search.length > 0) {
        const initialTitle = searchData.query.search[0].title;
        const randomLink = await getRandomInternalLink(initialTitle);
        
        if (randomLink) {
          await fetchArticleByTitle(randomLink);
        } else {
          await fetchArticleByTitle(initialTitle);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleClick = (e) => {
    const target = e.target.closest('a');
    
    if (!target) return;

    const href = target.getAttribute('href');
    
    if (href && href.startsWith('/wiki/')) {
      e.preventDefault();
      
      let title = href.replace('/wiki/', '');
      title = title.split('#')[0]; 
      const decodedTitle = decodeURIComponent(title);
      
      setIsLoading(true);
      fetchArticleByTitle(decodedTitle).finally(() => setIsLoading(false));
    }
  };

  const handleCrazyMode = async () => {
    if (!currentTitle) return;
    
    setIsLoading(true);
    let tempTitle = currentTitle;

    for (let i = 0; i < crazyHops; i++) {
      const nextLink = await getRandomInternalLink(tempTitle);
      if (!nextLink) break;
      tempTitle = nextLink;
    }

    await fetchArticleByTitle(tempTitle);
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <header className="custom-header">
        <h1>Huhkipedia</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Wikipedia..."
          />
          <button type="submit" disabled={isLoading}>Search</button>
        </form>
      </header>
      
      <main className="main-content">
        <aside className="sidebar left-sidebar">
          <ul>
            {sections.map((sec) => (
              <li 
                key={sec.index} 
                style={{ marginLeft: `${(sec.toclevel - 1) * 1}rem` }}
              >
                <a href={`#${sec.anchor}`}>{sec.line}</a>
              </li>
            ))}
          </ul>
        </aside>
        
        <section 
          className="article-container" 
          ref={articleRef}
          onClick={handleArticleClick}
        >
          {currentTitle && <h1 className="article-title">{currentTitle}</h1>}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleHtml) }} />
        </section>

        <aside className="sidebar right-sidebar">
          <div className="crazy-mode-controls">
            <h3>Crazy Mode</h3>
            <label>
              Hops:
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={crazyHops} 
                onChange={(e) => setCrazyHops(Number(e.target.value))}
              />
            </label>
            <button 
              onClick={handleCrazyMode} 
              disabled={!currentTitle || isLoading}
            >
              Start Crazy Mode
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;