import React from 'react';
import { Sprout } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-agri-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-agri-100 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-agri-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">AgriSmart<span className="text-agri-600">AI</span></h1>
              <p className="text-xs text-gray-500 hidden sm:block">Intelligent Farming Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-sm text-gray-600 hover:text-agri-700 font-medium">Help</button>
             <div className="h-8 w-8 rounded-full bg-agri-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
               JD
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;