import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  
  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        api.get('/transactions', { params: { type: filterType, category: filterCategory } }),
        api.get('/categories')
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, amount: Number(amount), category, type, date, note };
      if (editingTx) {
        await api.put(`/transactions/${editingTx._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save transaction', error);
      alert(error.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete transaction', error);
      }
    }
  };

  const openModal = (tx = null) => {
    if (tx) {
      setEditingTx(tx);
      setTitle(tx.title);
      setAmount(tx.amount);
      setCategory(tx.category?._id || '');
      setType(tx.type);
      setDate(new Date(tx.date).toISOString().split('T')[0]);
      setNote(tx.note || '');
    } else {
      setEditingTx(null);
      setTitle('');
      setAmount('');
      setCategory(''); // Force user to explicitly select category
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-slate-500">Loading transactions...</div>;

  const relevantCategories = categories.filter(c => c.type === type);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
            <Filter size={16} className="text-slate-500" />
            <select 
              className="bg-transparent text-sm text-slate-800 outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select 
              className="bg-transparent text-sm text-slate-800 outline-none border-l border-slate-200 pl-2 ml-1"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Transaction
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-slate-700">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{tx.title}</p>
                      {tx.note && <p className="text-xs text-slate-500 truncate max-w-xs">{tx.note}</p>}
                    </td>
                    <td className="p-4 text-slate-500">
                      {tx.category?.name || 'Uncategorized'}
                    </td>
                    <td className={`p-4 text-right font-medium ${tx.type === 'income' ? 'text-secondary' : 'text-danger'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(tx)}
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tx._id)}
                          className="p-2 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-200">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No transactions found</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="p-4 flex flex-col gap-3 bg-white/50 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-800">{tx.title}</p>
                    <p className="text-sm text-slate-500">{tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`font-medium ${tx.type === 'income' ? 'text-secondary' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
                {tx.note && <p className="text-sm text-slate-600 bg-slate-100 p-2 rounded-md">{tx.note}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => openModal(tx)}
                    className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tx._id)}
                    className="p-2 text-danger hover:bg-danger/20 bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTx ? "Edit Transaction" : "New Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={`py-2 px-4 rounded-lg border font-medium transition-all ${
                type === 'expense' 
                  ? 'bg-danger/20 border-danger text-danger' 
                  : 'border-slate-300 text-slate-500 hover:border-slate-400'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={`py-2 px-4 rounded-lg border font-medium transition-all ${
                type === 'income' 
                  ? 'bg-secondary/20 border-secondary text-secondary' 
                  : 'border-slate-300 text-slate-500 hover:border-slate-400'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Weekly Groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="input-field"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                className="input-field text-slate-700"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              required
              className="input-field text-slate-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select category...</option>
              {relevantCategories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Note (Optional)</label>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="Add some details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
