import { calculateFinancialState, getCategoryBreakdown } from '../services/financialEngine.js';

export async function getFinancialState(req, res) {
  try {
    const userId = req.user.userId;
    const { period } = req.query;

    const financials = await calculateFinancialState(userId, period);
    res.json({ financials });
  } catch (err) {
    console.error('getFinancialState error:', err);
    res.status(500).json({ error: 'Internal server error calculating financial state.' });
  }
}

export async function getCategoryReport(req, res) {
  try {
    const userId = req.user.userId;
    const { period } = req.query;

    const breakdown = await getCategoryBreakdown(userId, period);
    res.json({
      breakdown,
      period: period || 'all',
    });
  } catch (err) {
    console.error('getCategoryReport error:', err);
    res.status(500).json({ error: 'Internal server error fetching category report.' });
  }
}

export async function getSavingsReport(req, res) {
  try {
    const userId = req.user.userId;
    const financials = await calculateFinancialState(userId);

    const timeline = financials.monthlySummaries.map((s) => ({
      period: s.period,
      year: s.year,
      month: s.month,
      monthName: s.monthName,
      monthlyIncome: s.effectiveIncome,
      monthlyExpense: s.effectiveExpense,
      monthlyRemaining: s.remainingBalance,
      rolledToSavings: s.rolledToSavings,
      accumulatedSavings: s.accumulatedSavings,
      hasDeficit: s.isDeficit,
      deficitAmount: s.deficitAmount,
    }));

    res.json({
      totalAccumulatedSavings: financials.savings,
      currentRemainingBalance: financials.remainingBalance,
      currentIncome: financials.currentIncome,
      timeline,
    });
  } catch (err) {
    console.error('getSavingsReport error:', err);
    res.status(500).json({ error: 'Internal server error fetching savings report.' });
  }
}
