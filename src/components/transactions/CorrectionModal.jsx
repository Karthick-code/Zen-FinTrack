import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters.js';

export const CorrectionModal = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}) => {
  const [correctAmountStr, setCorrectAmountStr] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !transaction) return null;

  const currentEffectiveAmount = transaction.effectiveOriginalAmount !== undefined
    ? transaction.effectiveOriginalAmount
    : transaction.amount;

  const numCorrectAmount = parseFloat(correctAmountStr);
  const isValidAmount = !isNaN(numCorrectAmount) && numCorrectAmount >= 0;
  const difference = isValidAmount ? numCorrectAmount - currentEffectiveAmount : 0;
  const isNoChange = isValidAmount && difference === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidAmount) {
      setError('Please enter a valid non-negative number for the correct amount');
      return;
    }

    if (isNoChange) {
      setError('The entered correct amount is identical to the current effective amount. No correction needed.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        referenceTransactionId: transaction._id || transaction.id,
        correctAmount: numCorrectAmount,
        reason: reason.trim(),
      });
      onClose();
      setCorrectAmountStr('');
      setReason('');
    } catch (err) {
      setError(err.message || 'Failed to submit mistake correction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#353531] relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE7E0]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#353531]">Report Mistake & Correct</h3>
              <p className="text-xs text-[#7A756D]">Preserves historical truth via linked correction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A756D] hover:text-[#353531] p-1.5 rounded-xl hover:bg-[#F7F4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit principle note */}
        <div className="mt-4 p-3.5 bg-[#BC8A5F]/10 border border-[#BC8A5F]/25 rounded-xl text-xs text-[#8C5D33] leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#BC8A5F] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#8C5D33]">Financial Integrity Guarantee</p>
            <p className="mt-0.5 text-[#353531]">
              Zen FinTrack preserves all original records in MongoDB. Entering the correct amount will generate an immutable{' '}
              <strong className="text-[#8C5D33]">CORRECTION</strong> entry linked to this transaction to adjust your balance.
            </p>
          </div>
        </div>

        {/* Original Transaction Summary */}
        <div className="mt-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#EBE7E0] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A756D]">
            <span>Original Transaction</span>
            <span>{formatDate(transaction.transactionDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-[#353531]">{transaction.title}</p>
              <p className="text-xs text-[#7A756D]">Category: {transaction.category}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EBE7E0]/70 text-[#434C3E]">
                {transaction.type}
              </span>
              <p className="text-sm font-bold text-[#353531] font-mono mt-1">
                {formatINR(transaction.amount)}
              </p>
            </div>
          </div>
          {transaction.isCorrected && (
            <div className="pt-2 border-t border-[#EBE7E0] flex justify-between text-xs text-[#7A756D]">
              <span>Current Net Effective Amount:</span>
              <span className="font-semibold text-[#353531] font-mono">{formatINR(currentEffectiveAmount)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Target Correct Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">
              Enter Correct Total Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A756D] font-bold text-base">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder={`e.g. ${currentEffectiveAmount === 1000 ? '10000' : '1000'}`}
                value={correctAmountStr}
                onChange={(e) => setCorrectAmountStr(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl pl-8 pr-4 py-2.5 text-[#353531] text-base font-semibold focus:outline-none focus:border-[#BC8A5F] focus:ring-1 focus:ring-[#BC8A5F]"
              />
            </div>
            <p className="text-[11px] text-[#7A756D] mt-1">
              Enter the actual amount that should have been recorded for this {transaction.type.toLowerCase()}.
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">
              Correction Reason (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Typo in bill amount, extra item refunded, bill revised"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2 text-[#353531] text-sm focus:outline-none focus:border-[#BC8A5F]"
            />
          </div>

          {/* Live Preview Box */}
          {isValidAmount && (
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#EBE7E0] space-y-2.5">
              <p className="text-xs font-semibold text-[#7A756D] uppercase tracking-wider">
                System Calculation Preview
              </p>
              <div className="space-y-1.5 text-xs text-[#353531]">
                <div className="flex justify-between">
                  <span className="text-[#7A756D]">Current Effective Amount:</span>
                  <span className="font-medium font-mono">{formatINR(currentEffectiveAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A756D]">Target Correct Amount:</span>
                  <span className="font-medium font-mono text-[#434C3E]">{formatINR(numCorrectAmount)}</span>
                </div>
                <div className="pt-2 border-t border-[#EBE7E0] flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#8C5D33]">System Adjustment (Correction):</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      difference >= 0
                        ? 'bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30'
                        : 'bg-[#BC5F4F]/15 text-[#BC5F4F] border border-[#BC5F4F]/30'
                    }`}
                  >
                    {difference >= 0 ? `+${formatINR(difference)}` : formatINR(difference)}
                  </span>
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || !isValidAmount || isNoChange}
              className="px-5 py-2.5 bg-[#BC8A5F] hover:bg-[#A87950] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Processing...' : 'Confirm Correction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
