import '../App.css';

function AuthModal({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleSignUp,
  onClose
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Authentication</h2>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-buttons">
            <button type="button" onClick={handleLogin}>Log In</button>
            <button type="button" onClick={handleSignUp}>Sign Up</button>
          </div>
        </form>
        <button className="close-modal-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AuthModal;