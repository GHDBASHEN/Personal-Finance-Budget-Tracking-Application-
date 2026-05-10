import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  // Form State
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('Monthly');

  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/categories')
      ]);
      setBudgets(budgetsRes.data);
      // Only show expense categories for budgets
      setCategories(categoriesRes.data.filter(c => c.type === 'expense'));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, { amount: Number(amount), period });
      } else {
        await api.post('/budgets', { category, amount: Number(amount), period });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save budget', error);
      alert(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete budget', error);
      }
    }
  };

  const openModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setCategory(budget.category._id);
      setAmount(budget.amount);
      setPeriod(budget.period);
    } else {
      setEditingBudget(null);
      setCategory(categories[0]?._id || '');
      setAmount('');
      setPeriod('Monthly');
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-slate-400">Loading budgets...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Budgets</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const percentUsed = Math.min((budget.spent / budget.amount) * 100, 100);
          const isOverBudget = budget.spent > budget.amount;
          const isNearLimit = percentUsed >= 80 && !isOverBudget;

          return (
            <div key={budget._id} className="glass-panel p-6 group">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">{budget.category?.name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-400">{budget.period}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(budget)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(budget._id)}
                    className="p-2 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent: <span className="text-white font-medium">${budget.spent.toFixed(2)}</span></span>
                  <span className="text-slate-400">Budget: <span className="text-white font-medium">${budget.amount.toFixed(2)}</span></span>
                </div>
                
                {/* Progress bar background */}
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                  {/* Progress bar fill */}
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isOverBudget ? 'bg-danger' : isNearLimit ? 'bg-fuchsia-500' : 'bg-primary'
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                
                {/* Alerts */}
                {isOverBudget && (
                  <div className="flex items-center gap-2 text-danger text-sm mt-2 font-medium">
                    <AlertTriangle size={16} />
                    Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                  </div>
                )}
                {isNearLimit && (
                  <div className="flex items-center gap-2 text-fuchsia-400 text-sm mt-2 font-medium">
                    <AlertTriangle size={16} />
                    Nearing budget limit!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? "Edit Budget" : "New Budget"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingBudget && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select
                required
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select category...</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount ($)</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              className="input-field"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Period</label>
            <select
              required
              className="input-field"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
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

export default Budgets;
