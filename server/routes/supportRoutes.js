import express from 'express';
import {
  getTickets,
  getTicketDetails,
  createTicket,
  replyToTicket,
  updateTicketStatus,
} from '../controllers/supportController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketDetails);
router.post('/tickets', createTicket);
router.post('/tickets/:id/reply', replyToTicket);
router.patch('/tickets/:id/status', updateTicketStatus);

export default router;
