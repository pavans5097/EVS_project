import React from 'react';
import { CloudRain, Droplets, Thermometer, Wind, Sun, Cloud, MapPin, Navigation } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  location: string;
  weather: WeatherData;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location, weather }) => {
  // Helper to determine gradient based on condition (simple logic)
  const getGradient = () => {
    if (weather.rainfall > 5) return 'from-slate-700 to-slate-900';
    if (weather.temperature > 30) return 'from-orange-500 to-red-600';
    if (weather.condition.toLowerCase().includes('cloud')) return 'from-blue-400 to-slate-500';
    return 'from-blue-500 to-cyan-600';
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getGradient()} text-white shadow-2xl transition-all duration-500 hover:shadow-xl hover:scale-[1.01] group`}>
      
      {/* Decorative background circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>

      <div className="relative p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
               Live Weather
            </div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 truncate max-w-[200px] sm:max-w-none">
              <MapPin className="w-5 h-5 opacity-80" />
              {location || 'Local Farm'}
            </h2>
            <p className="text-white/70 text-sm mt-1 font-medium">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <Sun className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300 animate-spin-slow filter drop-shadow-lg" />
            <span className="text-sm font-medium text-white/90 mt-2">{weather.condition}</span>
          </div>
        </div>

        {/* Main Temp */}
        <div className="mb-8 flex items-end gap-4">
          <div className="text-6xl sm:text-7xl font-bold tracking-tighter leading-none">
            {Math.round(weather.temperature)}°
          </div>
          <div className="pb-2 text-lg opacity-80 font-medium">Celsius</div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          
          {/* Humidity */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-blue-200">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Humidity</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{weather.humidity}%</div>
            <div className="w-full bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-300 h-full rounded-full transition-all duration-1000" style={{ width: `${weather.humidity}%` }}></div>
            </div>
          </div>

          {/* Wind */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/20 transition-colors">
             <div className="flex items-center gap-2 mb-2 text-slate-200">
              <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Wind</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{weather.windSpeed}</div>
            <div className="text-[10px] sm:text-xs opacity-70">km/h</div>
            <div className="w-full bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-slate-300 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, weather.windSpeed * 2)}%` }}></div>
            </div>
          </div>

          {/* Rain */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-indigo-200">
              <CloudRain className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Rain</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{weather.rainfall}</div>
            <div className="text-[10px] sm:text-xs opacity-70">mm</div>
            <div className="w-full bg-black/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-300 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, weather.rainfall * 5)}%` }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;