import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo/MediMom_logo.svg';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', babyName: '', babyAge: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
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
    } finally {
      setLoading(false);
    }
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
        .optional-label { color: #B8C9C9; font-size: 11px; font-weight: 300; margin-left: 6px; }

        .form-section-divider { position: relative; text-align: center; margin: 8px 0 4px; }
        .form-section-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(212,165,165,0.25); }
        .form-section-divider span { position: relative; background: #FFFFFF; padding: 0 12px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 300; color: #C5D3D3; letter-spacing: 0.08em; text-transform: uppercase; }

        .btn-submit {
          width: 100%;
          padding: 15px;
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
        .btn-submit:hover:not(:disabled) { background: #3a6566; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(72,122,123,0.25); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

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

        .divider { display: flex; align-items: center; gap: 12px; }
        .divider-line { flex: 1; height: 1px; background: rgba(212,165,165,0.25); }
        .divider-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #C5D3D3; letter-spacing: 0.06em; }
      `}</style>

      {/* Nav */}
      <nav className="sans" style={{ padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src={Logo} alt="MediMom" style={{ height: '36px', objectFit: 'contain' }} />
          <span className="serif" style={{ fontSize:'20px', color:'#487A7B', fontWeight:400 }}>MediMom</span>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '12px 24px 48px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="serif" style={{ fontSize: '44px', fontWeight: 300, color: '#487A7B', marginBottom: '8px', lineHeight: 1.1 }}>
              Begin your journey
            </h1>
            <p className="sans" style={{ color: '#9CAF88', fontSize: '15px', fontWeight: 300 }}>
              Join thousands of supported mothers
            </p>
          </div>

          {/* Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '28px', padding: '36px', boxShadow: '0 8px 50px rgba(72,122,123,0.1)', border: '1px solid rgba(212,165,165,0.12)' }}>

            {error && (
              <div className="sans" style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(212,165,165,0.15)', color: '#8B5E5E', fontSize: '14px', fontWeight: 300, border: '1px solid rgba(212,165,165,0.3)' }}>
                {error}
              </div>
            )}

            {/* Google */}
            <button onClick={handleGoogleSignIn} disabled={loading} className="btn-google" style={{ marginBottom: '20px' }}>
              <FcGoogle style={{ fontSize: '20px' }} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="divider" style={{ marginBottom: '20px' }}>
              <div className="divider-line" />
              <span className="divider-text">or sign up with email</span>
              <div className="divider-line" />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div>
                <label className="form-label">Your name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="form-input" placeholder="Enter your name" />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" placeholder="your@email.com" />
              </div>

              <div className="form-section-divider">
                <span>Baby info — optional</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Baby's name <span className="optional-label">optional</span></label>
                  <input type="text" name="babyName" value={formData.babyName} onChange={handleChange} className="form-input" placeholder="Baby's name" />
                </div>
                <div>
                  <label className="form-label">Age in weeks <span className="optional-label">optional</span></label>
                  <input type="text" name="babyAge" value={formData.babyAge} onChange={handleChange} className="form-input" placeholder="e.g. 3 weeks" />
                </div>
              </div>

              <div className="form-section-divider" style={{ marginTop: '4px' }}>
                <span>Create password</span>
              </div>

              <div>
                <label className="form-label">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="form-input" placeholder="At least 6 characters" />
              </div>

              <div>
                <label className="form-label">Confirm password</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="form-input" placeholder="Re-enter your password" />
              </div>

              <button type="submit" disabled={loading} className="btn-submit" style={{ marginTop: '8px' }}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <div style={{ height: '1px', background: 'rgba(212,165,165,0.2)', marginBottom: '20px' }} />
              <p className="sans" style={{ color: '#B8C9C9', fontSize: '14px', fontWeight: 300 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#487A7B', textDecoration: 'none', fontWeight: 400 }}>Sign in</Link>
              </p>
            </div>
          </div>

          <p className="sans" style={{ textAlign: 'center', color: '#C5D3D3', fontSize: '12px', fontWeight: 300, marginTop: '24px' }}>
            🔒 Your data is private and never shared
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;