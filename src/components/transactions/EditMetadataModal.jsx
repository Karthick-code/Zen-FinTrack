import React, { useState, useEffect } from 'react';
import { X, Edit3, Lock, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters.js';

export const EditMetadataModal = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title || '');
      setDescription(transaction.description || '');
      setError(null);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(transaction._id || transaction.id, title.trim(), description.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update transaction details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#353531] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE7E0]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#353531]">Edit Details</h3>
              <p className="text-xs text-[#7A756D]">Update descriptive notes without changing financial ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A756D] hover:text-[#353531] p-1.5 rounded-xl hover:bg-[#F7F4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Immutable financial parameters banner */}
        <div className="mt-4 p-3 bg-[#FDFBF7] rounded-xl border border-[#EBE7E0] text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#7A756D]">
            <Lock className="w-3.5 h-3.5 text-[#A5A096]" />
            <span>Amount & Type are immutable:</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-[#EBE7E0]/70 text-[#434C3E] font-semibold text-[11px]">
              {transaction.type}
            </span>
            <span className="font-bold text-[#353531] font-mono">
              {formatINR(transaction.amount)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Title / Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-[#353531] text-sm focus:outline-none focus:border-[#434C3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Description / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add contextual details or receipt references..."
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2 text-[#353531] text-sm focus:outline-none focus:border-[#434C3E]"
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
              className="px-5 py-2.5 bg-[#434C3E] hover:bg-[#363E32] text-white font-semibold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
