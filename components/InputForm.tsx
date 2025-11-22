import React, { useState } from 'react';
import { MapPin, Sprout, Ruler, Loader2, Search, Calendar, X } from 'lucide-react';
import { CropFormData } from '../types';

interface InputFormProps {
  onSubmit: (data: CropFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState<CropFormData>({
    cropName: '',
    landArea: '',
    landUnit: 'acres',
    location: '',
    sowingDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cropName && formData.landArea && formData.location && formData.sowingDate) {
      onSubmit(formData);
    }
  };

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setFormData(prev => ({ ...prev, location: "Detected Location" }));
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not detect location. Please enter manually.");
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-agri-100 overflow-hidden max-w-2xl mx-auto animate-slide-up">
      <div className="bg-gradient-to-r from-agri-600 to-agri-700 px-6 py-5 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-6 h-6" />
            New Crop Entry
          </h2>
          <p className="text-agri-100 text-sm mt-1">Enter details to track your harvest</p>
        </div>
        <button onClick={onCancel} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Crop Name */}
        <div className="space-y-2">
          <label htmlFor="cropName" className="block text-sm font-semibold text-gray-700">
            Crop Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="block w-full pl-11 pr-4 py-3.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all text-base"
              placeholder="e.g. Wheat, Corn, Tomato"
              required
            />
          </div>
        </div>

        {/* Location & Date Row - Stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all text-base"
                  placeholder="Region or City"
                  required
                />
              </div>
              <button 
                type="button"
                onClick={handleUseLocation}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center active:scale-95"
                title="Use current location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="sowingDate" className="block text-sm font-semibold text-gray-700">
              Sowing Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="sowingDate"
                name="sowingDate"
                value={formData.sowingDate}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all text-base"
                required
              />
            </div>
          </div>
        </div>

        {/* Area - Stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 space-y-2">
            <label htmlFor="landArea" className="block text-sm font-semibold text-gray-700">
              Land Area
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="landArea"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all text-base"
                placeholder="0.00"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="landUnit" className="block text-sm font-semibold text-gray-700">
              Unit
            </label>
            <div className="relative">
              <select
                id="landUnit"
                name="landUnit"
                value={formData.landUnit}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white text-base appearance-none"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                 <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="order-2 sm:order-1 flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="order-1 sm:order-2 flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-700 hover:to-agri-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-agri-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Add Crop'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;