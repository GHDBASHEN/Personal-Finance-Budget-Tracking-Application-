const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    
    let query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query).populate('category', 'name').sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;

    const transaction = new Transaction({
      title,
      amount,
      category,
      type,
      date,
      note,
      user: req.user._id,
    });

    const createdTransaction = await transaction.save();
    
    // Populate category before sending response
    await createdTransaction.populate('category', 'name');
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;

    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (transaction) {
      transaction.title = title || transaction.title;
      transaction.amount = amount || transaction.amount;
      transaction.category = category || transaction.category;
      transaction.type = type || transaction.type;
      transaction.date = date || transaction.date;
      transaction.note = note !== undefined ? note : transaction.note;

      const updatedTransaction = await transaction.save();
      await updatedTransaction.populate('category', 'name');
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (transaction) {
      await transaction.deleteOne();
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
