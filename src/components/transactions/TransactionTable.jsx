import React from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Edit2,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters.js';

export const TransactionTable = ({
  transactions,
  onReportMistake,
  onEditMetadata,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE7E0] shadow-sm">
        <FileText className="w-12 h-12 mx-auto text-[#A5A096] mb-3" />
        <h4 className="text-[#353531] font-semibold text-base font-serif">No transactions found</h4>
        <p className="text-[#7A756D] text-sm mt-1 max-w-sm mx-auto">
          No records match your selected filters. Start by recording your income and expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#EBE7E0] bg-white shadow-sm">
      <table className="w-full text-left text-sm text-[#353531]">
        <thead className="bg-[#F7F4EE] text-xs uppercase tracking-wider text-[#7A756D] border-b border-[#EBE7E0]">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Date</th>
            <th className="py-3.5 px-4 font-semibold">Type</th>
            <th className="py-3.5 px-4 font-semibold">Title & Category</th>
            <th className="py-3.5 px-4 font-semibold">Details / Audit</th>
            <th className="py-3.5 px-4 font-semibold text-right">Recorded Amount</th>
            <th className="py-3.5 px-4 font-semibold text-right">Effective Net</th>
            <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EBE7E0]/70">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            const isExpense = tx.type === 'EXPENSE';
            const isCorrection = tx.type === 'CORRECTION';

            return (
              <tr
                key={tx._id || tx.id}
                className={`hover:bg-[#FDFBF7] transition-colors ${
                  isCorrection ? 'bg-[#BC8A5F]/5' : ''
                }`}
              >
                {/* Date */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D] font-medium">
                  {formatDate(tx.transactionDate)}
                </td>

                {/* Type Badge */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {isIncome && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#434C3E]/10 text-[#434C3E] border border-[#434C3E]/20">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Income
                    </span>
                  )}
                  {isExpense && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#BC5F4F]/10 text-[#BC5F4F] border border-[#BC5F4F]/20">
                      <ArrowDownLeft className="w-3.5 h-3.5" /> Expense
                    </span>
                  )}
                  {isCorrection && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30">
                      <AlertTriangle className="w-3.5 h-3.5" /> Correction
                    </span>
                  )}
                </td>

                {/* Title & Category */}
                <td className="py-4 px-4">
                  <div className="font-semibold text-[#353531]">{tx.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EBE7E0]/70 text-[#434C3E]">
                      {tx.category}
                    </span>
                    {tx.isCorrected && (
                      <span className="text-[11px] font-semibold text-[#8C5D33] flex items-center gap-0.5">
                        <LinkIcon className="w-3 h-3" /> Adjusted
                      </span>
                    )}
                  </div>
                </td>

                {/* Description & Audit Notes */}
                <td className="py-4 px-4 text-xs text-[#7A756D] max-w-xs truncate">
                  {isCorrection && tx.referenceTransactionId && (
                    <div className="text-[#8C5D33] font-mono text-[11px] mb-0.5 flex items-center gap-1">
                      <span>Ref: #{String(tx.referenceTransactionId).substring(0, 10)}</span>
                    </div>
                  )}
                  <span title={tx.description}>{tx.description || '—'}</span>
                </td>

                {/* Recorded Amount */}
                <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-semibold">
                  {isIncome && <span className="text-[#434C3E]">+{formatINR(tx.amount)}</span>}
                  {isExpense && <span className="text-[#BC5F4F]">-{formatINR(tx.amount)}</span>}
                  {isCorrection && (
                    <span className={tx.amount >= 0 ? 'text-[#8C5D33]' : 'text-[#BC5F4F]'}>
                      {tx.amount >= 0 ? `+${formatINR(tx.amount)}` : formatINR(tx.amount)}
                    </span>
                  )}
                </td>

                {/* Effective Net Amount (after all linked corrections) */}
                <td className="py-4 px-4 whitespace-nowrap text-right font-mono font-bold text-[#353531]">
                  {isCorrection ? (
                    <span className="text-[#A5A096] text-xs">Ledger Entry</span>
                  ) : (
                    <span>{formatINR(tx.effectiveOriginalAmount !== undefined ? tx.effectiveOriginalAmount : tx.amount)}</span>
                  )}
                </td>

                {/* Actions: No Delete / No Amount Edit */}
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  {!isCorrection ? (
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onReportMistake(tx)}
                        title="Report a mistake and create an audit correction"
                        className="px-2.5 py-1 text-xs font-semibold bg-[#BC8A5F]/15 hover:bg-[#BC8A5F]/25 text-[#8C5D33] border border-[#BC8A5F]/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Mistake
                      </button>
                      <button
                        onClick={() => onEditMetadata(tx)}
                        title="Edit title or notes"
                        className="p-1.5 text-[#7A756D] hover:text-[#353531] hover:bg-[#EBE7E0]/60 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#A5A096] font-medium italic">Immutable</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
