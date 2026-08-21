import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { ExpenseCategories, IncomeCategories } from '../../types.js';

export const NewTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'INCOME' ? 'Salary' : 'Food');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for the transaction');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        type,
        amount: numAmount,
        title: title.trim(),
        description: description.trim(),
        category,
        transactionDate,
      });
      onClose();
      // Reset form
      setAmount('');
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to record transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#353531] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE7E0]">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              type === 'INCOME' ? 'bg-[#434C3E]/10 text-[#434C3E]' : 'bg-[#BC5F4F]/10 text-[#BC5F4F]'
            }`}>
              {type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#353531]">Record {type === 'INCOME' ? 'Income' : 'Expense'}</h3>
              <p className="text-xs text-[#7A756D]">Permanently logged to your financial history in MongoDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A756D] hover:text-[#353531] p-1.5 rounded-xl hover:bg-[#F7F4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2 bg-[#FDFBF7] p-1 rounded-xl border border-[#EBE7E0]">
              <button
                type="button"
                onClick={() => handleTypeChange('INCOME')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  type === 'INCOME'
                    ? 'bg-[#434C3E] text-white shadow-sm font-bold'
                    : 'text-[#7A756D] hover:text-[#353531]'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Income (Received)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('EXPENSE')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  type === 'EXPENSE'
                    ? 'bg-[#BC5F4F] text-white shadow-sm font-bold'
                    : 'text-[#7A756D] hover:text-[#353531]'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Expense (Spent)
              </button>
            </div>
          </div>

          {/* Amount (₹) */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A756D] font-bold text-base">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl pl-8 pr-4 py-2.5 text-[#353531] text-base font-semibold focus:outline-none focus:border-[#434C3E] focus:ring-1 focus:ring-[#434C3E]"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Title / Name</label>
            <input
              type="text"
              required
              placeholder={type === 'INCOME' ? 'e.g. Monthly Salary, Freelance project' : 'e.g. House Rent, Grocery supermarket'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-[#353531] text-sm focus:outline-none focus:border-[#434C3E] focus:ring-1 focus:ring-[#434C3E]"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-[#353531] text-sm focus:outline-none focus:border-[#434C3E]"
              >
                {(type === 'INCOME' ? IncomeCategories : ExpenseCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Transaction Date</label>
              <input
                type="date"
                required
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2 text-[#353531] text-sm focus:outline-none focus:border-[#434C3E]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#7A756D] mb-1.5 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add optional context or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 ${
                type === 'INCOME'
                  ? 'bg-[#434C3E] hover:bg-[#363E32]'
                  : 'bg-[#BC5F4F] hover:bg-[#A84E3F]'
              }`}
            >
              {loading ? 'Recording...' : `Record ${type === 'INCOME' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
