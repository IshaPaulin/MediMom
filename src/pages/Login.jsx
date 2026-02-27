import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@medimom.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EE' }}>
      <div className="max-w-md mx-auto p-6 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-2" style={{ color: '#487A7B' }}>Welcome back</h1>
          <p style={{ color: '#9CAF88' }}>We missed you, mama</p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium transition"
              style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={handleDemoLogin}
            className="w-full mt-3 py-3 rounded-xl font-medium transition"
            style={{ backgroundColor: '#D4A5A5', color: '#487A7B' }}
          >
            Try Demo Account
          </button>

          <p className="text-center mt-6" style={{ color: '#9CAF88' }}>
            New here?{' '}
            <Link to="/signup" style={{ color: '#487A7B' }} className="font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;