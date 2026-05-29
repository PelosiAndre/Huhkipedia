function LanguageConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>Change Language / Alterar Idioma</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.5' }}>
          <p>
            Changing the language will clear your current search and navigation progress. Do you want to proceed?
          </p>
          <p>
            Alterar o idioma limpará sua pesquisa atual e o progresso de navegação. Deseja continuar?
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button className="header-btn outline" onClick={onCancel} style={{ cursor: 'pointer' }}>
            Cancel / Cancelar
          </button>
          <button className="header-btn" onClick={onConfirm} style={{ cursor: 'pointer' }}>
            Proceed / Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguageConfirmModal;