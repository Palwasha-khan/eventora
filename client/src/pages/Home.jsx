import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-12 text-center mt-10">
      <div className="bg-brand-bg-card border border-brand-border rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-black text-brand-text-bright mb-4">
          Discover Amazing Local Events
        </h1>
        <p className="text-brand-text-muted mb-6 font-medium">
          Create, explore, and book events seamlessly with Evently.
        </p>
        
          
        <Link 
          to="/login"
          className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep font-black py-3 px-6 rounded-2xl shadow-lg shadow-brand-accent/10 transition-all cursor-pointer"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
};

export default Home;