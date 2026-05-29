function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>About Huhkipedia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.5' }}>
          <p>
            Welcome to Huhkipedia! This is a "for fun" project built to give you a new, unpredictable way to explore Wikipedia.
          </p>
          <p>
            <strong>Getting Started:</strong> Type a topic in the search bar. We find the closest matching article, but we don't show it to you right away! Instead, we immediately jump to a random link found inside that first article to start your journey. 
          </p>
          <h3 style={{ margin: '0.5rem 0 0 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Crazy Mode
          </h3>
          <p>
            Want to see how deep the rabbit hole goes? Activate Crazy Mode!
          </p>
          <p>
            Set the number of "Hops" and click any link in the article you are currently reading. Instead of taking you directly to that link, the app will randomly click a link on that next page, and then another link on the page after that, repeating for the number of hops you set. 
          </p>
          <p>
            You will only be shown the final destination, but your entire chaotic route is recorded in your Navigation Path. Log in to save your favorite routes.
          </p>
        </div>
        <button className="close-modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default HelpModal;