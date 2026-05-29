import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('auth.title', 'Authentication')}</h2>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={t('auth.emailPlaceholder', 'Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('auth.passwordPlaceholder', 'Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-buttons">
            <button type="button" onClick={handleLogin}>{t('auth.loginBtn')}</button>
            <button type="button" onClick={handleSignUp}>{t('auth.signupBtn')}</button>
          </div>
        </form>
        <button className="close-modal-btn" onClick={onClose}>{t('auth.closeBtn')}</button>
      </div>
    </div>
  );
}

export default AuthModal;