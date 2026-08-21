import express from 'express';
import {
  getFinancialState,
  getCategoryReport,
  getSavingsReport,
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/state', getFinancialState);
router.get('/categories', getCategoryReport);
router.get('/savings', getSavingsReport);

export default router;
