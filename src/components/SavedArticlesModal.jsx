import '../App.css';

function SavedArticlesModal({ savedArticles, onClose, onDelete, onPathClick }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Saved Articles & Paths</h2>
        <div className="saved-list">
          {savedArticles.length === 0 ? (
            <p>No saved articles found.</p>
          ) : (
            savedArticles.map((item) => (
              <div key={item.id} className="saved-item">
                <div className="saved-item-header">
                  <h4>{item.article_title}</h4>
                  <button className="delete-btn" onClick={() => onDelete(item.id)}>Delete</button>
                </div>
                <div className="saved-path">
                  <strong>Path: </strong>
                  {item.article_path.map((p, index) => (
                    <span key={index}>
                      <button 
                        className="inline-path-btn" 
                        onClick={() => {
                          onPathClick(p);
                          onClose();
                        }}
                      >
                        {p}
                      </button>
                      {index < item.article_path.length - 1 && ' → '}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <button className="close-modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SavedArticlesModal;