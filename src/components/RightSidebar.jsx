import { useTranslation } from 'react-i18next';

function RightSidebar({
  user,
  currentTitle,
  handleSaveArticle,
  crazyHops,
  setCrazyHops,
  isCrazyModeActive,
  toggleCrazyMode,
  isLoading,
  path,
  handlePathClick
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  return (
    <aside className="sidebar right-sidebar">
      {currentTitle && (
        <div className="panel action-panel">
          {user && (
            <button 
              className="save-btn" 
              onClick={handleSaveArticle}
              disabled={isLoading}
            >
              {t('sidebar.saveState')}
            </button>
          )}
          <a 
            href={`https://${currentLang}.wikipedia.org/wiki/${encodeURIComponent(currentTitle.replace(/ /g, '_'))}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link-btn"
          >
            {t('sidebar.openWiki')}
          </a>
        </div>
      )}

      {currentTitle && (
        <div className="crazy-mode-controls panel">
          <h3>{t('sidebar.crazyMode')}</h3>
          <label>
            {t('sidebar.hops')}
            <input 
              type="number" 
              min="1" 
              max="50" 
              value={crazyHops} 
              onChange={(e) => setCrazyHops(Number(e.target.value))}
            />
          </label>
          <button 
            onClick={toggleCrazyMode} 
            disabled={isLoading}
            style={{ backgroundColor: isCrazyModeActive ? '#dc3545' : '#0645ad' }}
          >
            {isCrazyModeActive ? t('sidebar.stopCrazy') : t('sidebar.startCrazy')}
          </button>
        </div>
      )}

      {path.length > 0 && (
        <div className="path-history panel">
          <h3>{t('sidebar.navPath')}</h3>
          <ul>
            {path.map((p, index) => (
              <li key={index}>
                <button 
                  className="path-link" 
                  onClick={() => handlePathClick(p)}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default RightSidebar;