import React from 'react';
import { CloudRain, Droplets, Thermometer, Wind, Sun } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  location: string;
  weather: WeatherData;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location, weather }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl text-white p-6 transform transition hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-blue-100 font-medium text-sm uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Monitor
          </h3>
          <h2 className="text-2xl font-bold mt-1">{location || 'Farm Station'}</h2>
          <p className="text-blue-100 text-sm opacity-80">{new Date().toLocaleDateString()}</p>
        </div>
        <Sun className="w-10 h-10 text-yellow-300 animate-spin-slow" style={{ animationDuration: '10s' }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors">
          <Thermometer className="w-6 h-6 mb-2 text-red-300" />
          <span className="text-3xl font-bold">{weather.temperature}°C</span>
          <span className="text-xs text-blue-100">Temperature</span>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors">
          <Droplets className="w-6 h-6 mb-2 text-blue-300" />
          <span className="text-3xl font-bold">{weather.humidity}%</span>
          <span className="text-xs text-blue-100">Humidity</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors">
          <Wind className="w-6 h-6 mb-2 text-gray-300" />
          <span className="text-3xl font-bold">{weather.windSpeed}</span>
          <span className="text-xs text-blue-100">km/h Wind</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/20 transition-colors">
          <CloudRain className="w-6 h-6 mb-2 text-indigo-300" />
          <span className="text-3xl font-bold">{weather.rainfall}</span>
          <span className="text-xs text-blue-100">mm Rain</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;