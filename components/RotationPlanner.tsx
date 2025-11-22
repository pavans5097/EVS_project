import React, { useState } from 'react';
import { Sprout, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';
import { RotationPlan, LoadingState } from '../types';
import { generateRotationPlan } from '../services/geminiService';

const RotationPlanner: React.FC = () => {
  const [currentCrop, setCurrentCrop] = useState('');
  const [location, setLocation] = useState('');
  const [landSize, setLandSize] = useState('');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [plan, setPlan] = useState<RotationPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(LoadingState.LOADING);
    try {
      const result = await generateRotationPlan(currentCrop, landSize, location);
      setPlan(result);
      setLoading(LoadingState.SUCCESS);
    } catch (error) {
      setLoading(LoadingState.ERROR);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <RefreshCw className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '8s'}} />
          Crop Rotation Planner
        </h2>
        <p className="text-orange-100">Enhance soil fertility and break pest cycles by planning your next seasons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Harvested Crop</label>
              <input 
                type="text" 
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Corn"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Iowa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Size</label>
              <input 
                type="text" 
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., 5 acres"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading === LoadingState.LOADING}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
            >
              {loading === LoadingState.LOADING ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Plan Rotation'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
           {loading === LoadingState.IDLE && (
             <div className="h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8">
               <Sprout className="w-12 h-12 mb-2 opacity-50" />
               <p>Enter details to generate a soil-friendly plan</p>
             </div>
           )}
           
           {loading === LoadingState.SUCCESS && plan && (
             <div className="space-y-6 animate-fade-in">
               <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                 <p className="text-gray-700 italic border-l-4 border-amber-500 pl-4">{plan.introduction}</p>
               </div>

               <div className="space-y-0 relative">
                 <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                 {plan.steps.map((step, idx) => (
                   <div key={idx} className="relative flex items-start gap-6 pb-8 last:pb-0">
                     <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-amber-500 flex flex-col items-center justify-center shadow-sm shrink-0">
                       <span className="text-[10px] text-gray-500 font-semibold uppercase">Step</span>
                       <span className="text-xl font-bold text-gray-800">{idx + 1}</span>
                     </div>
                     <div className="flex-grow bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{step.recommendedCrop}</h3>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md uppercase">{step.season}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{step.reason}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                          <Sprout className="w-4 h-4" />
                          Soil Benefit: {step.soilBenefit}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RotationPlanner;