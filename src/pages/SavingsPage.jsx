import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { reportApi } from '../services/api.js';
import { formatINR, getMonthName } from '../utils/formatters.js';

export const SavingsPage = () => {
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSavings() {
      setLoading(true);
      try {
        const res = await reportApi.getSavingsReport();
        setSavingsData(res);
      } catch (err) {
        setError(err.message || 'Failed to fetch savings data');
      } finally {
        setLoading(false);
      }
    }
    fetchSavings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#434C3E] border-t-transparent"></div>
      </div>
    );
  }

  const timeline = savingsData?.timeline || [];
  const totalAccumulatedSavings = savingsData?.totalAccumulatedSavings || 0;
  const currentRemainingBalance = savingsData?.currentRemainingBalance || 0;

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Header */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Savings & Rollover Growth
            </h1>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Automatic surplus accumulation across monthly periods stored in MongoDB.
          </p>
        </div>

        <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#EBE7E0] text-xs text-[#7A756D] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#434C3E]" />
          <span>Zero Fees • Isolated Storage • Automated Rollover</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Savings Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Total Cumulative Savings
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif font-bold text-[#8C5D33] font-mono">
              {formatINR(totalAccumulatedSavings)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1">
              Sum of all unspent surplus from completed monthly cycles
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
              Current Cycle Unspent Balance
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-serif font-bold text-[#434C3E] font-mono">
              {formatINR(currentRemainingBalance)}
            </div>
            <p className="text-xs text-[#7A756D] mt-1">
              Will automatically roll into your savings pool at month close
            </p>
          </div>
        </div>
      </div>

      {/* Month-by-Month Rollover Timeline */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#353531]">Monthly Rollover Breakdown</h3>
          <p className="text-xs text-[#7A756D]">
            Chronological audit of how each month's surplus was transferred to your cumulative savings.
          </p>
        </div>

        {timeline.length === 0 ? (
          <div className="p-8 text-center bg-[#FDFBF7] rounded-xl border border-[#EBE7E0]">
            <p className="text-sm text-[#7A756D]">No monthly periods recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#EBE7E0]">
            <table className="w-full text-left text-sm text-[#353531]">
              <thead className="bg-[#F7F4EE] text-xs uppercase tracking-wider text-[#7A756D] border-b border-[#EBE7E0]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Income</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Expenses</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Monthly Net</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Rolled to Savings</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Cumulative Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7E0]/70">
                {timeline.map((row) => (
                  <tr key={row.period} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#353531] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A5A096]" />
                        {getMonthName(row.month)} {row.year}
                      </div>
                      <span className="text-xs text-[#7A756D] font-mono">{row.period}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-semibold text-[#434C3E]">
                      +{formatINR(row.monthlyIncome)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-semibold text-[#BC5F4F]">
                      -{formatINR(row.monthlyExpense)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-semibold">
                      <span className={row.monthlyRemaining >= 0 ? 'text-[#353531]' : 'text-[#BC5F4F]'}>
                        {formatINR(row.monthlyRemaining)}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-semibold">
                      {row.rolledToSavings > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-[#434C3E]/10 text-[#434C3E] text-xs">
                          +{formatINR(row.rolledToSavings)}
                        </span>
                      ) : row.hasDeficit ? (
                        <span className="px-2 py-0.5 rounded bg-[#BC5F4F]/10 text-[#BC5F4F] text-xs">
                          -{formatINR(row.deficitAmount)}
                        </span>
                      ) : (
                        <span className="text-[#A5A096] text-xs">₹0</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-bold text-[#8C5D33]">
                      {formatINR(row.accumulatedSavings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
