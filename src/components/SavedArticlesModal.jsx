import { useTranslation } from 'react-i18next';
import { useModal } from '../hooks/useModal';
import '../App.css';

function SavedArticlesModal({ savedArticles, onClose, onDelete, onPathClick }) {
  const { t } = useTranslation();
  const modalRef = useModal(onClose);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="saved-title">
        <h2 id="saved-title">{t('savedData.title')}</h2>
        <div className="saved-list">
          {savedArticles.length === 0 ? (
            <p>{t('savedData.noData')}</p>
          ) : (
            savedArticles.map((item) => (
              <div key={item.id} className="saved-item">
                <div className="saved-item-header">
                  <h4>{item.article_title}</h4>
                  <button className="delete-btn" onClick={() => onDelete(item.id)}>
                    {t('savedData.deleteBtn')}
                  </button>
                </div>
                <div className="saved-path">
                  <strong>{t('savedData.pathHeader', 'Path:')} </strong>
                  {item.article_path.map((p, index) => (
                    <span key={index}>
                      <button 
                        className="inline-path-btn" 
                        onClick={() => {
                          onPathClick(p, item.language);
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
        <button className="close-modal-btn" onClick={onClose}>{t('savedData.closeBtn')}</button>
      </div>
    </div>
  );
}

export default SavedArticlesModal;