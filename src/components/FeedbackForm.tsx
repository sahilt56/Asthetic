'use client';

import { useState } from 'react';

export default function FeedbackForm({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!country.trim()) {
      setError('Country is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, email, message, rating }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✨
        </div>
        <h2 className="font-serif text-2xl text-slate-800 mb-2">Thank you so much!</h2>
        <p className="text-slate-600 text-sm mb-6">Your feedback means a lot to us and helps us get better.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button 
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Send another response
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-2 rounded-xl font-bold">
          ⚠️ {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">How would you rate us?</label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                rating >= num ? 'bg-pink-500 text-white scale-105' : 'bg-slate-100 text-slate-400 hover:bg-pink-100'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[11px] font-bold text-slate-600 uppercase tracking-wide ml-1">Full Name *</label>
          <input
            type="text"
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 text-sm transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-[11px] font-bold text-slate-600 uppercase tracking-wide ml-1">Country *</label>
          <input
            type="text"
            id="country"
            placeholder="E.g., India, USA"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 text-sm transition-all"
          />
        </div>
        <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] font-bold text-slate-600 uppercase tracking-wide ml-1">Email (Optional)</label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">Your Message</label>
        <textarea
          id="message"
          rows={5}
          placeholder="Share your thoughts, suggestions, or questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 text-sm transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full py-3.5 bg-[#E60023] hover:bg-[#c4001d] text-white font-bold rounded-xl shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Sending...
          </>
        ) : (
          'Send Feedback'
        )}
      </button>
    </form>
  );
}
