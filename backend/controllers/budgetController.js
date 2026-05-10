const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets with progress
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).populate('category', 'name');
    
    // Calculate current spending for each budget
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const budgetsWithProgress = await Promise.all(budgets.map(async (budget) => {
      const transactions = await Transaction.find({
        user: req.user._id,
        category: budget.category._id,
        type: 'expense',
        date: { $gte: startOfMonth }
      });
      
      const spent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
      return {
        ...budget.toObject(),
        spent
      };
    }));

    res.json(budgetsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    // Check if budget already exists for this category
    const budgetExists = await Budget.findOne({ category, user: req.user._id });
    if (budgetExists) {
      return res.status(400).json({ message: 'Budget for this category already exists' });
    }

    const budget = new Budget({
      category,
      amount,
      period,
      user: req.user._id,
    });

    const createdBudget = await budget.save();
    await createdBudget.populate('category', 'name');
    res.status(201).json({ ...createdBudget.toObject(), spent: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const { amount, period } = req.body;

    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (budget) {
      budget.amount = amount || budget.amount;
      budget.period = period || budget.period;

      const updatedBudget = await budget.save();
      await updatedBudget.populate('category', 'name');
      res.json(updatedBudget); // Progress might need to be re-fetched on frontend or here
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (budget) {
      await budget.deleteOne();
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
