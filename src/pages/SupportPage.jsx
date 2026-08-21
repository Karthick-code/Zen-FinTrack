import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  PlusCircle,
  Clock,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { supportApi } from '../services/api.js';
import { formatDate } from '../utils/formatters.js';

export const SupportPage = ({
  onOpenNewTicketModal,
  onOpenTicketThread,
}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportApi.getTickets();
      setTickets(res.tickets);
    } catch (err) {
      setError(err.message || 'Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#434C3E]/15 text-[#434C3E] border border-[#434C3E]/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#434C3E]/10 text-[#434C3E] border border-[#434C3E]/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Header */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Support & Helpdesk
            </h1>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Ask questions directly to the administrator. Zero access to your financial data.
          </p>
        </div>

        <button
          onClick={onOpenNewTicketModal}
          className="bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          New Support Request
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-white border border-[#EBE7E0] rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#434C3E] shrink-0 mt-0.5" />
        <div className="text-xs text-[#7A756D]">
          <p className="font-serif font-bold text-[#353531] text-sm">Strict Data Privacy</p>
          <p className="mt-0.5 leading-relaxed">
            The administrator can only reply to the text messages you post in this ticket thread. Your financial ledger,
            salary, expenses, savings amount, and account balances remain strictly private and inaccessible.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-[#EBE7E0]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#434C3E] border-t-transparent"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE7E0] shadow-sm">
          <LifeBuoy className="w-12 h-12 mx-auto text-[#A5A096] mb-3" />
          <h4 className="font-serif font-bold text-base text-[#353531]">No support inquiries yet</h4>
          <p className="text-[#7A756D] text-sm mt-1 max-w-sm mx-auto">
            Have a question about rollover rules or using the system? Create your first support request.
          </p>
          <button
            onClick={onOpenNewTicketModal}
            className="mt-4 px-4 py-2 bg-[#434C3E] hover:bg-[#363E32] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            Create Request
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#EBE7E0] bg-white shadow-sm">
          <table className="w-full text-left text-sm text-[#353531]">
            <thead className="bg-[#F7F4EE] text-xs uppercase tracking-wider text-[#7A756D] border-b border-[#EBE7E0]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Subject & Preview</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Messages</th>
                <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7E0]/70">
              {tickets.map((ticket) => (
                <tr key={ticket._id || ticket.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#353531]">{ticket.subject}</div>
                    {ticket.lastMessage && (
                      <p className="text-xs text-[#7A756D] truncate max-w-md mt-0.5">
                        {ticket.lastMessage}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#353531]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#A5A096]" />
                      {ticket.messageCount || 1}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D]">
                    {ticket.updatedAt ? formatDate(ticket.updatedAt.split('T')[0]) : '—'}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenTicketThread(ticket)}
                      className="px-3.5 py-1.5 bg-[#434C3E] hover:bg-[#363E32] text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                    >
                      Open Conversation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
