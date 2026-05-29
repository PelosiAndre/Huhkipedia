import { useTranslation } from 'react-i18next';

function HelpModal({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('help.title')}</h2>
        <div className="help-content">
          <p>
            {t('help.welcome')}
          </p>
          <p>
            <strong>{t('help.gettingStartedTitle')}</strong> {t('help.gettingStartedText')}
          </p>
          <h3 className="help-subtitle">
            {t('help.crazyModeTitle')}
          </h3>
          <p>
            {t('help.crazyModeP1')}
          </p>
          <p>
            {t('help.crazyModeP2')}
          </p>
          <p>
            {t('help.crazyModeP3')}
          </p>
        </div>
        <button className="close-modal-btn" onClick={onClose}>
          {t('help.close')}
        </button>
      </div>
    </div>
  );
}

export default HelpModal;