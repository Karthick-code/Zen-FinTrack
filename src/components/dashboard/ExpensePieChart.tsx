import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CategoryBreakdown } from '../../types';
import { formatINR } from '../../utils/formatters';

interface ExpensePieChartProps {
  breakdown: CategoryBreakdown[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#BC5F4F',
  Transport: '#BC8A5F',
  Shopping: '#8C5D33',
  Bills: '#434C3E',
  Entertainment: '#D4A373',
  Health: '#A85A48',
  Education: '#5C6B57',
  Travel: '#9B7E5C',
  Subscriptions: '#7A8C74',
  Other: '#A5A096',
};

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ breakdown }) => {
  const validData = breakdown.filter((item) => item.amount > 0);

  if (validData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[#7A756D] text-sm">
        <p>No expenses recorded in this period yet.</p>
      </div>
    );
  }

  const chartData = validData.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: CATEGORY_COLORS[item.category] || '#A5A096',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#353531] border border-[#434C3E] p-3 rounded-xl shadow-xl text-xs text-[#FDFBF7]">
          <p className="font-semibold text-[#FDFBF7]">{data.name}</p>
          <p className="text-[#BC8A5F] font-bold mt-0.5 font-mono">{formatINR(data.value)}</p>
          <p className="text-[#E6DED1] text-[11px] mt-0.5">{data.percentage}% of total expenses</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FDFBF7" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-[#353531] font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
