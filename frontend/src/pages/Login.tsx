import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Mail, ArrowRight, Check, Moon, Bell } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo">
          <div className="login-logo-icon"></div>
          <span>TaskSystemCore</span>
        </div>
        <div className="login-header-right">
          <button className="icon-button">
            <Moon size={20} />
          </button>
          <button className="icon-button">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="login-container">
        <div className="login-card">
          <div className="login-welcome">
            <div className="welcome-icon"></div>
            <h2>Welcome back</h2>
            <p>Access your support workspace to manage tickets, clients, and reports.</p>
            <ul className="welcome-features">
              <li>
                <Check size={16} />
                <span>SSO ready</span>
              </li>
              <li>
                <Check size={16} />
                <span>Secure by design</span>
              </li>
              <li>
                <Check size={16} />
                <span>Fast onboarding</span>
              </li>
            </ul>
          </div>

          <div className="login-form-container">
            <div className="login-tabs">
              <button
                className={isLogin ? 'tab active' : 'tab'}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={!isLogin ? 'tab active' : 'tab'}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  defaultValue="name@company.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" defaultValue="••••••••" />
              </div>

              <div className="form-actions">
                <a href="#" className="forgot-password">Forgot your password?</a>
                <button type="submit" className="btn-primary">
                  Sign in
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="login-alternatives">
                <button type="button" className="btn-alternative">
                  <Cloud size={18} />
                  SAML SSO
                </button>
                <button type="button" className="btn-alternative">
                  <Mail size={18} />
                  Magic Link
                </button>
              </div>

              <p className="login-terms">
                By continuing you agree to the Terms and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

