import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { TransactionsPage } from './pages/TransactionsPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { SavingsPage } from './pages/SavingsPage.jsx';
import { SupportPage } from './pages/SupportPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';

import { NewTransactionModal } from './components/transactions/NewTransactionModal.jsx';
import { CorrectionModal } from './components/transactions/CorrectionModal.jsx';
import { EditMetadataModal } from './components/transactions/EditMetadataModal.jsx';
import { NewTicketModal } from './components/support/NewTicketModal.jsx';
import { SupportThreadModal } from './components/support/SupportThreadModal.jsx';

import { transactionApi, supportApi } from './services/api.js';

export function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState(null);
  const [editMetadataTarget, setEditMetadataTarget] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // Active Support Thread Modal State
  const [activeThreadTicket, setActiveThreadTicket] = useState(null);
  const [activeThreadMessages, setActiveThreadMessages] = useState([]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#434C3E] text-[#FDFBF7] flex items-center justify-center text-2xl font-serif font-bold shadow-md">
            ₹
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#434C3E] border-t-transparent"></div>
          <p className="text-sm font-medium text-[#7A756D]">Collecting Tracks...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <AuthPage />;
  }

  const isAdmin = user.role === 'ADMIN';

  // Modal Handlers
  const handleRecordTransaction = async (data) => {
    await transactionApi.createTransaction(data);
  };

  const handleReportMistake = async (data) => {
    await transactionApi.reportMistake(data);
  };

  const handleEditMetadata = async (id, title, description) => {
    await transactionApi.updateMetadata(id, title, description);
  };

  const handleCreateTicket = async (subject, message) => {
    await supportApi.createTicket(subject, message);
  };

  const handleOpenTicketThread = async (ticket) => {
    try {
      const res = await supportApi.getTicketDetails(ticket._id || ticket.id);
      setActiveThreadTicket(res.ticket);
      setActiveThreadMessages(res.messages);
    } catch (err) {
      console.error('Failed to load ticket thread:', err);
    }
  };

  const handleSendReply = async (ticketId, message) => {
    const res = await supportApi.replyToTicket(ticketId, message);
    setActiveThreadMessages((prev) => [...prev, res.supportMessage]);
    if (res.ticket) {
      setActiveThreadTicket(res.ticket);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    const res = await supportApi.updateTicketStatus(ticketId, status);
    if (res.ticket) {
      setActiveThreadTicket(res.ticket);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#353531] flex flex-col font-sans selection:bg-[#BC8A5F]/20 selection:text-[#353531]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTxModal={!isAdmin ? () => setIsNewTxOpen(true) : undefined}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* User Views */}
        {!isAdmin && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage
                onOpenNewTxModal={() => setIsNewTxOpen(true)}
                onReportMistake={(tx) => setCorrectionTarget(tx)}
                onEditMetadata={(tx) => setEditMetadataTarget(tx)}
                onNavigateToTransactions={() => setActiveTab('transactions')}
                onNavigateToReports={() => setActiveTab('reports')}
                onNavigateToSavings={() => setActiveTab('savings')}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionsPage
                onOpenNewTxModal={() => setIsNewTxOpen(true)}
                onReportMistake={(tx) => setCorrectionTarget(tx)}
                onEditMetadata={(tx) => setEditMetadataTarget(tx)}
              />
            )}
            {activeTab === 'reports' && <ReportsPage />}
            {activeTab === 'savings' && <SavingsPage />}
            {activeTab === 'support' && (
              <SupportPage
                onOpenNewTicketModal={() => setIsNewTicketOpen(true)}
                onOpenTicketThread={handleOpenTicketThread}
              />
            )}
          </>
        )}

        {/* Master Admin Views */}
        {isAdmin && (
          <AdminDashboardPage
            activeSubTab={
              activeTab === 'admin-users'
                ? 'users'
                : activeTab === 'admin-support'
                ? 'support'
                : 'overview'
            }
            onOpenTicket={handleOpenTicketThread}
          />
        )}
      </main>

      {/* Transaction Creation Modal */}
      <NewTransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
        onSubmit={async (data) => {
          await handleRecordTransaction(data);
          // Refresh window/tab state naturally
          window.location.reload();
        }}
      />

      {/* Mistake Reporting & Correction Modal */}
      <CorrectionModal
        isOpen={!!correctionTarget}
        transaction={correctionTarget}
        onClose={() => setCorrectionTarget(null)}
        onSubmit={async (data) => {
          await handleReportMistake(data);
          window.location.reload();
        }}
      />

      {/* Title & Notes Edit Modal */}
      <EditMetadataModal
        isOpen={!!editMetadataTarget}
        transaction={editMetadataTarget}
        onClose={() => setEditMetadataTarget(null)}
        onSubmit={async (id, title, desc) => {
          await handleEditMetadata(id, title, desc);
          window.location.reload();
        }}
      />

      {/* New Support Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={async (subject, msg) => {
          await handleCreateTicket(subject, msg);
          window.location.reload();
        }}
      />

      {/* Support Thread Interactive Modal */}
      <SupportThreadModal
        isOpen={!!activeThreadTicket}
        ticket={activeThreadTicket}
        messages={activeThreadMessages}
        currentRole={user.role}
        onClose={() => setActiveThreadTicket(null)}
        onSendReply={handleSendReply}
        onUpdateStatus={handleUpdateTicketStatus}
      />
    </div>
  );
}

export default App;
