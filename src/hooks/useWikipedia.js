import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { searchArticle, fetchArticle, getLinks, isInvalidNamespace, cancelRequest } from '../api/wikipedia';

export function useWikipedia({ addToPath, updateLastPathEntry }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const abortRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [articleHtml, setArticleHtml] = useState('');
  const [sections, setSections] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showToastRef = useRef(null);

  const setShowToast = useCallback((fn) => { showToastRef.current = fn; }, []);

  const showError = useCallback(() => {
    showToastRef.current?.(t('toasts.fetchError'), 'error');
  }, [t]);

  const fetchArticleByTitle = useCallback(async (title, lang = currentLang) => {
    cancelRequest(`fetch:${title}`);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await fetchArticle(title, lang, controller.signal);
      if (!result) {
        showError();
        return;
      }

      setCurrentTitle(result.title);
      setArticleHtml(result.html);
      setSections(result.sections);

      addToPath(result.title);
    } catch (err) {
      if (err.name !== 'AbortError') showError();
    }
  }, [currentLang, showError, addToPath]);

  const getRandomInternalLink = useCallback(async (articleTitle) => {
    const controller = new AbortController();
    const { links, resolvedTitle } = await getLinks(articleTitle, currentLang, controller.signal);

    if (links.length === 0) {
      return { nextLink: null, resolvedTitle };
    }

    const randomIndex = Math.floor(Math.random() * links.length);
    return { nextLink: links[randomIndex], resolvedTitle };
  }, [currentLang]);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsLoading(true);

    try {
      const initialTitle = await searchArticle(searchTerm, currentLang);

      if (!initialTitle) {
        showToastRef.current?.(t('toasts.noResults'), 'error');
        setIsLoading(false);
        return;
      }

      addToPath(initialTitle);

      const { nextLink, resolvedTitle } = await getRandomInternalLink(initialTitle);

      if (resolvedTitle !== initialTitle) {
        updateLastPathEntry(resolvedTitle);
      }

      if (nextLink) {
        await fetchArticleByTitle(nextLink, currentLang);
      } else {
        await fetchArticleByTitle(resolvedTitle, currentLang);
      }
    } catch {
      showError();
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentLang, showError, addToPath, updateLastPathEntry, fetchArticleByTitle, getRandomInternalLink, t]);

  const handleArticleClick = useCallback((e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    if (href.startsWith('/w/')) {
      e.preventDefault();
      return;
    }

    if (!href.startsWith('/wiki/')) return;
    e.preventDefault();

    let title = href.replace('/wiki/', '');
    title = title.split('#')[0];
    const decodedTitle = decodeURIComponent(title);

    if (isInvalidNamespace(decodedTitle)) {
      showToastRef.current?.(t('toasts.invalidPage'), 'error');
      return;
    }

    return decodedTitle;
  }, [t]);

  const handlePathClick = useCallback(async (title, itemLang) => {
    setIsLoading(true);
    let fetchLang = currentLang;

    if (itemLang && itemLang !== currentLang) {
      fetchLang = itemLang;
      localStorage.setItem('huhkipedia_lang', itemLang);
    }

    await fetchArticleByTitle(title, fetchLang);
    setIsLoading(false);
  }, [currentLang, fetchArticleByTitle]);

  const clearArticle = useCallback(() => {
    setArticleHtml('');
    setSections([]);
    setCurrentTitle('');
  }, []);

  return {
    searchTerm, setSearchTerm,
    articleHtml, setArticleHtml,
    sections, setSections,
    currentTitle, setCurrentTitle,
    isLoading, setIsLoading,
    fetchArticleByTitle,
    getRandomInternalLink,
    handleSearch,
    handleArticleClick,
    handlePathClick,
    clearArticle,
    setShowToast
  };
}
