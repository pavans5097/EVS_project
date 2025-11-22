import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import WeatherWidget from './components/WeatherWidget';
import AnalysisResults from './components/AnalysisResults';
import RotationPlanner from './components/RotationPlanner';
import CropCard from './components/CropCard';
import { CropFormData, LoadingState, WeatherData, SavedCrop } from './types';
import { getCropInsights } from './services/geminiService';
import { AlertCircle, Sprout, RefreshCw, Plus, ArrowLeft, LayoutDashboard, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rotation'>('dashboard');
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'detail'>('list');
  
  const [savedCrops, setSavedCrops] = useState<SavedCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<SavedCrop | null>(null);

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Weather State
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
        rainfall: Math.max(0, parseFloat((prev.rainfall + (Math.random() * 0.2 - 0.05)).toFixed(1))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddCropSubmit = async (data: CropFormData) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);

    try {
      // Call AI
      const analysis = await getCropInsights(data, weather);
      
      const newCrop: SavedCrop = {
        ...data,
        id: Date.now().toString(),
        analysis,
        dateAdded: Date.now()
      };

      setSavedCrops(prev => [newCrop, ...prev]);
      setLoadingState(LoadingState.IDLE);
      setViewMode('list');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze crop. Please check your connection and try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleCropClick = (crop: SavedCrop) => {
    setSelectedCrop(crop);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDashboardContent = () => {
    if (viewMode === 'add') {
      return (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <button 
            onClick={() => setViewMode('list')} 
            className="mb-6 flex items-center text-gray-600 hover:text-agri-700 font-medium transition-colors group"
          >
            <div className="bg-white p-1.5 rounded-full shadow-sm mr-2 group-hover:bg-agri-50 transition-colors">
               <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </button>
          
          {loadingState === LoadingState.ERROR && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
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
        <div className="animate-fade-in">
          <div className="sticky top-16 z-40 bg-gray-50/90 backdrop-blur-sm py-2 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
             <button 
              onClick={() => setViewMode('list')} 
              className="flex items-center text-gray-600 hover:text-agri-700 font-medium transition-colors py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to My Crops
            </button>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCrop.cropName}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                 <span className="bg-gray-100 px-3 py-1 rounded-full">{selectedCrop.location}</span>
                 <span>•</span>
                 <span>Sowed {new Date(selectedCrop.sowingDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
               <div className="bg-agri-50 px-5 py-3 rounded-2xl text-right border border-agri-100">
                 <p className="text-xs text-agri-600 uppercase font-bold tracking-wider mb-1">Est. Harvest</p>
                 <p className="text-xl font-bold text-agri-800">
                   {(() => {
                     const d = new Date(selectedCrop.sowingDate);
                     d.setDate(d.getDate() + selectedCrop.analysis.totalDurationDays);
                     return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
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
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Farm Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Track progress and health of your active crops.</p>
          </div>
          <button 
            onClick={() => setViewMode('add')}
            className="w-full sm:w-auto bg-agri-600 hover:bg-agri-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-agri-200 hover:shadow-agri-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Crop
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Weather Widget */}
           <div className="lg:col-span-1 space-y-6">
             <WeatherWidget location={selectedCrop?.location || ''} weather={weather} />
             
             <div className="hidden lg:block bg-blue-50/80 backdrop-blur-sm p-5 rounded-2xl text-sm text-blue-900 border border-blue-100 shadow-sm">
               <div className="flex items-start gap-3">
                 <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold mb-1">Smart Insight</p>
                   <p className="opacity-80 leading-relaxed">Pest warnings are updated automatically based on real-time temperature and humidity changes in your area.</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Right: Crop List */}
           <div className="lg:col-span-2">
             {savedCrops.length === 0 ? (
               <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                 <div className="w-20 h-20 bg-agri-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                   <Sprout className="w-10 h-10 text-agri-400" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Your farm is empty</h3>
                 <p className="text-gray-500 max-w-xs mx-auto mb-8">Add your first crop to generate a dashboard with AI-driven growth tracking and alerts.</p>
                 <button 
                    onClick={() => setViewMode('add')}
                    className="text-agri-600 font-bold hover:text-agri-700 text-lg hover:underline underline-offset-4 transition-all"
                  >
                    + Add Crop Now
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Top Navigation Tabs - Scrollable on mobile */}
        {viewMode === 'list' && (
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:pb-0 hide-scrollbar">
             <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm inline-flex whitespace-nowrap">
               <button 
                 onClick={() => setActiveTab('dashboard')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                   activeTab === 'dashboard' ? 'bg-agri-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 <LayoutDashboard className="w-4 h-4" />
                 Dashboard
               </button>
               <button 
                 onClick={() => setActiveTab('rotation')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                   activeTab === 'rotation' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 <RefreshCw className="w-4 h-4" />
                 Rotation Planner
               </button>
             </div>
          </div>
        )}

        {activeTab === 'rotation' && viewMode === 'list' ? (
          <div className="animate-fade-in">
             <RotationPlanner />
          </div>
        ) : (
          renderDashboardContent()
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} AgriSmart AI</p>
          <p className="text-xs text-gray-400">Built to help farmers grow better using Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;