import React, { useState } from 'react';
import { User, Trash2, ShieldCheck, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

export const AdminUserManagement = ({
  users,
  onDeleteUser,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await onDeleteUser(selectedUser.id || selectedUser._id);
      setNotification(`User account ${selectedUser.name} (${selectedUser.email}) successfully deleted from MongoDB.`);
      setSelectedUser(null);
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#353531]">
      {/* Privacy Guarantee Banner */}
      <div className="p-4 bg-white border border-[#EBE7E0] rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#434C3E] shrink-0 mt-0.5" />
        <div className="text-xs text-[#7A756D]">
          <p className="font-serif font-bold text-[#353531] text-sm">Zen FinTrack Admin Data Isolation</p>
          <p className="mt-0.5 leading-relaxed">
            In accordance with Zen FinTrack financial privacy architecture, administrators manage user account access and
            support requests only. You cannot view user income, expenses, transactions, savings, or financial reports.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-[#434C3E]/10 border border-[#434C3E]/30 text-[#434C3E] rounded-xl text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#EBE7E0] bg-white shadow-sm">
        <table className="w-full text-left text-sm text-[#353531]">
          <thead className="bg-[#F7F4EE] text-xs uppercase tracking-wider text-[#7A756D] border-b border-[#EBE7E0]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">User</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold">Account Status</th>
              <th className="py-3.5 px-4 font-semibold">Joined Date</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE7E0]/70">
            {users.map((u) => {
              const isAdmin = u.role === 'ADMIN';

              return (
                <tr key={u.id || u._id} className="hover:bg-[#FDFBF7] transition-colors">
                  {/* Name & Email */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#353531]">{u.name}</div>
                    <div className="text-xs text-[#7A756D] font-mono mt-0.5">{u.email}</div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {isAdmin ? (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#BC8A5F]/15 text-[#8C5D33] border border-[#BC8A5F]/30">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F7F4EE] text-[#7A756D] border border-[#EBE7E0]">
                        USER
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#434C3E]">
                      <span className="w-2 h-2 rounded-full bg-[#434C3E]"></span>
                      {u.status || 'Active'}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#7A756D]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A5A096]" />
                      {u.createdAt ? formatDate(u.createdAt.split('T')[0]) : '—'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    {!isAdmin ? (
                      <button
                        onClick={() => setSelectedUser(u)}
                        title="Delete user account"
                        className="px-3 py-1.5 text-xs font-semibold text-[#BC5F4F] hover:text-[#A04535] hover:bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Account
                      </button>
                    ) : (
                      <span className="text-xs text-[#A5A096] italic">Protected Master</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#353531]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#EBE7E0] rounded-2xl max-w-md w-full p-6 shadow-xl text-[#353531] relative">
            <div className="flex items-center space-x-3 text-[#BC5F4F]">
              <div className="w-10 h-10 rounded-xl bg-[#BC5F4F]/15 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#353531]">Delete User Account?</h3>
                <p className="text-xs text-[#7A756D]">This action is permanent and irreversible</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#7A756D] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#353531]">{selectedUser.name}</strong> (
              {selectedUser.email})? All associated MongoDB data and support records will be removed.
            </p>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-[#7A756D] hover:text-[#353531] rounded-xl hover:bg-[#F7F4EE] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#BC5F4F] hover:bg-[#A04535] text-white font-semibold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
