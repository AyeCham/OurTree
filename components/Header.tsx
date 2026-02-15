import React, { useState } from 'react';
import { Book, Download, LogOut, Settings, RefreshCw, LayoutDashboard } from 'lucide-react';
import { COLORS, HEADER_LOGO_URL } from '../constants';
import { Book as BookType } from '../types';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  onExport: () => void;
  onResetView: () => void;
  onOpenDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout, onOpenLogin, onExport, onResetView, onOpenDashboard }) => {
  const [headerLogoError, setHeaderLogoError] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-6xl mx-auto px-4 h-24 flex items-center justify-between text-white">
        <div 
          onClick={onResetView} 
          className="flex items-center gap-5 cursor-pointer group"
        >
          <div className="bg-white/10 p-1.5 rounded-2xl overflow-hidden flex items-center justify-center w-20 h-20 group-hover:bg-white/20 transition-all duration-300">
            {!headerLogoError ? (
              <img 
                src={HEADER_LOGO_URL} 
                alt="Header Logo" 
                className="w-full h-full object-contain filter drop-shadow-lg" 
                onError={() => setHeaderLogoError(true)} 
              />
            ) : (
              <Book size={32} className="text-white opacity-80" />
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight italic">Our Trees</h1>
        </div>
        <div className="flex items-center gap-2">
           {isAdmin && (
            <button 
              onClick={onOpenDashboard} 
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg mr-2"
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>
          )}

          {isAdmin && (
            <button 
              onClick={handleReload} 
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full text-xs font-bold transition-all mr-2"
              title="Reload System"
            >
              <RefreshCw size={14} />
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={onExport} 
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-emerald-500/30"
            >
              <Download size={14} /> Backup
            </button>
          )}
          {isAdmin ? (
            <button 
              onClick={onLogout} 
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-full text-xs font-bold transition-all"
            >
              <LogOut size={14} /> ထွက်ရန်
            </button>
          ) : (
            <button 
              onClick={onOpenLogin} 
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings size={22} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;