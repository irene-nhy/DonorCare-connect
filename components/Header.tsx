
import React from 'react';
import { Settings } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onOpenAdmin: () => void;
  isAdminMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ settings, onOpenAdmin, isAdminMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-soft-coral rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {settings.ngoName.charAt(0)}
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">{settings.ngoName}</h1>
            <p className="text-xs text-gray-400">DonorCare Connect</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenAdmin}
            className={`p-2 rounded-full transition-colors ${isAdminMode ? 'bg-soft-coral text-white' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Admin Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
