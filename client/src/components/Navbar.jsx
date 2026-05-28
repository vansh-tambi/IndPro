import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="w-full bg-slate-950/60 backdrop-blur-md border-b border-slate-900 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
          <CheckSquare className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          TaskFlow
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 md:gap-3 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-full pr-4">
            <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-semibold text-sm">
              {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden md:inline">{user.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
