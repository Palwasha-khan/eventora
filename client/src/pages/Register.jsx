import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 📡 POST data to your registration endpoint
      await axios.post('http://localhost:4000/api/auth/register', formData);
      
      // Store email temporarily so the OTP page knows who to verify
      localStorage.setItem('temp_verify_email', formData.email);
      
      // Go directly to the verification page
      navigate('/verify-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg-deep px-4">
      <div className="max-w-md w-full bg-brand-bg-card border border-brand-border rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-brand-text-bright text-center mb-2">Create Account</h2>
        <p className="text-brand-text-muted text-center mb-6 font-medium text-sm">Sign up to explore and reserve local events.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-brand-danger-border text-brand-danger-text text-sm rounded-xl font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-brand-text-main mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-brand-bg-deep border border-brand-border rounded-xl py-3 px-4 text-brand-text-bright focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-main mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-brand-bg-deep border border-brand-border rounded-xl py-3 px-4 text-brand-text-bright focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-main mb-1.5">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-brand-bg-deep border border-brand-border rounded-xl py-3 px-4 text-brand-text-bright focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep font-black py-3 rounded-xl shadow-lg shadow-brand-accent/10 transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text-muted font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;