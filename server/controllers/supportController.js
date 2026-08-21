import mongoose from 'mongoose';
import { SupportTicket } from '../models/SupportTicket.js';
import { SupportMessage } from '../models/SupportMessage.js';
import { User } from '../models/User.js';

export async function getTickets(req, res) {
  try {
    const { userId, role } = req.user;
    const query = role === 'ADMIN' ? {} : { userId: new mongoose.Types.ObjectId(userId) };

    const tickets = await SupportTicket.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    // Attach user info and message count / last message
    const enrichedTickets = await Promise.all(
      tickets.map(async (t) => {
        const user = await User.findById(t.userId).lean();
        const lastMsg = await SupportMessage.findOne({ ticketId: t._id })
          .sort({ createdAt: -1 })
          .lean();
        const msgCount = await SupportMessage.countDocuments({ ticketId: t._id });

        return {
          ...t,
          _id: t._id.toString(),
          userId: t.userId.toString(),
          userName: user?.name || 'User',
          userEmail: user?.email || '',
          lastMessage: lastMsg?.message,
          messageCount: msgCount,
        };
      })
    );

    res.json({ tickets: enrichedTickets });
  } catch (err) {
    console.error('getTickets error:', err);
    res.status(500).json({ error: 'Internal server error fetching tickets.' });
  }
}

export async function getTicketDetails(req, res) {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const ticket = await SupportTicket.findById(id).lean();
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    if (role !== 'ADMIN' && ticket.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not have access to this ticket.' });
    }

    const user = await User.findById(ticket.userId).lean();
    const messages = await SupportMessage.find({ ticketId: new mongoose.Types.ObjectId(id) })
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map((m) => ({
      ...m,
      _id: m._id.toString(),
      ticketId: m.ticketId.toString(),
      senderId: m.senderId.toString(),
    }));

    res.json({
      ticket: {
        ...ticket,
        _id: ticket._id.toString(),
        userId: ticket.userId.toString(),
        userName: user?.name,
        userEmail: user?.email,
      },
      messages: formattedMessages,
    });
  } catch (err) {
    console.error('getTicketDetails error:', err);
    res.status(500).json({ error: 'Internal server error fetching ticket details.' });
  }
}

export async function createTicket(req, res) {
  try {
    const { userId, name, role } = req.user;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and initial message are required.' });
    }

    const newTicket = await SupportTicket.create({
      userId: new mongoose.Types.ObjectId(userId),
      subject: subject.trim(),
      status: 'OPEN',
    });

    const initialMsg = await SupportMessage.create({
      ticketId: newTicket._id,
      senderId: new mongoose.Types.ObjectId(userId),
      senderName: name || 'User',
      senderRole: role,
      message: message.trim(),
    });

    res.status(201).json({
      message: 'Support request created in MongoDB successfully.',
      ticket: {
        ...newTicket.toJSON(),
        userName: name,
      },
      initialMessage: initialMsg.toJSON(),
    });
  } catch (err) {
    console.error('createTicket error:', err);
    res.status(500).json({ error: 'Internal server error creating ticket.' });
  }
}

export async function replyToTicket(req, res) {
  try {
    const { id } = req.params;
    const { userId, name, role } = req.user;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    if (role !== 'ADMIN' && ticket.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not have access to this ticket.' });
    }

    const newMsg = await SupportMessage.create({
      ticketId: ticket._id,
      senderId: new mongoose.Types.ObjectId(userId),
      senderName: name || (role === 'ADMIN' ? 'Admin' : 'User'),
      senderRole: role,
      message: message.trim(),
    });

    // Update ticket status
    if (role === 'ADMIN' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    } else if (role === 'USER' && ticket.status === 'RESOLVED') {
      ticket.status = 'OPEN';
    }
    await ticket.save();

    const user = await User.findById(ticket.userId).lean();

    res.status(201).json({
      message: 'Reply sent successfully.',
      supportMessage: newMsg.toJSON(),
      ticket: {
        ...ticket.toJSON(),
        userName: user?.name,
        userEmail: user?.email,
      },
    });
  } catch (err) {
    console.error('replyToTicket error:', err);
    res.status(500).json({ error: 'Internal server error replying to ticket.' });
  }
}

export async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid ticket status.' });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    ticket.status = status;
    await ticket.save();

    const user = await User.findById(ticket.userId).lean();

    res.json({
      message: `Ticket status updated to ${status}.`,
      ticket: {
        ...ticket.toJSON(),
        userName: user?.name,
        userEmail: user?.email,
      },
    });
  } catch (err) {
    console.error('updateTicketStatus error:', err);
    res.status(500).json({ error: 'Internal server error updating ticket status.' });
  }
}
