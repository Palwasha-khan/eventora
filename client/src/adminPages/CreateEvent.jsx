import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, MapPin, DollarSign, Image, FileText, ArrowLeft, Loader2 } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    totalSeats: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (Number(formData.price) < 0 || Number(formData.availableSeats) <= 0) {
      setError('Price cannot be negative and Available Seats must be greater than 0.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/events', {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats)
      });

      if (response.data) {
        setSuccess('Event created successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text-muted hover:text-brand-accent transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        {/* Form Container Card */}
        <div className="bg-brand-bg-card border border-brand-border rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-brand-text-bright">
              Create New <span className="text-brand-accent">Live Event</span>
            </h1>
            <p className="text-brand-text-muted text-xs mt-1">
              Deploy a new ticket block to the public live stream asset catalog.
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-xl text-xs font-semibold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Event Title */}
            <div>
              <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Event Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Cyber Security Summit 2026"
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the event agenda, speakers, or requirements..."
                className="w-full bg-brand-bg-deep border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors resize-none"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors color-scheme-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Time</label>
                <input
                  type="text"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 18:00 - 21:00 EST"
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Location / Venue</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Metropolis Convention Center Hall C or Virtual Stream Link"
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            {/* Price & Capacity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Ticket Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0 for free events"
                    className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Total Seats / Block Capacity</label>
                <input
                  type="number"
                  name="totalSeats"
                  required
                  min="1"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  placeholder="Total tickets up for sale"
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-bold text-brand-text-bright uppercase tracking-wider mb-2">Cover Image Link (URL)</label>
              <div className="relative">
                <Image className="absolute left-4 top-3.5 h-4 w-4 text-brand-text-muted" />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="e.g., https://images.unsplash.com/photo-..."
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-text-bright focus:outline-none focus:border-brand-accent/60 transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-border/40">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text-bright text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  'Deploy Event'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;