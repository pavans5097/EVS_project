import React, { useState } from 'react';
import { MapPin, Sprout, Ruler, Loader2, Search, Calendar } from 'lucide-react';
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
        setFormData(prev => ({ ...prev, location: "Detected Location (Lat: " + position.coords.latitude.toFixed(2) + ")" }));
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not detect location. Please enter manually.");
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-agri-100 overflow-hidden max-w-2xl mx-auto">
      <div className="bg-agri-600 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            New Crop Entry
          </h2>
          <p className="text-agri-100 text-sm mt-1">Enter details to track your harvest</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Crop Name */}
        <div className="space-y-2">
          <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">
            Crop Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-colors"
              placeholder="e.g. Wheat, Corn, Tomato"
              required
            />
          </div>
        </div>

        {/* Location & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-colors"
                  placeholder="Region or City"
                  required
                />
              </div>
              <button 
                type="button"
                onClick={handleUseLocation}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Use current location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="sowingDate" className="block text-sm font-medium text-gray-700">
              Sowing Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="sowingDate"
                name="sowingDate"
                value={formData.sowingDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
              Land Area
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="landArea"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-colors"
                placeholder="0.00"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="landUnit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="landUnit"
              name="landUnit"
              value={formData.landUnit}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-agri-500 bg-white"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-agri-600 hover:bg-agri-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-agri-200 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Add Crop to Dashboard'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;