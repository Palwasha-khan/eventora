import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Save, Loader2, Image, Calendar, MapPin, DollarSign, Users, Clock, FileText } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams(); // Extracts event ID from the route path parameters
  const navigate = useNavigate();

  // Component states
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    availableSeats: 0,
    image: ''
  });

  // Fetch individual event parameters on initialization
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        
        // Unpack payload data correctly handling wrapping objects if present
        const eventData = response.data?.event || response.data?.data || response.data;
        
        if (eventData) {
          // Format date string to YYYY-MM-DD so standard HTML input inputs populate cleanly
          const formattedDate = eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '';
          
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            date: formattedDate,
            time: eventData.time || '',
            location: eventData.location || '',
            price: eventData.price ?? 0,
            availableSeats: eventData.availableSeats ?? 0,
            image: eventData.image || ''
          });
        } else {
          setError('Event data could not be found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event details. The target may not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id]);

  // Handle generalized input text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'availableSeats' ? Number(value) : value
    }));
  };

  // Submit revised fields to backend PUT route
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setError('');
      
      await api.put(`/events/${id}`, formData);
      
      // Navigate cleanly back to manager control index upon resolution
      navigate('/admin/manage-events');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update event details. Please verify validations.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg-deep flex flex-col items-center justify-center gap-3 text-brand-text-main">
        <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
        <p className="text-brand-text-muted text-xs font-semibold">Staging event telemetry profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Action Header */}
        <button 
          onClick={() => navigate('/admin/manage-events')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text-muted hover:text-brand-accent transition-colors mb-4 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Abort Changes
        </button>

        <h1 className="text-2xl font-extrabold text-brand-text-bright mb-8">
          Modify <span className="text-brand-accent">Event Registry</span>
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-brand-bg-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Event Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tech Symposium 2026"
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a breakdown of schedule details, targets, and notes..."
              className="w-full bg-brand-bg-deep border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors resize-y min-h-[100px]"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="text"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 18:00 or 6:00 PM"
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Location / Venue Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Venue Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Silicon Valley Auditorium or Virtual Link"
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Price & Seats Capacity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="number"
                  name="price"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Available Capacity Seats</label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="number"
                  name="availableSeats"
                  min="0"
                  required
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Cover Image URL Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Image Banner URL</label>
            <div className="relative">
              <Image className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/images/banner.jpg"
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Actions Submission Controls Footer */}
          <div className="pt-4 border-t border-brand-border/40 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-events')}
              disabled={submitLoading}
              className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text-bright text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] cursor-pointer disabled:opacity-50"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Registry...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEvent;