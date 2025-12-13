import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/DirectionContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(t('auth.invalidCredentials'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#2A7CFF"/>
                <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="login-brand">
              <span className="brand-name">a2zenon</span>
              <span className="product-name">ClinicFlow</span>
            </div>
            <h1>{t('auth.welcomeBack')}</h1>
            <p>{t('auth.signInToContinue')}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t('auth.emailAddress')}</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder={t('auth.enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder={t('auth.enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>{t('auth.rememberMe')}</span>
              </label>
              <a href="#forgot" className="forgot-link">{t('auth.forgotPassword')}</a>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('auth.signIn')}
            </button>
          </form>

          <div className="login-footer">
            <p>{t('auth.demoCredentials')}</p>
            <code>admin@clinicflow.com / password</code>
          </div>
        </div>

        <div className="login-bg">
          <div className="bg-pattern"></div>
          <div className="bg-content">
            <h2>{t('auth.manageYourClinic')}</h2>
            <p>{t('auth.allInOnePlatform')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
