import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (!data) return <div className="p-8 text-slate-500 text-center mt-10">Failed to load dashboard</div>;

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4'];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Financial Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} className="text-primary" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Current Balance</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">${data.summary.currentBalance.toFixed(2)}</h3>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight size={48} className="text-secondary" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Total Income</p>
          <h3 className="text-3xl font-bold text-secondary mb-2">+${data.summary.totalIncome.toFixed(2)}</h3>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight size={48} className="text-danger" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-danger mb-2">-${data.summary.totalExpenses.toFixed(2)}</h3>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={48} className="text-accent" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Monthly Expenses</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">${data.summary.monthlyExpenses.toFixed(2)}</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expense */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Income vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Expense Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            {data.expenseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expenseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#0f172a' }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500">No expenses to display</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Transactions</h3>
        {data.recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {data.recentTransactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'}`}>
                    {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{tx.title}</p>
                    <p className="text-sm text-slate-500">{tx.category?.name || 'Uncategorized'} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'income' ? 'text-secondary' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No recent transactions</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
