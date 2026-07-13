import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
 
const Home = () => (
  <div className="p-12 text-center text-3xl font-black text-white bg-teal-600 rounded-2xl shadow-xl max-w-md mx-auto mt-10">
    🎉 Tailwind is Working!
  </div>
);const Login = () => <div className="p-8 text-center text-xl font-bold text-teal-600">🔐 Login Form Screen</div>;
const Register = () => <div className="p-8 text-center text-xl font-bold text-teal-600">📝 Register Account Screen</div>;
const UserDashboard = () => <div className="p-8 text-center text-xl font-bold text-teal-600">👤 User Panel Dashboard</div>;
const AdminDashboard = () => <div className="p-8 text-center text-xl font-bold text-teal-600">🛠️ Admin Control Dashboard</div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <nav className="flex justify-between items-center bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h1 className="text-xl font-black text-teal-600 tracking-tight">Evently</h1>
          <div className="space-x-4 text-sm font-semibold text-slate-600">
            <a href="/" className="hover:text-teal-600">Marketplace</a>
            <a href="/login" className="hover:text-teal-600">Login</a>
            <a href="/dashboard" className="hover:text-teal-600">User Dashboard</a>
            <a href="/admin" className="hover:text-teal-600">Admin Panel</a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;