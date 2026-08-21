import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { transactionApi } from '../services/api.js';
import { TransactionTable } from '../components/transactions/TransactionTable.jsx';
import { ExpenseCategories, IncomeCategories } from '../types.js';

export const TransactionsPage = ({
  onOpenNewTxModal,
  onReportMistake,
  onEditMetadata,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionApi.getTransactions({
        search: search || undefined,
        type: typeFilter || undefined,
        category: categoryFilter || undefined,
        period: periodFilter || undefined,
      });
      setTransactions(res.transactions);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter, periodFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const allCategories = Array.from(
    new Set([...ExpenseCategories, ...IncomeCategories])
  );

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Header */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Transaction History
            </h1>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Complete immutable ledger with mistake adjustments and audit tracking in MongoDB.
          </p>
        </div>

        <button
          onClick={onOpenNewTxModal}
          className="bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Record Transaction
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-white border border-[#EBE7E0] p-4 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A096]" />
          <input
            type="text"
            placeholder="Search by title, description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl pl-9 pr-4 py-2 text-sm text-[#353531] placeholder-[#A5A096] focus:outline-none focus:border-[#434C3E]"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-[#7A756D] font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3 py-2 text-xs font-medium text-[#353531] focus:outline-none focus:border-[#434C3E]"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
            <option value="CORRECTION">Corrections Only</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3 py-2 text-xs font-medium text-[#353531] focus:outline-none focus:border-[#434C3E]"
          >
            <option value="">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Period (Month picker) */}
          <input
            type="month"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3 py-1.5 text-xs font-medium text-[#353531] focus:outline-none focus:border-[#434C3E]"
          />

          {(search || typeFilter || categoryFilter || periodFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('');
                setCategoryFilter('');
                setPeriodFilter('');
              }}
              className="text-xs font-semibold text-[#BC8A5F] hover:text-[#8C5D33] px-2 py-1 underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-[#EBE7E0]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#434C3E] border-t-transparent"></div>
        </div>
      ) : (
        <TransactionTable
          transactions={transactions}
          onReportMistake={onReportMistake}
          onEditMetadata={onEditMetadata}
        />
      )}
    </div>
  );
};
