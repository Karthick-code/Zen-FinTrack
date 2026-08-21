import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';
import { calculateFinancialState } from '../services/financialEngine.js';

export async function getTransactions(req, res) {
  try {
    const userId = req.user.userId;
    const { search, type, category, period, startDate, endDate } = req.query;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (period) {
      query.transactionDate = { $regex: `^${period}` };
    } else if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = startDate;
      if (endDate) query.transactionDate.$lte = endDate;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(query)
      .sort({ transactionDate: -1, createdAt: -1 })
      .lean();

    // Map corrections to calculate effective amounts
    const allUserCorrections = await Transaction.find({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'CORRECTION',
    }).lean();

    const correctionMap = new Map();
    allUserCorrections.forEach((c) => {
      if (c.referenceTransactionId) {
        const refId = c.referenceTransactionId.toString();
        correctionMap.set(refId, (correctionMap.get(refId) || 0) + c.amount);
      }
    });

    const enriched = transactions.map((t) => {
      const idStr = t._id.toString();
      const isOriginal = t.type !== 'CORRECTION';
      const adj = correctionMap.get(idStr) || 0;
      const effectiveOriginalAmount = isOriginal ? t.amount + adj : undefined;

      return {
        ...t,
        _id: idStr,
        userId: t.userId.toString(),
        referenceTransactionId: t.referenceTransactionId ? t.referenceTransactionId.toString() : undefined,
        isCorrected: correctionMap.has(idStr),
        effectiveOriginalAmount,
      };
    });

    res.json({
      transactions: enriched,
      count: enriched.length,
    });
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ error: 'Internal server error fetching transactions.' });
  }
}

export async function createTransaction(req, res) {
  try {
    const userId = req.user.userId;
    const { type, amount, title, description, category, transactionDate } = req.body;

    if (!type || !amount || !title || !category || !transactionDate) {
      return res.status(400).json({ error: 'Type, amount, title, category, and date are required.' });
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either INCOME or EXPENSE.' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const newTx = await Transaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      amount: numAmount,
      title: title.trim(),
      description: (description || '').trim(),
      category: category.trim(),
      transactionDate,
    });

    // Recalculate financial state
    const period = transactionDate.substring(0, 7);
    const financials = await calculateFinancialState(userId, period);

    res.status(201).json({
      message: `${type === 'INCOME' ? 'Income' : 'Expense'} recorded successfully in MongoDB ledger.`,
      transaction: {
        ...newTx.toJSON(),
        effectiveOriginalAmount: newTx.amount,
        isCorrected: false,
      },
      financials,
    });
  } catch (err) {
    console.error('createTransaction error:', err);
    res.status(500).json({ error: 'Internal server error creating transaction.' });
  }
}

export async function reportMistake(req, res) {
  try {
    const userId = req.user.userId;
    const { referenceTransactionId, correctAmount, reason } = req.body;

    if (!referenceTransactionId || correctAmount === undefined || correctAmount === null) {
      return res.status(400).json({ error: 'Reference transaction ID and correct amount are required.' });
    }

    const numCorrectAmount = Number(correctAmount);
    if (isNaN(numCorrectAmount) || numCorrectAmount < 0) {
      return res.status(400).json({ error: 'Correct amount must be a non-negative number.' });
    }

    // Find the original transaction
    const original = await Transaction.findOne({
      _id: new mongoose.Types.ObjectId(referenceTransactionId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!original) {
      return res.status(404).json({ error: 'Reference transaction not found.' });
    }

    if (original.type === 'CORRECTION') {
      return res.status(400).json({ error: 'Cannot create a correction on an existing correction entry.' });
    }

    // Find all existing corrections for this transaction to compute current effective amount
    const priorCorrections = await Transaction.find({
      userId: new mongoose.Types.ObjectId(userId),
      referenceTransactionId: original._id,
    });

    const sumPriorCorrections = priorCorrections.reduce((sum, c) => sum + c.amount, 0);
    const currentEffectiveAmount = original.amount + sumPriorCorrections;

    const difference = numCorrectAmount - currentEffectiveAmount;
    if (difference === 0) {
      return res.status(400).json({ error: 'The entered amount is identical to the current effective amount. No adjustment needed.' });
    }

    // Create the CORRECTION record
    const reasonText = reason ? ` Reason: ${reason.trim()}` : '';
    const correctionTx = await Transaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'CORRECTION',
      amount: difference, // Can be positive or negative
      title: `Correction: ${original.title}`,
      description: `Target amount: ₹${numCorrectAmount} (Adjusted by ${difference >= 0 ? '+' : ''}₹${difference}).${reasonText}`,
      category: original.category,
      transactionDate: original.transactionDate,
      referenceTransactionId: original._id,
    });

    const period = original.transactionDate.substring(0, 7);
    const financials = await calculateFinancialState(userId, period);

    res.status(201).json({
      message: 'Correction entry logged and linked to original transaction in MongoDB.',
      correction: correctionTx.toJSON(),
      originalTransaction: original.toJSON(),
      effectiveAmount: numCorrectAmount,
      difference,
      financials,
    });
  } catch (err) {
    console.error('reportMistake error:', err);
    res.status(500).json({ error: 'Internal server error reporting mistake.' });
  }
}

export async function updateMetadata(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty.' });
    }

    const tx = await Transaction.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    tx.title = title.trim();
    if (description !== undefined) {
      tx.description = (description || '').trim();
    }

    await tx.save();

    res.json({
      message: 'Transaction details updated successfully.',
      transaction: tx.toJSON(),
    });
  } catch (err) {
    console.error('updateMetadata error:', err);
    res.status(500).json({ error: 'Internal server error updating metadata.' });
  }
}
