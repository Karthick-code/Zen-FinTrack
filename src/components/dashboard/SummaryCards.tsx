import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  PiggyBank,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FinancialState, MonthlyFinancialSummary } from '../../types';
import { formatINR } from '../../utils/formatters';

interface SummaryCardsProps {
  financials: FinancialState | null;
  currentSummary?: MonthlyFinancialSummary;
  onNavigateToSavings?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  financials,
  currentSummary,
  onNavigateToSavings,
}) => {
  const currentIncome = financials?.currentIncome ?? 0;
  const currentExpense = currentSummary?.effectiveExpense ?? 0;
  const remainingBalance = financials?.remainingBalance ?? 0;
  const savings = financials?.savings ?? 0;
  const isDeficit = remainingBalance < 0;
  const deficitAmount = isDeficit ? Math.abs(remainingBalance) : 0;

  return (
    <div className="space-y-4">
      {/* Deficit Alert Warning if expenses exceed income */}
      {isDeficit && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 rounded-2xl text-[#8C3A2D] flex items-start gap-3 shadow-sm animate-fade-in">
          <AlertOctagon className="w-5 h-5 text-[#BC5F4F] shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold text-[#BC5F4F]">Period Deficit Detected</h4>
            <p className="mt-0.5 text-[#353531] leading-relaxed">
              You spent <strong className="font-semibold text-[#8C3A2D]">{formatINR(deficitAmount)}</strong> more than your recorded income during this period.
            </p>
            <p className="mt-1 text-xs text-[#7A756D]">
              Zen FinTrack Integrity Rule: This deficit is tracked accurately and does <strong>not</strong> automatically reduce your accumulated savings of {formatINR(savings)}.
            </p>
          </div>
        </div>
      )}

      {/* 4 Core Financial Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Income */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A756D] uppercase tracking-wider">
              Current Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#353531] font-mono tracking-tight">
              {formatINR(currentIncome)}
            </h3>
            <p className="text-xs text-[#434C3E] mt-1 font-medium flex items-center gap-1">
              <span>Active period receipts</span>
            </p>
          </div>
        </div>

        {/* Current Expenses */}
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A756D] uppercase tracking-wider">
              Current Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#BC5F4F]/10 text-[#BC5F4F] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#353531] font-mono tracking-tight">
              {formatINR(currentExpense)}
            </h3>
            <p className="text-xs text-[#7A756D] mt-1 font-medium">
              Effective spent + audit adjustments
            </p>
          </div>
        </div>

        {/* Remaining Balance */}
        <div className={`bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden ${
          isDeficit ? 'border-[#BC5F4F]/40 bg-[#BC5F4F]/5' : 'border-[#EBE7E0]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A756D] uppercase tracking-wider">
              Remaining Balance
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isDeficit ? 'bg-[#BC5F4F]/15 text-[#BC5F4F]' : 'bg-[#BC8A5F]/15 text-[#8C5D33]'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-bold font-mono tracking-tight ${
              isDeficit ? 'text-[#BC5F4F]' : 'text-[#353531]'
            }`}>
              {formatINR(remainingBalance)}
            </h3>
            <p className="text-xs text-[#7A756D] mt-1 font-medium">
              {isDeficit ? 'Over-budget deficit' : 'Unspent period surplus'}
            </p>
          </div>
        </div>

        {/* Accumulated Savings */}
        <div
          onClick={onNavigateToSavings}
          className="bg-[#434C3E] border border-[#363E32] text-white rounded-2xl p-5 shadow-md relative overflow-hidden cursor-pointer hover:bg-[#394134] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E6DED1] uppercase tracking-wider">
              Accumulated Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/15 text-[#FDFBF7] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PiggyBank className="w-4 h-4 text-[#E6DED1]" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#FDFBF7] font-mono tracking-tight">
              {formatINR(savings)}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-[#E6DED1]/80 font-medium">Multi-year rollovers</p>
              <span className="text-xs text-[#BC8A5F] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Report <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
