import { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import SavedArticlesModal from './components/SavedArticlesModal';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ArticleViewer from './components/ArticleViewer';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articleHtml, setArticleHtml] = useState('');
  const [sections, setSections] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [crazyHops, setCrazyHops] = useState(5);
  const [isCrazyModeActive, setIsCrazyModeActive] = useState(false);
  const [path, setPath] = useState([]);
  
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const articleRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchArticleByTitle = async (title) => {
    try {
      const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text|sections&format=json&origin=*`;
      
      const parseRes = await fetch(parseUrl);
      const parseData = await parseRes.json();

      if (parseData.parse) {
        const fetchedTitle = parseData.parse.title;
        setCurrentTitle(fetchedTitle);
        setArticleHtml(parseData.parse.text['*']);
        setSections(parseData.parse.sections);
        
        setPath((prev) => {
          if (prev[prev.length - 1] === fetchedTitle) return prev;
          return [...prev, fetchedTitle];
        });
        
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

  const executeCrazyHops = async (startTitle) => {
    let tempTitle = startTitle;
    const traversedPaths = [startTitle];

    for (let i = 0; i < crazyHops; i++) {
      const nextLink = await getRandomInternalLink(tempTitle);
      if (!nextLink) break;
      traversedPaths.push(nextLink);
      tempTitle = nextLink;
    }

    if (traversedPaths.length > 0) {
      setPath((prev) => {
        if (prev[prev.length - 1] === traversedPaths[0]) {
          return [...prev, ...traversedPaths.slice(1)];
        }
        return [...prev, ...traversedPaths];
      });
    }

    await fetchArticleByTitle(tempTitle);
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
        
        setPath((prev) => {
          if (prev[prev.length - 1] === initialTitle) return prev;
          return [...prev, initialTitle];
        });

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
      if (isCrazyModeActive) {
        executeCrazyHops(decodedTitle).finally(() => setIsLoading(false));
      } else {
        fetchArticleByTitle(decodedTitle).finally(() => setIsLoading(false));
      }
    }
  };

  const toggleCrazyMode = () => {
    setIsCrazyModeActive(!isCrazyModeActive);
  };

  const handlePathClick = (title) => {
    setIsLoading(true);
    fetchArticleByTitle(title).finally(() => setIsLoading(false));
  };

  const handleClear = () => {
    setSearchTerm('');
    setArticleHtml('');
    setSections([]);
    setCurrentTitle('');
    setPath([]);
    setIsCrazyModeActive(false);
    setCrazyHops(5);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      setShowAuthModal(false);
      showToast('Signed up successfully!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      setShowAuthModal(false);
      showToast('Logged in successfully!');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowSavedModal(false);
    showToast('Logged out successfully!');
  };

  const handleSaveArticle = async () => {
    if (!user || !currentTitle) return;
    setIsLoading(true);
    const { error } = await supabase.from('saved_articles').insert([
      {
        user_id: user.id,
        article_title: currentTitle,
        article_path: path,
        language: 'en'
      }
    ]);
    setIsLoading(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Article and path saved successfully!', 'success');
    }
  };

  const loadSavedArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .order('saved_at', { ascending: false });
      
    setIsLoading(false);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      setSavedArticles(data);
      setShowSavedModal(true);
    }
  };

  const handleDeleteArticle = async (id) => {
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', id);
      
    if (error) {
      showToast(error.message, 'error');
    } else {
      setSavedArticles((prev) => prev.filter((item) => item.id !== id));
      showToast('Item deleted.', 'success');
    }
  };

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <Toast toast={toast} />

      {showAuthModal && (
        <AuthModal
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showSavedModal && (
        <SavedArticlesModal
          savedArticles={savedArticles}
          onClose={() => setShowSavedModal(false)}
          onDelete={handleDeleteArticle}
          onPathClick={handlePathClick}
        />
      )}

      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleClear={handleClear}
        isLoading={isLoading}
        user={user}
        setShowAuthModal={setShowAuthModal}
        loadSavedArticles={loadSavedArticles}
        handleLogout={handleLogout}
      />
      
      <main className="main-content">
        <LeftSidebar sections={sections} />
        
        <ArticleViewer 
          articleRef={articleRef}
          handleArticleClick={handleArticleClick}
          currentTitle={currentTitle}
          articleHtml={articleHtml}
        />

        <RightSidebar 
          user={user}
          currentTitle={currentTitle}
          handleSaveArticle={handleSaveArticle}
          crazyHops={crazyHops}
          setCrazyHops={setCrazyHops}
          isCrazyModeActive={isCrazyModeActive}
          toggleCrazyMode={toggleCrazyMode}
          isLoading={isLoading}
          path={path}
          handlePathClick={handlePathClick}
        />
      </main>
    </div>
  );
}

export default App;