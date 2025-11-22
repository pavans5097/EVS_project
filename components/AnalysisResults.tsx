import React from 'react';
import { CropAnalysis } from '../types';
import { Leaf, Droplet, CheckCircle2, ThermometerSun, AlertTriangle, TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

interface AnalysisResultsProps {
  data: CropAnalysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Summary Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-agri-600" />
          AI Agronomist Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>

      {/* Market Insights & Pests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Market Prices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Market Intelligence
          </h3>
          <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl mb-4">
            <div>
              <p className="text-sm text-gray-500">Est. Market Price</p>
              <p className="text-2xl font-bold text-emerald-700">{data.marketOutlook.currency}{data.marketOutlook.averagePrice}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              data.marketOutlook.trend === 'Up' ? 'bg-green-100 text-green-700' : 
              data.marketOutlook.trend === 'Down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {data.marketOutlook.trend === 'Up' && <TrendingUp className="w-4 h-4" />}
              {data.marketOutlook.trend === 'Down' && <TrendingDown className="w-4 h-4" />}
              {data.marketOutlook.trend === 'Stable' && <Minus className="w-4 h-4" />}
              {data.marketOutlook.trend}
            </div>
          </div>
          <p className="text-sm text-gray-600 italic">"{data.marketOutlook.seasonalInsight}"</p>
        </div>

        {/* Pest Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Pest & Disease Alerts
          </h3>
          <div className="space-y-3">
            {data.pestsAndDiseases.map((pest, idx) => (
              <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                   <span className="font-medium text-red-900">{pest.name}</span>
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                     pest.riskLevel === 'High' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                   }`}>
                     {pest.riskLevel} Risk
                   </span>
                </div>
                <p className="text-xs text-gray-600 mb-1"><span className="font-semibold">Prevention:</span> {pest.prevention}</p>
              </div>
            ))}
            {data.pestsAndDiseases.length === 0 && <p className="text-sm text-gray-500">No immediate risks detected.</p>}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ideal Conditions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ThermometerSun className="w-5 h-5 text-orange-500" />
            Ideal Growing Conditions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">Temp. Range</span>
              <span className="font-medium text-gray-900">{data.idealConditions.temperatureRange}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">Humidity</span>
              <span className="font-medium text-gray-900">{data.idealConditions.humidityRange}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">Rainfall</span>
              <span className="font-medium text-gray-900">{data.idealConditions.rainfallRequirement}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">Soil Type</span>
              <span className="font-medium text-gray-900">{data.idealConditions.soilType}</span>
            </div>
          </div>
        </div>

        {/* Harvest Tips */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-agri-600" />
            Critical Harvest Tips
          </h3>
          <ul className="space-y-3">
            {data.harvestTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-agri-100 text-agri-700 text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-600">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fertilizer Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-agri-100 overflow-hidden">
        <div className="bg-gray-900 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-400" />
            Fertilizer Recommendations
          </h3>
          <p className="text-gray-400 text-sm mt-1">Tailored nutrient plan for your crop and land size.</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Fertilizer</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 rounded-tr-lg">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.fertilizers.map((fert, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 font-medium text-gray-900">{fert.name}</td>
                    <td className="px-4 py-3 text-agri-700 font-semibold">{fert.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{fert.applicationMethod}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        {fert.timing}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;