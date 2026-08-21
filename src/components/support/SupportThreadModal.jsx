import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  LifeBuoy,
  User,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters.js';

export const SupportThreadModal = ({
  isOpen,
  onClose,
  ticket,
  messages,
  currentRole,
  onSendReply,
  onUpdateStatus,
}) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen || !ticket) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      await onSendReply(ticket._id || ticket.id, replyText.trim());
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-xl text-[#353531] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE7E0] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#353531]">{ticket.subject}</h3>
                {getStatusBadge(ticket.status)}
              </div>
              <p className="text-xs text-[#7A756D]">
                Ticket #{String(ticket._id || ticket.id).substring(0, 10)} • {ticket.userName || 'User'} ({ticket.userEmail || ''})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status Control Actions */}
            {ticket.status === 'RESOLVED' ? (
              <button
                onClick={() => onUpdateStatus(ticket._id || ticket.id, 'OPEN')}
                className="px-2.5 py-1 text-xs font-semibold bg-[#F7F4EE] hover:bg-[#EBE7E0] text-[#353531] rounded-lg flex items-center gap-1 transition-colors"
                title="Reopen ticket"
              >
                <RotateCcw className="w-3 h-3" /> Reopen
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(ticket._id || ticket.id, 'RESOLVED')}
                className="px-2.5 py-1 text-xs font-semibold bg-[#434C3E]/10 hover:bg-[#434C3E]/20 text-[#434C3E] border border-[#434C3E]/20 rounded-lg flex items-center gap-1 transition-colors"
                title="Mark ticket as resolved"
              >
                <CheckCircle className="w-3 h-3" /> Mark Resolved
              </button>
            )}

            <button
              onClick={onClose}
              className="text-[#7A756D] hover:text-[#353531] p-1.5 rounded-lg hover:bg-[#F7F4EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FDFBF7]">
          {messages.map((msg) => {
            const isAdminSender = msg.senderRole === 'ADMIN';

            return (
              <div
                key={msg._id || msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  (currentRole === 'USER' && !isAdminSender) || (currentRole === 'ADMIN' && isAdminSender)
                    ? 'ml-auto flex-row-reverse'
                    : 'mr-auto'
                }`}
              >
                {/* Sender Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAdminSender
                      ? 'bg-[#BC8A5F]/20 text-[#8C5D33] border border-[#BC8A5F]/30'
                      : 'bg-[#434C3E]/15 text-[#434C3E] border border-[#434C3E]/30'
                  }`}
                >
                  {isAdminSender ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    isAdminSender
                      ? 'bg-white border border-[#BC8A5F]/30 text-[#353531]'
                      : 'bg-white border border-[#EBE7E0] text-[#353531]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-[#7A756D]">
                    <span className="font-semibold text-[#353531] flex items-center gap-1">
                      {msg.senderName}
                      {isAdminSender && (
                        <span className="px-1.5 py-0.2 rounded bg-[#BC8A5F]/15 text-[#8C5D33] text-[10px] font-bold">
                          Admin
                        </span>
                      )}
                    </span>
                    <span>{formatDateTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-[#EBE7E0] bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder={
                ticket.status === 'RESOLVED'
                  ? 'Ticket is marked as resolved. Send a message to reopen.'
                  : 'Type your message...'
              }
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-4 py-2.5 text-sm text-[#353531] placeholder-[#A5A096] focus:outline-none focus:border-[#434C3E]"
            />
            <button
              type="submit"
              disabled={!replyText.trim() || sending}
              className="px-4 py-2.5 bg-[#BC8A5F] hover:bg-[#A87950] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
