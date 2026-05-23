import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/leads', label: '🎯 Leads' },
    { path: '/employees', label: '👥 Employees' },
    { path: '/performance', label: '📈 Performance' },
  ];

  return (
    <div className="w-64 bg-slate-800 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Manufacturing CRM</h1>
        <p className="text-slate-400 text-sm mt-1">{user?.name}</p>
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1 inline-block">
          {user?.role}
        </span>
      </div>

      <nav className="flex-1 p-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-lg mb-2 transition-all ${
              location.pathname === link.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;