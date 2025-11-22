import React from 'react';
import { Sprout, HelpCircle, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-agri-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer">
            <div className="bg-gradient-to-br from-agri-100 to-agri-200 p-2.5 rounded-xl shadow-inner">
              <Sprout className="h-6 w-6 text-agri-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">AgriSmart<span className="text-agri-600">AI</span></h1>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider hidden sm:block">Intelligent Farming Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button className="p-2 text-gray-500 hover:text-agri-700 hover:bg-agri-50 rounded-lg transition-colors" title="Help">
               <HelpCircle className="w-6 h-6" />
             </button>
             <div className="h-9 w-9 rounded-full bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-agri-200 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-agri-500 transition-all">
               <User className="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;