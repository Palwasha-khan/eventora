import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Custom Axios instance pointing to /api
import { Calendar, MapPin, Users, Ticket, AlertCircle } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      if (response.data && Array.isArray(response.data.data)) {
        setEvents(response.data.data); // This correctly grabs the Array(1)!
      } else if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
      
    } catch (err) {
      console.error("Error fetching events:", err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="text-center mb-16 relative py-8">
          {/* Subtle background gradient glow behind title */}
          <div className="absolute inset-0 bg-brand-accent/5 blur-3xl rounded-full max-w-lg mx-auto"></div>
          
          <h1 className="text-4xl font-extrabold text-brand-text-bright sm:text-5xl tracking-tight">
            Upcoming <span className="text-brand-accent">Live Events</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-text-muted">
            Reserve your seats instantly and unlock access to the ultimate interactive event experience.
          </p>
        </div>

        {/* Loading State with Teal Spinner */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent border-r-2 border-r-transparent"></div>
            <p className="text-brand-text-muted animate-pulse">Loading experience data...</p>
          </div>
        )}

        {/* Error State styled with Rose/Red variables */}
        {error && (
          <div className="bg-brand-bg-card border border-brand-danger-border p-5 rounded-xl max-w-xl mx-auto flex items-start gap-3 shadow-lg">
            <AlertCircle className="h-6 w-6 text-brand-danger-text shrink-0" />
            <div>
              <h4 className="font-semibold text-brand-text-bright">Connection Error</h4>
              <p className="text-brand-text-muted text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-24 bg-brand-bg-card rounded-2xl border border-brand-border max-w-lg mx-auto">
            <Ticket className="h-12 w-12 text-brand-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-brand-text-bright text-lg font-medium">No active events schedule found</p>
            <p className="text-brand-text-muted text-sm mt-1 px-4">
              Our organizers are curating some incredible experiences. Check back shortly!
            </p>
          </div>
        )}

        {/* Event Cards Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl hover:border-brand-accent-light transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Event Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
  src={
    event.image 
      ? `http://localhost:4000${event.image.replace(/^\/?public/, '')}`
      : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600'
  } 
  alt={event.title} 
/>
                    <div className="absolute inset-0 bg-linear-to-t from-brand-bg-card to-transparent opacity-85"></div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-text-bright mb-2 truncate group-hover:text-brand-accent-light transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-brand-text-muted text-sm mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Metadata Specs */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-brand-text-main">
                        <Calendar className="h-4 w-4 mr-3 text-brand-accent shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString()} &bull; {event.time}</span>
                      </div>
                      <div className="flex items-center text-brand-text-main">
                        <MapPin className="h-4 w-4 mr-3 text-brand-accent shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-brand-text-main">
                        <Users className="h-4 w-4 mr-3 text-brand-accent shrink-0" />
                        <span>{event.availableSeats} Seats left</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Actions & Price Banner */}
                <div className="px-6 pb-6 pt-4 border-t border-brand-border bg-brand-border-dark flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Price</p>
                    <p className="text-xl font-extrabold text-brand-text-bright">
                      {event.price === 0 ? (
                        <span className="text-brand-accent-light">FREE</span>
                      ) : (
                        `$${event.price}`
                      )}
                    </p>
                  </div>
                  
                  <button 
                    disabled={event.availableSeats === 0}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${
                      event.availableSeats === 0 
                        ? 'bg-brand-bg-deep border border-brand-border text-brand-text-muted cursor-not-allowed' 
                        : 'bg-brand-accent text-brand-bg-deep hover:bg-brand-accent-hover active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                    }`}
                  >
                    {event.availableSeats === 0 ? 'SOLD OUT' : 'BOOK NOW'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;