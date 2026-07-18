import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, MapPin, Trash2, Edit, Search, AlertTriangle, Loader2, ArrowLeft, Plus } from 'lucide-react';

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all events managed by the admin
 const fetchEvents = async () => {
  try {
    setLoading(true);
    const response = await api.get('/events');
    
    // Look at what console.log prints in your browser inspect tools. 
    // If it looks like { success: true, events: [...] }, you must target response.data.events
    if (response.data && response.data.events) {
      setEvents(response.data.events);
    } else if (Array.isArray(response.data)) {
      setEvents(response.data);
    } else if (response.data && response.data.data) {
      setEvents(response.data.data);
    } else {
      setEvents([]);
    }
    
    console.log("Your backend response structure:", response.data);
  } catch (err) {
    console.error(err);
    setError('Failed to fetch events. Please reload the page.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  // FIXED: Added array evaluation fallback to prevent runtime crash if events is undefined or an unexpected structure
  const filteredEvents = Array.isArray(events)
    ? events.filter((event) =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Open delete confirmation dialog
  const openDeleteModal = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteModal = () => {
    setEventToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Send DELETE request to backend
  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/events/${eventToDelete._id}`);
      
      // Remove from local UI state
      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== eventToDelete._id));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text-muted hover:text-brand-accent transition-colors mb-3 cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Terminal
            </button>
            <h1 className="text-2xl font-extrabold text-brand-text-bright">
              Manage <span className="text-brand-accent">Events Catalog</span>
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/admin/create-event')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
          <input
            type="text"
            placeholder="Search events by title or venue location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg-card border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
            <p className="text-brand-text-muted text-xs font-semibold">Retrieving event registries...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-brand-bg-card border border-brand-border rounded-2xl p-8">
            <p className="text-brand-text-muted text-sm">No events found matching your search parameters.</p>
          </div>
        ) : (
          /* Events Grid List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FIXED: Optional Chaining on map execution block */}
            {filteredEvents?.map((event) => (
              <div 
                key={event._id}
                className="bg-brand-bg-card border border-brand-border rounded-xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-brand-border-hover transition-all"
              >
                <div>
                  {/* Event Thumbnail */}
                  <div className="h-40 w-full bg-brand-bg-deep relative overflow-hidden">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-text-muted text-xs italic bg-neutral-900">
                        No cover image preview available
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-brand-bg-deep/80 backdrop-blur-md border border-brand-border text-brand-accent text-[10px] font-bold rounded-md">
                      ${event.price === 0 ? 'Free' : event.price}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-brand-text-bright line-clamp-1 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-brand-text-muted text-xs line-clamp-2 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-brand-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                        <span>{event.date ? new Date(event.date).toLocaleDateString() : ''} @ {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls Footer */}
                <div className="p-4 bg-brand-bg-deep/40 border-t border-brand-border/40 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-brand-border rounded-lg text-brand-text-bright hover:bg-brand-border/20 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Modify
                  </button>
                  <button
                    onClick={() => openDeleteModal(event)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-red-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Absolute Delete Confirmation Overlay Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-brand-bg-card border border-brand-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scaleUp">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-text-bright">Confirm Event Terminations</h3>
                  <p className="text-brand-text-muted text-xs mt-1 leading-relaxed">
                    Are you sure you want to completely erase <span className="text-brand-text-bright font-semibold">"{eventToDelete?.title}"</span>? This action is permanent and will cascade to affect related customer bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text-bright text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Confirm Deletion'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEvents;