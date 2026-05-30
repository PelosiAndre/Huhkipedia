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

  return (
    <header className={`custom-header ${isHome ? 'home-layout' : ''}`}>
      <div className="header-brand">
        <h1>Huhkipedia</h1>
      </div>
      
      <form className="header-search" onSubmit={handleSearch}>
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
          onClick={handleClear} 
          disabled={isLoading} 
          className="header-btn outline"
        >
          {t('header.clearBtn')}
        </button>
      </form>

      <div className="header-actions">
        <button 
          type="button"
          className="header-btn outline lang-toggle-btn" 
          onClick={requestLanguageChange}
          title="Change Language / Mudar Idioma"
        >
          <span style={{ opacity: currentLang === 'en' ? 1 : 0.4 }}>EN</span>
          <span style={{ margin: '0 4px', opacity: 0.5 }}>|</span>
          <span style={{ opacity: currentLang === 'pt' ? 1 : 0.4 }}>PT</span>
        </button>

        <button 
          type="button"
          className="header-btn outline help-btn" 
          onClick={() => setShowHelpModal(true)}
          title="Help"
        >
          ?
        </button>
        
        {!user ? (
          <button className="header-btn" onClick={() => setShowAuthModal(true)}>
            {t('header.login')}
          </button>
        ) : (
          <div className="user-controls">
            <span className="user-email-header">{user.email}</span>
            <button className="header-btn" onClick={loadSavedArticles}>
              {t('header.savedData')}
            </button>
            <button className="header-btn outline" onClick={handleLogout}>
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;