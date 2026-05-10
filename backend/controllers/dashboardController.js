const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).populate('category', 'name');
    
    // Calculate total income, expenses, and balance
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
      }
    });

    const currentBalance = totalIncome - totalExpenses;

    // Calculate expense distribution by category
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const catName = t.category ? t.category.name : 'Uncategorized';
      if (!expensesByCategory[catName]) {
        expensesByCategory[catName] = 0;
      }
      expensesByCategory[catName] += t.amount;
    });

    // Monthly income vs expenses (last 6 months)
    const monthlyData = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const recentTransactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: sixMonthsAgo }
    });

    recentTransactions.forEach(t => {
      const month = t.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, name: month };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    // Recent 5 transactions
    const recentTxns = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Budget usage overall
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        currentBalance,
        monthlyExpenses
      },
      expenseDistribution: Object.keys(expensesByCategory).map(key => ({ name: key, value: expensesByCategory[key] })),
      monthlyData: Object.values(monthlyData),
      recentTransactions: recentTxns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardSummary };
