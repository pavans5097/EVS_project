import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import WeatherWidget from './components/WeatherWidget';
import AnalysisResults from './components/AnalysisResults';
import RotationPlanner from './components/RotationPlanner';
import CropCard from './components/CropCard';
import { CropFormData, CropAnalysis, LoadingState, WeatherData, SavedCrop } from './types';
import { getCropInsights } from './services/geminiService';
import { AlertCircle, Sprout, RefreshCw, Plus, ArrowLeft, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rotation'>('dashboard');
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'detail'>('list');
  
  const [savedCrops, setSavedCrops] = useState<SavedCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<SavedCrop | null>(null);

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Weather State (Simulated for current location, or last known)
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: 'Sunny',
    rainfall: 0
  });

  // Simulate weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: parseFloat((prev.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        humidity: Math.min(100, Math.max(0, Math.round(prev.humidity + (Math.random() * 2 - 1)))),
        windSpeed: parseFloat((prev.windSpeed + (Math.random() * 1 - 0.5)).toFixed(1)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddCropSubmit = async (data: CropFormData) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);

    try {
      // Call AI to get initial analysis and duration
      const analysis = await getCropInsights(data, weather);
      
      const newCrop: SavedCrop = {
        ...data,
        id: Date.now().toString(),
        analysis,
        dateAdded: Date.now()
      };

      setSavedCrops(prev => [newCrop, ...prev]);
      setLoadingState(LoadingState.IDLE);
      setViewMode('list'); // Return to dashboard
    } catch (err) {
      console.error(err);
      setError("Failed to analyze crop. Please try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleCropClick = (crop: SavedCrop) => {
    setSelectedCrop(crop);
    setViewMode('detail');
  };

  const renderDashboardContent = () => {
    if (viewMode === 'add') {
      return (
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setViewMode('list')} 
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          
          {loadingState === LoadingState.ERROR && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          
          <InputForm 
            onSubmit={handleAddCropSubmit} 
            isLoading={loadingState === LoadingState.LOADING} 
            onCancel={() => setViewMode('list')}
          />
        </div>
      );
    }

    if (viewMode === 'detail' && selectedCrop) {
      return (
        <div>
          <button 
            onClick={() => setViewMode('list')} 
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to My Crops
          </button>
          
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCrop.cropName}</h2>
              <p className="text-gray-500">{selectedCrop.location} • Sowed {new Date(selectedCrop.sowingDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                 <p className="text-xs text-gray-400 uppercase font-bold">Est. Harvest</p>
                 <p className="text-lg font-semibold text-agri-700">
                   {(() => {
                     const d = new Date(selectedCrop.sowingDate);
                     d.setDate(d.getDate() + selectedCrop.analysis.totalDurationDays);
                     return d.toLocaleDateString();
                   })()}
                 </p>
               </div>
            </div>
          </div>
          
          <AnalysisResults data={selectedCrop.analysis} />
        </div>
      );
    }

    // Default: List Mode
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Farm Dashboard</h2>
            <p className="text-gray-600">Track progress and health of your active crops.</p>
          </div>
          <button 
            onClick={() => setViewMode('add')}
            className="bg-agri-600 hover:bg-agri-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Crop
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Weather Widget always visible in Dashboard */}
           <div className="lg:col-span-1">
             <WeatherWidget location={selectedCrop?.location || 'Local Farm'} weather={weather} />
             <div className="mt-4 bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
               <p className="font-bold mb-1">💡 Pro Tip:</p>
               Check your dashboard daily. Pests warnings are updated based on real-time weather conditions.
             </div>
           </div>

           {/* Right: Crop List */}
           <div className="lg:col-span-2">
             {savedCrops.length === 0 ? (
               <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <Sprout className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900">No crops added yet</h3>
                 <p className="text-gray-500 max-w-xs mt-2 mb-6">Add your first crop to start tracking growth progress and get AI insights.</p>
                 <button 
                    onClick={() => setViewMode('add')}
                    className="text-agri-600 font-semibold hover:text-agri-700"
                  >
                    + Add Crop Now
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {savedCrops.map(crop => (
                   <CropCard key={crop.id} crop={crop} onClick={handleCropClick} />
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Top Navigation Tabs */}
        <div className="flex justify-center mb-8">
           <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
             <button 
               onClick={() => setActiveTab('dashboard')}
               className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                 activeTab === 'dashboard' ? 'bg-agri-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
               }`}
             >
               <LayoutDashboard className="w-4 h-4" />
               Dashboard
             </button>
             <button 
               onClick={() => setActiveTab('rotation')}
               className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                 activeTab === 'rotation' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
               }`}
             >
               <RefreshCw className="w-4 h-4" />
               Rotation Planner
             </button>
           </div>
        </div>

        {activeTab === 'rotation' ? (
          <RotationPlanner />
        ) : (
          renderDashboardContent()
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AgriSmart AI. Built to help farmers grow better.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;