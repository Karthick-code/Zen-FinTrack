import React, { useState } from 'react';
import {
  LifeBuoy,
  Clock,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

export const AdminSupportPanel = ({
  tickets,
  onOpenTicket,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      (t.userName && t.userName.toLowerCase().includes(search.toLowerCase())) ||
      (t.userEmail && t.userEmail.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-4 text-[#353531]">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EBE7E0] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A096]" />
          <input
            type="text"
            placeholder="Search tickets by user, email or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl pl-9 pr-4 py-2 text-sm text-[#353531] placeholder-[#A5A096] focus:outline-none focus:border-[#434C3E]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#7A756D]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2 text-sm text-[#353531] font-medium focus:outline-none focus:border-[#434C3E]"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE7E0] shadow-sm">
          <LifeBuoy className="w-12 h-12 mx-auto text-[#A5A096] mb-3" />
          <h4 className="font-serif font-bold text-base text-[#353531]">No support tickets found</h4>
          <p className="text-[#7A756D] text-sm mt-1">All user inquiries have been addressed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#EBE7E0] bg-white shadow-sm">
          <table className="w-full text-left text-sm text-[#353531]">
            <thead className="bg-[#F7F4EE] text-xs uppercase tracking-wider text-[#7A756D] border-b border-[#EBE7E0]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Subject & Latest Message</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Messages</th>
                <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7E0]/70">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id || ticket.id} className="hover:bg-[#FDFBF7] transition-colors">
                  {/* User */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-semibold text-[#353531]">{ticket.userName || 'User'}</div>
                    <div className="text-xs text-[#7A756D] font-mono">{ticket.userEmail}</div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#353531]">{ticket.subject}</div>
                    {ticket.lastMessage && (
                      <p className="text-xs text-[#7A756D] truncate max-w-sm mt-0.5">{ticket.lastMessage}</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>

                  {/* Messages Count */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#353531]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#A5A096]" />
                      {ticket.messageCount || 1}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D]">
                    {ticket.updatedAt ? formatDate(ticket.updatedAt.split('T')[0]) : '—'}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenTicket(ticket)}
                      className="px-3.5 py-1.5 bg-[#BC8A5F] hover:bg-[#A87950] text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                    >
                      Respond
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
