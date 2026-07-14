import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-brand-bg-deep border-b border-brand-border-dark sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tight text-brand-accent-light flex items-center gap-2">
              <span>🎉</span> Evently
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-semibold text-brand-text-main hover:text-brand-accent-light transition-colors">
              Explore Events
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-semibold text-brand-text-main hover:text-brand-accent-light transition-colors"
                >
                  {user.role === 'admin' ? '🛠️ Admin Panel' : '👤 My Dashboard'}
                </Link>

                <span className="text-sm text-brand-text-muted hidden sm:inline">
                  Hi, <span className="font-bold text-brand-text-bright capitalize">{user.name}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-brand-bg-card hover:bg-brand-danger-hover hover:text-brand-danger-text text-brand-text-main text-sm font-bold py-2 px-4 rounded-xl border border-brand-border hover:border-brand-danger-border transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-brand-text-main hover:text-brand-accent-light transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-sm font-bold py-2 px-4 rounded-xl shadow-lg shadow-brand-accent/10 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;