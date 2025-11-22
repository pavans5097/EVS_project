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
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Progress Bar Background for visual flair (optional, subtle) */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
        <div className="h-full bg-agri-500 transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-agri-50 flex items-center justify-center text-agri-600">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-agri-700 transition-colors">{crop.cropName}</h3>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin className="w-3 h-3" />
              {crop.location}
            </div>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
          {daysRemaining > 0 ? 'Growing' : 'Harvest Ready'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-2 rounded-lg">
           <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
             <Calendar className="w-3 h-3" />
             Sowed
           </div>
           <div className="font-semibold text-gray-800 text-sm">{sowingDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
           <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
             <Clock className="w-3 h-3" />
             Est. Harvest
           </div>
           <div className="font-semibold text-gray-800 text-sm">{estimatedHarvestDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">{daysElapsed} days done</span>
          <span className="text-agri-700 font-bold">{daysRemaining} days left</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-agri-400 to-agri-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
        <span className="text-gray-500">{crop.landArea} {crop.landUnit}</span>
        <span className="text-agri-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default CropCard;