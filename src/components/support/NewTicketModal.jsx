import React, { useState } from 'react';
import { X, LifeBuoy, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export const NewTicketModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim()) {
      setError('Please provide a subject for your request');
      return;
    }

    if (!message.trim()) {
      setError('Please describe your issue or question');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(subject.trim(), message.trim());
      onClose();
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to create support ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-lg w-full p-6 shadow-xl text-[#353531] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE7E0]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#353531]">New Support Request</h3>
              <p className="text-xs text-[#7A756D]">Direct message channel to Zen FinTrack administration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A756D] hover:text-[#353531] p-1.5 rounded-lg hover:bg-[#F7F4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 p-3.5 bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl text-xs text-[#7A756D] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#434C3E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#353531]">Privacy Guarantee:</strong> The administrator cannot view your financial
            transactions or balance. Only the text you voluntarily write here is shared.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#353531] mb-1.5">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. How does monthly savings rollover work?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-[#353531] placeholder-[#A5A096] text-sm focus:outline-none focus:border-[#434C3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#353531] mb-1.5">Message</label>
            <textarea
              rows={4}
              required
              placeholder="Describe your doubt, question, or issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2 text-[#353531] placeholder-[#A5A096] text-sm focus:outline-none focus:border-[#434C3E]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#EBE7E0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#7A756D] hover:text-[#353531] rounded-xl hover:bg-[#F7F4EE] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
