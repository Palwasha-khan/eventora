import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log("🔌 Attempting login with:", email);
    const response = await api.post('/auth/login', { email, password });
    
    console.log("📦 Full Backend Response Data:", response.data);

    // 1. Check if we received a token directly from the root
    if (response.data && response.data.token) {
      
      // 2. Extract user details directly from the root response data object
      const userData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      };

      console.log("✅ Checkpoint 1: Success flag or token found.");
      console.log("👤 User payload to be saved:", userData);
      console.log("🔑 Token payload to be saved:", response.data.token);

      // 3. Save to global Auth context
      login(userData, response.data.token);
      
      console.log("🚀 Checkpoint 2: global login() called. Triggering navigation to /dashboard...");
      navigate('/dashboard');
    } else {
      console.log("⚠️ Checkpoint Failed: Response did not contain success flag or token.");
    }
  } catch (err) {
    console.error("❌ Catch Block Error:", err);
    setError(err.response?.data?.message || 'Invalid email or password.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 text-center mb-2">Welcome Back</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in to manage your bookings and events.</p>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-semibold mb-4 border border-rose-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-teal-600/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging you in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-slate-600 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;