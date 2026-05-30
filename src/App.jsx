import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useTranslation } from 'react-i18next';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import SavedArticlesModal from './components/SavedArticlesModal';
import HelpModal from './components/HelpModal';
import LanguageConfirmModal from './components/LanguageConfirmModal';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ArticleViewer from './components/ArticleViewer';
import './App.css';

const isInvalidNamespace = (title) => {
  const lowerTitle = title.toLowerCase();
  const invalidPrefixes = [
    'category:', 'categoria:',
    'special:', 'especial:',
    'wikipedia:',
    'help:', 'ajuda:',
    'file:', 'ficheiro:', 'arquivo:',
    'talk:', 'discussão:',
    'user:', 'usuário:', 'utilizador:',
    'template:', 'predefinição:',
    'portal:'
  ];
  return invalidPrefixes.some(prefix => lowerTitle.startsWith(prefix));
};

function App() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const articleRef = useRef(null);

  const isHome = path.length === 0;

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

  const fetchArticleByTitle = async (title, lang = currentLang) => {
    try {
      const parseUrl = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&redirects=1&prop=text|sections&format=json&origin=*`;
      
      const parseRes = await fetch(parseUrl);
      const parseData = await parseRes.json();

      if (parseData.parse) {
        const fetchedTitle = parseData.parse.title;
        setCurrentTitle(fetchedTitle);
        setArticleHtml(parseData.parse.text['*']);
        setSections(parseData.parse.sections);
        
        setPath((prev) => {
          const newPath = [...prev];
          
          if (newPath.length > 0 && newPath[newPath.length - 1] === title) {
            newPath[newPath.length - 1] = fetchedTitle;
          } else if (newPath.length === 0 || newPath[newPath.length - 1] !== fetchedTitle) {
            newPath.push(fetchedTitle);
          }
          
          return newPath;
        });
        
        if (articleRef.current) {
          articleRef.current.scrollTop = 0;
        }
      } else {
        showToast(t('toasts.fetchError'), 'error');
      }
    } catch (error) {
      showToast(t('toasts.fetchError'), 'error');
    }
  };

  const getRandomInternalLink = async (articleTitle) => {
    const endpoint = `https://${currentLang}.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(articleTitle)}&redirects=1&plnamespace=0&pllimit=max&format=json&origin=*`;
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      let resolvedTitle = articleTitle;
      if (data.query.redirects && data.query.redirects.length > 0) {
        resolvedTitle = data.query.redirects[0].to;
      }

      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];

      if (pageId === '-1' || !pages[pageId].links) {
        return { nextLink: null, resolvedTitle };
      }

      const links = pages[pageId].links;
      const randomIndex = Math.floor(Math.random() * links.length);

      return { nextLink: links[randomIndex].title, resolvedTitle };
    } catch (error) {
      return { nextLink: null, resolvedTitle: articleTitle };
    }
  };

  const executeCrazyHops = async (startTitle) => {
    const traversedPaths = [startTitle];
    let currentIdx = 0;
    let hopsDone = 0;

    while (hopsDone < crazyHops) {
      const currentTitle = traversedPaths[currentIdx];
      const { nextLink, resolvedTitle } = await getRandomInternalLink(currentTitle);

      if (resolvedTitle !== currentTitle) {
        traversedPaths[currentIdx] = resolvedTitle;
      }

      if (!nextLink) {
        if (currentIdx > 0) {
          currentIdx--;
        } else {
          break;
        }
      } else {
        traversedPaths.push(nextLink);
        currentIdx = traversedPaths.length - 1;
        hopsDone++;
      }
    }

    if (traversedPaths.length > 0) {
      setPath((prev) => {
        const newPrev = [...prev];
        if (newPrev.length > 0 && newPrev[newPrev.length - 1] === traversedPaths[0]) {
          return [...newPrev, ...traversedPaths.slice(1)];
        }
        return [...newPrev, ...traversedPaths];
      });
    }

    await fetchArticleByTitle(traversedPaths[traversedPaths.length - 1]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsLoading(true);
    const searchUrl = `https://${currentLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=0&utf8=&format=json&origin=*`;
    
    try {
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.query.search.length > 0) {
        const initialTitle = searchData.query.search[0].title;
        
        setPath((prev) => {
          if (prev.length > 0 && prev[prev.length - 1] === initialTitle) return prev;
          return [...prev, initialTitle];
        });

        const { nextLink, resolvedTitle } = await getRandomInternalLink(initialTitle);
        
        if (resolvedTitle !== initialTitle) {
          setPath((prev) => {
            const newPath = [...prev];
            if (newPath.length > 0 && newPath[newPath.length - 1] === initialTitle) {
              newPath[newPath.length - 1] = resolvedTitle;
            }
            return newPath;
          });
        }

        if (nextLink) {
          await fetchArticleByTitle(nextLink);
        } else {
          await fetchArticleByTitle(resolvedTitle);
        }
      }
    } catch (error) {
      showToast(t('toasts.fetchError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleClick = (e) => {
    const target = e.target.closest('a');
    
    if (!target) return;

    const href = target.getAttribute('href');

    if (href && href.startsWith('/w/')) {
      e.preventDefault();
      return;
    }
    
    if (href && href.startsWith('/wiki/')) {
      e.preventDefault();
      
      let title = href.replace('/wiki/', '');
      title = title.split('#')[0]; 
      const decodedTitle = decodeURIComponent(title);
      
      if (isInvalidNamespace(decodedTitle)) {
        showToast(t('toasts.invalidPage'), 'error');
        return;
      }

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

  const handlePathClick = (title, itemLang) => {
    setIsLoading(true);
    let fetchLang = currentLang;

    if (itemLang && itemLang !== currentLang) {
      fetchLang = itemLang;
      localStorage.setItem('huhkipedia_lang', itemLang);
      i18n.changeLanguage(itemLang);
    }

    fetchArticleByTitle(title, fetchLang).finally(() => setIsLoading(false));
  };

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setArticleHtml('');
    setSections([]);
    setCurrentTitle('');
    setPath([]);
    setIsCrazyModeActive(false);
    setCrazyHops(5);
  }, []);

  const confirmLanguageChange = () => {
    const nextLang = currentLang === 'en' ? 'pt' : 'en';
    handleClear();
    localStorage.setItem('huhkipedia_lang', nextLang);
    i18n.changeLanguage(nextLang);
    setShowLangModal(false);
  };

  const requestLanguageChange = () => {
    setShowLangModal(true);
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
      showToast(t('toasts.signedUp'));
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
      showToast(t('toasts.loggedIn'));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowSavedModal(false);
    showToast(t('toasts.loggedOut'));
  };

  const handleSaveArticle = async () => {
    if (!user || !currentTitle) return;
    setIsLoading(true);
    const { error } = await supabase.from('saved_articles').insert([
      {
        user_id: user.id,
        article_title: currentTitle,
        article_path: path,
        language: currentLang
      }
    ]);
    setIsLoading(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(t('toasts.savedSuccess'), 'success');
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
      showToast(t('toasts.deleted'), 'success');
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

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {showLangModal && (
        <LanguageConfirmModal 
          onConfirm={confirmLanguageChange} 
          onCancel={() => setShowLangModal(false)} 
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
        setShowHelpModal={setShowHelpModal}
        requestLanguageChange={requestLanguageChange}
        isHome={isHome}
      />
      
      {!isHome && (
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
      )}
    </div>
  );
}

export default App;