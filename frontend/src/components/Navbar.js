import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, WalletCards, PieChart, Tags, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <WalletCards size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <PieChart size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
  ];

  if (!user) return null;

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-surface/90 backdrop-blur-md border-b border-slate-200 px-6 justify-between items-center z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            BT
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Budget Track
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-slate-500'}`}>
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Logged in as</span>
            <span className="text-sm font-medium text-slate-800">{user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 text-danger hover:bg-danger/10 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-center p-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <div className={`${isActive ? 'text-primary' : 'text-slate-500'}`}>
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
