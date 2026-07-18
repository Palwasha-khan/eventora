import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Loader, KeyRound, Mail, AlertTriangle } from 'lucide-react';

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
      
      if (response.data && response.data.token) {
        const userData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        };
        login(userData, response.data.token);
        navigate('/dashboard');
      } 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep flex items-center justify-center px-6 text-brand-text-main">
      <div className="bg-brand-bg-card border border-brand-border p-8 rounded-2xl shadow-2xl w-full max-w-md scale-in">
        
        <h2 className="text-3xl font-extrabold text-brand-text-bright text-center mb-2">
          Welcome <span className="text-brand-accent">Back</span>
        </h2>
        <p className="text-xs text-brand-text-muted text-center mb-8">
          Sign in to access your administrative terminal or user space.
        </p>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-3.5 rounded-xl text-xs font-semibold mb-6 border border-rose-500/20 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-accent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-accent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-brand-bg-deep font-bold py-3 px-4 rounded-xl shadow-lg shadow-brand-accent/10 hover:opacity-90 transition-all disabled:opacity-50 mt-4 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-xs text-brand-text-muted text-center mt-6">
          Don't have an terminal node yet?{' '}
          <Link to="/register" className="text-brand-accent font-bold hover:underline ml-1">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;