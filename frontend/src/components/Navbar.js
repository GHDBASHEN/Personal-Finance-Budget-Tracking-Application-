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
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface border-r border-slate-200 p-4 flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
            BT
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Budget Track
          </h1>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-slate-500'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="font-medium text-slate-800 truncate">{user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-danger hover:bg-danger/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
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
