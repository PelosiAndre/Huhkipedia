import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Header({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleClear,
  isLoading,
  user,
  setShowAuthModal,
  loadSavedArticles,
  handleLogout,
  setShowHelpModal,
  requestLanguageChange,
  isHome
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const [menuOpen, setMenuOpen] = useState(false);

  const onClearClick = () => {
    setMenuOpen(false);
    handleClear();
  };

  const executeSearch = (e) => {
    setMenuOpen(false);
    handleSearch(e);
  };

  return (
    <header className={`custom-header ${isHome ? 'home-layout' : 'reading-layout'}`}>
      <div className="header-brand-container">
        <div className="header-brand">
          <h1>Huhkipedia</h1>
        </div>
        {!isHome && (
          <button 
            type="button" 
            className="mobile-menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>
      
      <div className={`header-content ${!isHome && menuOpen ? 'mobile-open' : ''}`}>
        <form className="header-search" onSubmit={executeSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
          />
          <button type="submit" disabled={isLoading}>
            {t('header.searchBtn')}
          </button>
          <button 
            type="button" 
            onClick={onClearClick} 
            disabled={isLoading} 
            className="header-btn outline clear-btn"
          >
            {t('header.clearBtn')}
          </button>
        </form>

        <div className="header-actions">
          <button 
            type="button"
            className="header-btn outline lang-toggle-btn" 
            onClick={() => { requestLanguageChange(); setMenuOpen(false); }}
            title="Change Language / Mudar Idioma"
          >
            <span style={{ opacity: currentLang === 'en' ? 1 : 0.4 }}>EN</span>
            <span style={{ margin: '0 4px', opacity: 0.5 }}>|</span>
            <span style={{ opacity: currentLang === 'pt' ? 1 : 0.4 }}>PT</span>
          </button>

          <button 
            type="button"
            className="header-btn outline help-btn" 
            onClick={() => { setShowHelpModal(true); setMenuOpen(false); }}
            title="Help"
          >
            ?
          </button>
          
          {!user ? (
            <button className="header-btn" onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}>
              {t('header.login')}
            </button>
          ) : (
            <div className="user-controls">
              <span className="user-email-header">{user.email}</span>
              <button className="header-btn" onClick={() => { loadSavedArticles(); setMenuOpen(false); }}>
                {t('header.savedData')}
              </button>
              <button className="header-btn outline" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                {t('header.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;