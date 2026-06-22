import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabaseClient';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useWikipedia } from './hooks/useWikipedia';
import { useCrazyMode } from './hooks/useCrazyMode';
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

function App() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const articleRef = useRef(null);

  const auth = useAuth();
  const nav = useNavigation();
  const wiki = useWikipedia({
    addToPath: nav.addToPath,
    updateLastPathEntry: nav.updateLastPathEntry
  });
  const crazy = useCrazyMode({
    getRandomInternalLink: wiki.getRandomInternalLink,
    fetchArticleByTitle: wiki.fetchArticleByTitle,
    appendPath: nav.appendPath
  });

  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const isHome = nav.path.length === 0;

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  useEffect(() => {
    wiki.setShowToast(showToast);
  }, [wiki, showToast]);

  const handleArticleClick = (e) => {
    const title = wiki.handleArticleClick(e);
    if (!title) return;

    wiki.setIsLoading(true);
    if (crazy.isCrazyModeActive) {
      crazy.executeCrazyHops(title).finally(() => wiki.setIsLoading(false));
    } else {
      wiki.fetchArticleByTitle(title).finally(() => wiki.setIsLoading(false));
    }
  };

  const handleClear = useCallback(() => {
    wiki.setSearchTerm('');
    wiki.clearArticle();
    nav.clearPath();
    crazy.setIsCrazyModeActive(false);
    crazy.setCrazyHops(crazy.DEFAULT_CRAZY_HOPS);
  }, [wiki, nav, crazy]);

  const confirmLanguageChange = () => {
    const nextLang = currentLang === 'en' ? 'pt' : 'en';
    handleClear();
    localStorage.setItem('huhkipedia_lang', nextLang);
    i18n.changeLanguage(nextLang);
    setShowLangModal(false);
  };

  const requestLanguageChange = () => setShowLangModal(true);

  const loadSavedArticles = async () => {
    wiki.setIsLoading(true);
    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .order('saved_at', { ascending: false });

    wiki.setIsLoading(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      setSavedArticles(data);
      setShowSavedModal(true);
    }
  };

  const handleSaveArticle = async () => {
    if (!auth.user || !wiki.currentTitle) return;
    wiki.setIsLoading(true);
    const { error } = await supabase.from('saved_articles').insert([
      {
        user_id: auth.user.id,
        article_title: wiki.currentTitle,
        article_path: nav.path,
        language: currentLang
      }
    ]);
    wiki.setIsLoading(false);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(t('toasts.savedSuccess'));
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
      showToast(t('toasts.deleted'));
    }
  };

  const handlePathClick = async (title, itemLang) => {
    wiki.setIsLoading(true);
    let fetchLang = currentLang;

    if (itemLang && itemLang !== currentLang) {
      fetchLang = itemLang;
      localStorage.setItem('huhkipedia_lang', itemLang);
      i18n.changeLanguage(itemLang);
    }

    await wiki.fetchArticleByTitle(title, fetchLang);
    wiki.setIsLoading(false);
  };

  const handleLogin = async (e) => {
    try {
      const msg = await auth.handleLogin(e);
      showToast(t(msg));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSignUp = async (e) => {
    try {
      const msg = await auth.handleSignUp(e);
      showToast(t(msg));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = async () => {
    const msg = await auth.handleLogout();
    setShowSavedModal(false);
    showToast(t(msg));
  };

  return (
    <div className="app-container">
      {wiki.isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <Toast toast={toast} />

      {auth.showAuthModal && (
        <AuthModal
          email={auth.email}
          setEmail={auth.setEmail}
          password={auth.password}
          setPassword={auth.setPassword}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          onClose={() => auth.setShowAuthModal(false)}
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
        searchTerm={wiki.searchTerm}
        setSearchTerm={wiki.setSearchTerm}
        handleSearch={wiki.handleSearch}
        handleClear={handleClear}
        isLoading={wiki.isLoading}
        user={auth.user}
        setShowAuthModal={() => auth.setShowAuthModal(true)}
        loadSavedArticles={loadSavedArticles}
        handleLogout={handleLogout}
        setShowHelpModal={setShowHelpModal}
        requestLanguageChange={requestLanguageChange}
        isHome={isHome}
      />

      {!isHome && (
        <main className="main-content">
          <LeftSidebar sections={wiki.sections} />

          <ArticleViewer
            articleRef={articleRef}
            handleArticleClick={handleArticleClick}
            currentTitle={wiki.currentTitle}
            articleHtml={wiki.articleHtml}
          />

          <RightSidebar
            user={auth.user}
            currentTitle={wiki.currentTitle}
            handleSaveArticle={handleSaveArticle}
            crazyHops={crazy.crazyHops}
            setCrazyHops={crazy.setCrazyHops}
            isCrazyModeActive={crazy.isCrazyModeActive}
            toggleCrazyMode={crazy.toggleCrazyMode}
            isLoading={wiki.isLoading}
            path={nav.path}
            handlePathClick={handlePathClick}
          />
        </main>
      )}
    </div>
  );
}

export default App;
