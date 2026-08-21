import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  PlusCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { formatINR, formatDate, getMonthName } from '../utils/formatters.js';
import { transactionApi, reportApi } from '../services/api.js';
import { TransactionTable } from '../components/transactions/TransactionTable.jsx';

export const DashboardPage = ({
  onOpenNewTxModal,
  onReportMistake,
  onEditMetadata,
  onNavigateToTransactions,
  onNavigateToReports,
  onNavigateToSavings,
}) => {
  const [financials, setFinancials] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [finRes, txRes] = await Promise.all([
        reportApi.getFinancialState(),
        transactionApi.getTransactions(),
      ]);
      setFinancials(finRes.financials);
      setRecentTransactions(txRes.transactions.slice(0, 6));
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#434C3E] border-t-transparent"></div>
      </div>
    );
  }

  const currentSummary = financials?.monthlySummaries?.find(
    (s) => s.period === financials.currentPeriod
  );

  const effectiveIncome = currentSummary?.effectiveIncome || 0;
  const effectiveExpense = currentSummary?.effectiveExpense || 0;
  const remainingBalance = currentSummary?.remainingBalance || 0;
  const isDeficit = remainingBalance < 0;
  const savings = financials?.savings || 0;

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Overview Header Banner */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Financial Dashboard
            </h1>
            <span className="px-3 py-1 bg-[#434C3E]/10 text-[#434C3E] border border-[#434C3E]/20 text-xs font-bold rounded-full">
              {getMonthName(financials?.currentPeriod)} {financials?.currentPeriod?.split('-')[0]}
            </span>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Real-time balance, multi-period savings rollover, and immutable financial ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewTxModal}
            className="bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Record Transaction
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Core Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Remaining Balance */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Remaining Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-serif font-bold font-mono ${
              isDeficit ? 'text-[#BC5F4F]' : 'text-[#353531]'
            }`}>
              {formatINR(remainingBalance)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1 flex items-center gap-1">
              {isDeficit ? (
                <span className="text-[#BC5F4F] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Deficit for current cycle
                </span>
              ) : (
                <span>Available to spend this month</span>
              )}
            </p>
          </div>
        </div>

        {/* 2. Total Income */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Monthly Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#434C3E] font-mono">
              +{formatINR(effectiveIncome)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1">Earnings received this period</p>
          </div>
        </div>

        {/* 3. Total Expenses */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Monthly Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#BC5F4F]/10 text-[#BC5F4F] flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#BC5F4F] font-mono">
              -{formatINR(effectiveExpense)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1">Outflow recorded this period</p>
          </div>
        </div>

        {/* 4. Accumulated Savings */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Accumulated Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#8C5D33] font-mono">
              {formatINR(savings)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#8C5D33]" />
              Rolled over from past cycles
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation / Feature Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onNavigateToTransactions}
          className="bg-white border border-[#EBE7E0] hover:border-[#434C3E]/40 p-5 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#353531] group-hover:text-[#434C3E] flex items-center gap-2">
              Full Ledger & History
            </h3>
            <ChevronRight className="w-4 h-4 text-[#A5A096] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#7A756D] mt-1.5 leading-relaxed">
            Search, filter by category or date, report mistakes with audit corrections, and edit descriptions.
          </p>
        </div>

        <div
          onClick={onNavigateToReports}
          className="bg-white border border-[#EBE7E0] hover:border-[#434C3E]/40 p-5 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#353531] group-hover:text-[#434C3E] flex items-center gap-2">
              Category Breakdown
            </h3>
            <ChevronRight className="w-4 h-4 text-[#A5A096] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#7A756D] mt-1.5 leading-relaxed">
            Visual graphs of where your money goes across food, rent, bills, commute, and shopping.
          </p>
        </div>

        <div
          onClick={onNavigateToSavings}
          className="bg-white border border-[#EBE7E0] hover:border-[#434C3E]/40 p-5 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#353531] group-hover:text-[#434C3E] flex items-center gap-2">
              Multi-Period Savings Growth
            </h3>
            <ChevronRight className="w-4 h-4 text-[#A5A096] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#7A756D] mt-1.5 leading-relaxed">
            Inspect cycle-by-cycle surplus rollover math and cumulative reserve milestones.
          </p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#353531]">Recent Transactions</h3>
            <p className="text-xs text-[#7A756D]">Latest activity in your ledger</p>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-semibold text-[#434C3E] hover:text-[#363E32] flex items-center gap-1"
          >
            View All ({recentTransactions.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TransactionTable
          transactions={recentTransactions}
          onReportMistake={onReportMistake}
          onEditMetadata={onEditMetadata}
        />
      </div>
    </div>
  );
};
