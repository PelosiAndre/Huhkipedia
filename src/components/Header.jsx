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
  setShowHelpModal
}) {
  return (
    <header className="custom-header">
      <div className="header-brand">
        <h1>Huhkipedia</h1>
      </div>
      
      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Wikipedia..."
        />
        <button type="submit" disabled={isLoading}>Search</button>
        <button 
          type="button" 
          onClick={handleClear} 
          disabled={isLoading} 
          className="header-btn outline"
        >
          Clear
        </button>
      </form>

      <div className="header-actions">
        <button 
          className="header-btn outline help-btn" 
          onClick={() => setShowHelpModal(true)}
          title="Help"
        >
          ?
        </button>
        
        {!user ? (
          <button className="header-btn" onClick={() => setShowAuthModal(true)}>Log In</button>
        ) : (
          <div className="user-controls">
            <span className="user-email-header">{user.email}</span>
            <button className="header-btn" onClick={loadSavedArticles}>Saved Data</button>
            <button className="header-btn outline" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;