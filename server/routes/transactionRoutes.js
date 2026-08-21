import express from 'express';
import {
  getTransactions,
  createTransaction,
  reportMistake,
  updateMetadata,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/correct', reportMistake);
router.patch('/:id/metadata', updateMetadata);

export default router;
