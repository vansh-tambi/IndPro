import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 py-3.5 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          TaskFlow
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-55 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold">
              {user.name ? user.name[0].toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="text-xs font-medium text-slate-700">{user.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
