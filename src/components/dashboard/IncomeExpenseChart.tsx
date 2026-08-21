import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyFinancialSummary } from '../../types';
import { formatINR } from '../../utils/formatters';

interface IncomeExpenseChartProps {
  summaries: MonthlyFinancialSummary[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ summaries }) => {
  if (summaries.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[#7A756D] text-sm">
        <p>No historical monthly data available yet.</p>
      </div>
    );
  }

  const chartData = summaries.map((s) => ({
    period: `${s.monthName.substring(0, 3)} ${s.year}`,
    Income: s.effectiveIncome,
    Expenses: s.effectiveExpense,
    Balance: s.remainingBalance,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#353531] border border-[#434C3E] p-3 rounded-xl shadow-xl text-xs space-y-1 text-[#FDFBF7]">
          <p className="font-semibold text-[#FDFBF7] border-b border-white/10 pb-1">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between space-x-4">
              <span className="text-[#E6DED1] capitalize">{item.name}:</span>
              <span className="font-bold text-[#FDFBF7] font-mono">{formatINR(item.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EBE7E0" vertical={false} />
          <XAxis dataKey="period" stroke="#7A756D" tick={{ fill: '#7A756D', fontSize: 11 }} />
          <YAxis
            stroke="#7A756D"
            tick={{ fill: '#7A756D', fontSize: 11 }}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span className="text-xs text-[#353531] font-medium">{value}</span>}
          />
          <Bar dataKey="Income" fill="#434C3E" radius={[6, 6, 0, 0]} maxBarSize={36} />
          <Bar dataKey="Expenses" fill="#BC5F4F" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
