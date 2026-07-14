import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg-deep text-brand-text-bright transition-colors duration-350">
     <Navbar />  
      <main className="container mx-auto px-4 py-6">
        <Outlet /> {/* This is where Home, Dashboard, etc. will render */}
      </main>
    </div>
  );
};

export default MainLayout;