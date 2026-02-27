import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    babyName: '',
    babyAge: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EE' }}>
      <div className="max-w-md mx-auto p-6 pt-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-light mb-2" style={{ color: '#487A7B' }}>Begin your journey</h1>
          <p style={{ color: '#9CAF88' }}>Join thousands of supported mothers</p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#D4A5A5', color: '#F6F3EE' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Baby's Name (Optional)</label>
              <input
                type="text"
                name="babyName"
                value={formData.babyName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="Enter baby's name"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Baby's Age (Optional)</label>
              <input
                type="text"
                name="babyAge"
                value={formData.babyAge}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="e.g., 2 weeks, 3 months"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block mb-2" style={{ color: '#487A7B' }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none"
                style={{ borderColor: '#9CAF88', backgroundColor: '#F6F3EE' }}
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium transition mt-4"
              style={{ backgroundColor: '#487A7B', color: '#F6F3EE' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: '#9CAF88' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#487A7B' }} className="font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;