const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  amount: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    default: 'Monthly',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
