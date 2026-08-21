import React, { useState, useEffect } from 'react';
import {
  Users,
  LifeBuoy,
  ShieldCheck,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { adminApi, supportApi } from '../services/api.js';
import { AdminUserManagement } from '../components/admin/AdminUserManagement.jsx';
import { AdminSupportPanel } from '../components/admin/AdminSupportPanel.jsx';

export const AdminDashboardPage = ({
  activeSubTab = 'overview',
  onOpenTicket,
}) => {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentTab(activeSubTab);
  }, [activeSubTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ticketsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        supportApi.getTickets(),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users);
      setTickets(ticketsRes.tickets);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    await adminApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
    if (stats) {
      setStats({
        ...stats,
        totalUsers: Math.max(0, stats.totalUsers - 1),
        activeUsers: Math.max(0, stats.activeUsers - 1),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#434C3E] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Admin Header */}
      <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#353531]">
              Master Administrator Console
            </h1>
          </div>
          <p className="text-sm text-[#7A756D] mt-1">
            Manage registered user accounts and address support inquiries across the platform in MongoDB.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#FDFBF7] p-1 rounded-xl border border-[#EBE7E0]">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'overview'
                ? 'bg-[#434C3E] text-white shadow-sm'
                : 'text-[#7A756D] hover:text-[#353531]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'users'
                ? 'bg-[#434C3E] text-white shadow-sm'
                : 'text-[#7A756D] hover:text-[#353531]'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setCurrentTab('support')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'support'
                ? 'bg-[#434C3E] text-white shadow-sm'
                : 'text-[#7A756D] hover:text-[#353531]'
            }`}
          >
            Support ({tickets.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
                  Total Users
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-serif font-bold text-[#353531] font-mono">
                  {stats?.totalUsers || 0}
                </div>
                <p className="text-xs text-[#7A756D] mt-1">{stats?.activeUsers || 0} Active accounts</p>
              </div>
            </div>

            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
                  Open Tickets
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#BC8A5F]/15 text-[#8C5D33] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-serif font-bold text-[#8C5D33] font-mono">
                  {stats?.openTickets || 0}
                </div>
                <p className="text-xs text-[#7A756D] mt-1">Awaiting administrator response</p>
              </div>
            </div>

            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
                  In Progress
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#434C3E]/15 text-[#434C3E] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-serif font-bold text-[#434C3E] font-mono">
                  {stats?.inProgressTickets || 0}
                </div>
                <p className="text-xs text-[#7A756D] mt-1">Active user conversations</p>
              </div>
            </div>

            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">
                  Resolved
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-serif font-bold text-[#434C3E] font-mono">
                  {stats?.resolvedTickets || 0}
                </div>
                <p className="text-xs text-[#7A756D] mt-1">Successfully closed inquiries</p>
              </div>
            </div>
          </div>

          {/* Quick Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Users Preview */}
            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#353531] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#434C3E]" />
                  Registered Accounts
                </h3>
                <button
                  onClick={() => setCurrentTab('users')}
                  className="text-xs font-semibold text-[#434C3E] hover:underline"
                >
                  Manage All
                </button>
              </div>
              <div className="divide-y divide-[#EBE7E0]/70">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id || u._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-[#353531]">{u.name}</p>
                      <p className="text-xs text-[#7A756D] font-mono">{u.email}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F7F4EE] text-[#7A756D] border border-[#EBE7E0]">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tickets Preview */}
            <div className="bg-white border border-[#EBE7E0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#353531] flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-[#BC8A5F]" />
                  Recent Support Requests
                </h3>
                <button
                  onClick={() => setCurrentTab('support')}
                  className="text-xs font-semibold text-[#434C3E] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-[#EBE7E0]/70">
                {tickets.slice(0, 5).map((t) => (
                  <div
                    key={t._id || t.id}
                    onClick={() => onOpenTicket(t)}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-[#FDFBF7] rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#353531]">{t.subject}</p>
                      <p className="text-xs text-[#7A756D]">{t.userName || 'User'}</p>
                    </div>
                    <span className="text-xs font-bold text-[#8C5D33] bg-[#BC8A5F]/15 px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {currentTab === 'users' && (
        <AdminUserManagement users={users} onDeleteUser={handleDeleteUser} />
      )}

      {/* Support Tab */}
      {currentTab === 'support' && (
        <AdminSupportPanel tickets={tickets} onOpenTicket={onOpenTicket} />
      )}
    </div>
  );
};
