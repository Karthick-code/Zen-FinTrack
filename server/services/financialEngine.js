import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';

/**
 * Calculates financial summaries and current financial state for a user from MongoDB.
 */
export async function calculateFinancialState(userId, targetPeriod) {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const rawTransactions = await Transaction.find({ userId: objectUserId }).sort({ transactionDate: 1, createdAt: 1 }).lean();

  // 1. Group transactions and calculate corrections
  // Map of referenceId -> sum of corrections
  const correctionMap = new Map();
  rawTransactions.forEach((tx) => {
    if (tx.type === 'CORRECTION' && tx.referenceTransactionId) {
      const refId = tx.referenceTransactionId.toString();
      const current = correctionMap.get(refId) || 0;
      correctionMap.set(refId, current + tx.amount);
    }
  });

  // Attach effective amounts to each transaction
  const enrichedTransactions = rawTransactions.map((tx) => {
    const idStr = tx._id.toString();
    const isOriginal = tx.type !== 'CORRECTION';
    const hasCorrection = correctionMap.has(idStr);
    const adjustment = correctionMap.get(idStr) || 0;
    const effectiveOriginalAmount = isOriginal ? tx.amount + adjustment : undefined;

    return {
      ...tx,
      _id: idStr,
      userId: tx.userId.toString(),
      referenceTransactionId: tx.referenceTransactionId ? tx.referenceTransactionId.toString() : undefined,
      isCorrected: hasCorrection,
      effectiveOriginalAmount,
    };
  });

  // 2. Identify all distinct periods (YYYY-MM) in ascending chronological order
  const periodSet = new Set();
  const now = new Date();
  const currentActualPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  periodSet.add(currentActualPeriod);

  if (targetPeriod) {
    periodSet.add(targetPeriod);
  }

  enrichedTransactions.forEach((tx) => {
    if (tx.transactionDate && tx.transactionDate.length >= 7) {
      const period = tx.transactionDate.substring(0, 7);
      periodSet.add(period);
    }
  });

  const sortedPeriods = Array.from(periodSet).sort();

  // 3. Calculate chronological monthly summaries and cumulative savings rollover
  let accumulatedSavings = 0;
  const monthlySummaries = [];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  for (let i = 0; i < sortedPeriods.length; i++) {
    const period = sortedPeriods[i];
    const [yStr, mStr] = period.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const monthName = MONTH_NAMES[month - 1] || period;

    const periodTransactions = enrichedTransactions.filter(
      (tx) => tx.transactionDate && tx.transactionDate.startsWith(period)
    );

    let totalIncome = 0;
    let totalExpense = 0;
    let netCorrectionIncome = 0;
    let netCorrectionExpense = 0;

    periodTransactions.forEach((tx) => {
      if (tx.type === 'INCOME') {
        totalIncome += tx.amount;
      } else if (tx.type === 'EXPENSE') {
        totalExpense += tx.amount;
      } else if (tx.type === 'CORRECTION') {
        // Find reference transaction
        const ref = enrichedTransactions.find((r) => r._id === tx.referenceTransactionId);
        if (ref && ref.type === 'INCOME') {
          netCorrectionIncome += tx.amount;
        } else {
          netCorrectionExpense += tx.amount;
        }
      }
    });

    const effectiveIncome = Math.max(0, totalIncome + netCorrectionIncome);
    const effectiveExpense = Math.max(0, totalExpense + netCorrectionExpense);
    const remainingBalance = effectiveIncome - effectiveExpense;

    const isDeficit = remainingBalance < 0;
    const deficitAmount = isDeficit ? Math.abs(remainingBalance) : 0;

    // Rollover logic: positive unspent balance rolls to accumulated savings;
    // deficit subtracts from savings
    let rolledToSavings = 0;
    if (remainingBalance > 0) {
      rolledToSavings = remainingBalance;
      accumulatedSavings += rolledToSavings;
    } else if (remainingBalance < 0) {
      accumulatedSavings = Math.max(0, accumulatedSavings - deficitAmount);
    }

    monthlySummaries.push({
      period,
      year,
      month,
      monthName,
      totalIncome,
      totalExpense,
      netCorrectionIncome,
      netCorrectionExpense,
      effectiveIncome,
      effectiveExpense,
      remainingBalance,
      isDeficit,
      deficitAmount,
      rolledToSavings,
      accumulatedSavings,
    });
  }

  // Active period
  const activePeriod = targetPeriod || currentActualPeriod;
  const currentSummary = monthlySummaries.find((s) => s.period === activePeriod) || {
    period: activePeriod,
    year: parseInt(activePeriod.split('-')[0], 10),
    month: parseInt(activePeriod.split('-')[1], 10),
    monthName: MONTH_NAMES[parseInt(activePeriod.split('-')[1], 10) - 1] || activePeriod,
    totalIncome: 0,
    totalExpense: 0,
    netCorrectionIncome: 0,
    netCorrectionExpense: 0,
    effectiveIncome: 0,
    effectiveExpense: 0,
    remainingBalance: 0,
    isDeficit: false,
    deficitAmount: 0,
    rolledToSavings: 0,
    accumulatedSavings,
  };

  return {
    userId,
    currentIncome: currentSummary.effectiveIncome,
    remainingBalance: currentSummary.remainingBalance,
    savings: accumulatedSavings,
    currentPeriod: activePeriod,
    updatedAt: new Date().toISOString(),
    monthlySummaries,
  };
}

/**
 * Calculates category breakdown for an active period
 */
export async function getCategoryBreakdown(userId, period) {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const query = {
    userId: objectUserId,
    type: 'EXPENSE',
  };

  if (period) {
    query.transactionDate = { $regex: `^${period}` };
  }

  const expenses = await Transaction.find(query).lean();
  const corrections = await Transaction.find({
    userId: objectUserId,
    type: 'CORRECTION',
    ...(period ? { transactionDate: { $regex: `^${period}` } } : {}),
  }).lean();

  const correctionMap = new Map();
  corrections.forEach((c) => {
    if (c.referenceTransactionId) {
      const refId = c.referenceTransactionId.toString();
      correctionMap.set(refId, (correctionMap.get(refId) || 0) + c.amount);
    }
  });

  const categoryMap = new Map();
  let totalSpent = 0;

  expenses.forEach((tx) => {
    const adj = correctionMap.get(tx._id.toString()) || 0;
    const effectiveAmount = Math.max(0, tx.amount + adj);
    totalSpent += effectiveAmount;

    const existing = categoryMap.get(tx.category) || {
      category: tx.category,
      amount: 0,
      transactionCount: 0,
    };

    categoryMap.set(tx.category, {
      category: tx.category,
      amount: existing.amount + effectiveAmount,
      transactionCount: existing.transactionCount + 1,
    });
  });

  const breakdown = Array.from(categoryMap.values()).map((item) => ({
    ...item,
    percentage: totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100 * 10) / 10 : 0,
  }));

  breakdown.sort((a, b) => b.amount - a.amount);
  return breakdown;
}
