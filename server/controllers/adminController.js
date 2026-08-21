import { User } from '../models/User.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { SupportMessage } from '../models/SupportMessage.js';
import { Transaction } from '../models/Transaction.js';

export async function getStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'OPEN' });
    const inProgressTickets = await SupportTicket.countDocuments({ status: 'IN_PROGRESS' });
    const resolvedTickets = await SupportTicket.countDocuments({ status: 'RESOLVED' });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
      },
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ error: 'Internal server error fetching admin stats.' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
    const formatted = users.map((u) => ({
      ...u,
      id: u._id.toString(),
    }));

    res.json({ users: formatted });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ error: 'Internal server error fetching users.' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot delete a protected administrator account.' });
    }

    // Cascade delete associated transactions, tickets and messages
    await Transaction.deleteMany({ userId: targetUser._id });
    const userTickets = await SupportTicket.find({ userId: targetUser._id }).lean();
    const ticketIds = userTickets.map((t) => t._id);
    await SupportMessage.deleteMany({ ticketId: { $in: ticketIds } });
    await SupportTicket.deleteMany({ userId: targetUser._id });
    await User.findByIdAndDelete(id);

    res.json({
      message: 'User account and associated support data deleted successfully.',
      deletedUserId: id,
    });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Internal server error deleting user.' });
  }
}
