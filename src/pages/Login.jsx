import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Check your email and password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@medimom.com');
    setPassword('demo123');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F3EE', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'DM Sans', system-ui, sans-serif; }

        .form-input {
          width: 100%;
          padding: 13px 18px;
          border-radius: 14px;
          border: 1.5px solid rgba(156,175,136,0.4);
          background: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #487A7B;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: #B8C9C9; }
        .form-input:focus { border-color: #487A7B; background: #FFFFFF; box-shadow: 0 0 0 4px rgba(72,122,123,0.08); }

        .form-label {
          display: block;
          margin-bottom: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #487A7B;
          letter-spacing: 0.04em;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: #487A7B;
          color: #F6F3EE;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover:not(:disabled) { background: #3a6566; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(72,122,123,0.25); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-google {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          border: 1.5px solid rgba(72,122,123,0.25);
          background: #FFFFFF;
          color: #487A7B;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.01em;
        }
        .btn-google:hover:not(:disabled) { background: #F6F3EE; border-color: #487A7B; transform: translateY(-1px); }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-demo {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          border: 1.5px solid rgba(212,165,165,0.4);
          background: rgba(212,165,165,0.08);
          color: #8B5E5E;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-demo:hover { background: rgba(212,165,165,0.18); border-color: #D4A5A5; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(212,165,165,0.25); }
        .divider-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #C5D3D3; letter-spacing: 0.06em; }
      `}</style>

      {/* Nav */}
      <nav className="sans" style={{ padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FaHeart style={{ color: '#D4A5A5', fontSize: '14px' }} />
          <span className="serif" style={{ fontSize: '20px', color: '#487A7B', fontWeight: 400 }}>MediMom</span>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="serif" style={{ fontSize: '48px', fontWeight: 300, color: '#487A7B', marginBottom: '8px', lineHeight: 1.1 }}>
              Welcome back
            </h1>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300, fontStyle: 'italic' }}>
              We missed you, mama
            </p>
          </div>

          {/* Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '40px', boxShadow: '0 8px 50px rgba(72,122,123,0.1)', border: '1px solid rgba(212,165,165,0.12)' }}>

            {error && (
              <div className="sans" style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(212,165,165,0.15)', color: '#8B5E5E', fontSize: '14px', fontWeight: 300, border: '1px solid rgba(212,165,165,0.3)' }}>
                {error}
              </div>
            )}

            {/* Google */}
            <button onClick={handleGoogleSignIn} disabled={loading} className="btn-google">
              <FcGoogle style={{ fontSize: '20px' }} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="divider" style={{ margin: '20px 0' }}>
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="form-label">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="Enter your password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '4px' }}>
                {loading ? 'Signing in…' : 'Sign in with email'}
              </button>
            </form>

            <div style={{ marginTop: '12px' }}>
              <button onClick={handleDemoLogin} className="btn-demo">Try demo account</button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <div style={{ height: '1px', background: 'rgba(212,165,165,0.2)', marginBottom: '20px' }} />
              <p className="sans" style={{ color: '#B8C9C9', fontSize: '14px', fontWeight: 300 }}>
                New here?{' '}
                <Link to="/signup" style={{ color: '#487A7B', textDecoration: 'none', fontWeight: 400 }}>Create an account</Link>
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" className="sans" style={{ color: '#C5D3D3', fontSize: '13px', fontWeight: 300, textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>

          <p className="sans" style={{ textAlign: 'center', color: '#C5D3D3', fontSize: '12px', fontWeight: 300, marginTop: '12px' }}>
            🔒 Your data is private and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;