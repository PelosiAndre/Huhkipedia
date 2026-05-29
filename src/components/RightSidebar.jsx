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
              Save Current State
            </button>
          )}
          <a 
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(currentTitle.replace(/ /g, '_'))}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link-btn"
          >
            Open in Wikipedia
          </a>
        </div>
      )}

      {currentTitle && (
        <div className="crazy-mode-controls panel">
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
            onClick={toggleCrazyMode} 
            disabled={isLoading}
            style={{ backgroundColor: isCrazyModeActive ? '#dc3545' : '#0645ad' }}
          >
            {isCrazyModeActive ? 'Stop Crazy Mode' : 'Start Crazy Mode'}
          </button>
        </div>
      )}

      {path.length > 0 && (
        <div className="path-history panel">
          <h3>Navigation Path</h3>
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