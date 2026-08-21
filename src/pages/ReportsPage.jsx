import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { reportApi } from '../services/api.js';
import { formatINR, getMonthName } from '../utils/formatters.js';

export const ReportsPage = () => {
  const [breakdown, setBreakdown] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getCategoryReport(selectedPeriod);
      setBreakdown(res.breakdown);
    } catch (err) {
      setError(err.message || 'Failed to fetch category report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const totalSpent = breakdown.reduce((sum, item) => sum + item.amount, 0);

  // Natural Tones palette for category bars
  const PALETTE = [
    '#434C3E', // Forest Slate
    '#BC8A5F', // Warm Camel
    '#BC5F4F', // Terracotta
    '#8C5D33', // Deep Umber
    '#6B7A64', // Sage Olive
    '#A5A096', // Sand Stone
    '#7A756D', // Muted Clay
    '#9E7B5C', // Raw Ochre
  ];

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Header */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Category Breakdown
            </h1>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Analyze your spending allocation across expense categories.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3 py-1.5">
          <Calendar className="w-4 h-4 text-[#7A756D]" />
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#353531] focus:outline-none"
          />
          {selectedPeriod && (
            <button
              onClick={() => setSelectedPeriod('')}
              className="text-xs text-[#BC8A5F] hover:underline ml-1"
            >
              All Time
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
            Total Expense Outflow ({selectedPeriod ? getMonthName(selectedPeriod) : 'All Time'})
          </span>
          <div className="text-2xl font-serif font-bold text-[#BC5F4F] font-mono mt-2">
            {formatINR(totalSpent)}
          </div>
          <p className="text-xs text-[#7A756D] mt-1">Net of all linked mistake corrections</p>
        </div>

        <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
            Active Categories
          </span>
          <div className="text-2xl font-serif font-bold text-[#353531] font-mono mt-2">
            {breakdown.length}
          </div>
          <p className="text-xs text-[#7A756D] mt-1">Different spending buckets recorded</p>
        </div>
      </div>

      {/* Visual Category Distribution */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#353531] flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#434C3E]" />
            Expense Distribution & Proportions
          </h3>
          <span className="text-xs text-[#7A756D] font-mono">100% Normalized</span>
        </div>

        {/* Proportional Multi-Segment Bar */}
        {totalSpent > 0 && (
          <div className="h-5 w-full rounded-xl overflow-hidden flex shadow-inner bg-[#EBE7E0]">
            {breakdown.map((item, idx) => (
              <div
                key={item.category}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: PALETTE[idx % PALETTE.length],
                }}
                title={`${item.category}: ${formatINR(item.amount)} (${item.percentage}%)`}
                className="h-full transition-all hover:opacity-80"
              />
            ))}
          </div>
        )}

        {/* Category Breakdown Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#434C3E] border-t-transparent"></div>
          </div>
        ) : breakdown.length === 0 ? (
          <div className="p-8 text-center bg-[#FDFBF7] rounded-xl border border-[#EBE7E0]">
            <p className="text-sm text-[#7A756D]">No expense records found for this selected period.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE7E0]/70">
            {breakdown.map((item, idx) => {
              const color = PALETTE[idx % PALETTE.length];

              return (
                <div key={item.category} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="font-semibold text-sm text-[#353531]">{item.category}</div>
                      <div className="text-xs text-[#7A756D]">{item.transactionCount} transaction{item.transactionCount > 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  <div className="flex items-center sm:space-x-6 justify-between sm:justify-end">
                    {/* Visual Progress Bar */}
                    <div className="w-28 sm:w-44 bg-[#EBE7E0] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    {/* Percentage & Amount */}
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#353531] font-mono">
                        {formatINR(item.amount)}
                      </div>
                      <div className="text-xs text-[#7A756D] font-mono">{item.percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
