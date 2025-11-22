import React from 'react';
import { SavedCrop } from '../types';
import { Sprout, Calendar, Clock, ArrowRight, MapPin } from 'lucide-react';

interface CropCardProps {
  crop: SavedCrop;
  onClick: (crop: SavedCrop) => void;
}

const CropCard: React.FC<CropCardProps> = ({ crop, onClick }) => {
  // Calculate progress
  const sowingDate = new Date(crop.sowingDate);
  const today = new Date();
  const daysElapsed = Math.floor((today.getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = crop.analysis.totalDurationDays;
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  const estimatedHarvestDate = new Date(sowingDate);
  estimatedHarvestDate.setDate(sowingDate.getDate() + totalDays);

  return (
    <div 
      onClick={() => onClick(crop)}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-agri-200 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fade-in"
    >
      {/* Progress Bar Background */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-gray-50 w-full">
        <div className="h-full bg-gradient-to-r from-agri-400 to-agri-600 transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-agri-50 flex items-center justify-center text-agri-600 group-hover:bg-agri-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl group-hover:text-agri-700 transition-colors">{crop.cropName}</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate max-w-[120px] sm:max-w-[180px]">{crop.location}</span>
            </div>
          </div>
        </div>
        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${
          daysRemaining > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {daysRemaining > 0 ? 'Growing' : 'Harvest Ready'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
           <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1 font-medium">
             <Calendar className="w-3.5 h-3.5" />
             Sowed
           </div>
           <div className="font-bold text-gray-800 text-sm">{sowingDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
           <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1 font-medium">
             <Clock className="w-3.5 h-3.5" />
             Harvest
           </div>
           <div className="font-bold text-gray-800 text-sm">{estimatedHarvestDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
        </div>
      </div>

      <div className="space-y-2 mb-2">
        <div className="flex justify-between text-sm items-end">
          <span className="text-gray-500 font-medium text-xs">{daysElapsed} days done</span>
          <span className="text-agri-700 font-bold">{daysRemaining} days left</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-agri-400 to-agri-600 h-3 rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-sm">
        <span className="text-gray-500 font-medium">{crop.landArea} {crop.landUnit}</span>
        <span className="text-agri-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          Insights <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default CropCard;