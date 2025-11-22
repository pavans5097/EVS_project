export interface CropFormData {
  cropName: string;
  landArea: string;
  landUnit: 'acres' | 'hectares';
  location: string;
  sowingDate: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainfall: number;
}

export interface FertilizerRecommendation {
  name: string;
  quantity: string;
  applicationMethod: string;
  timing: string;
}

export interface PestRisk {
  name: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  symptoms: string;
  prevention: string;
}

export interface MarketData {
  averagePrice: string;
  currency: string;
  trend: 'Up' | 'Down' | 'Stable';
  seasonalInsight: string;
}

export interface CropAnalysis {
  idealConditions: {
    temperatureRange: string;
    humidityRange: string;
    rainfallRequirement: string;
    soilType: string;
  };
  fertilizers: FertilizerRecommendation[];
  harvestTips: string[];
  summary: string;
  pestsAndDiseases: PestRisk[];
  marketOutlook: MarketData;
  totalDurationDays: number;
}

export interface SavedCrop extends CropFormData {
  id: string;
  analysis: CropAnalysis;
  dateAdded: number;
}

export interface RotationStep {
  season: string;
  recommendedCrop: string;
  reason: string;
  soilBenefit: string;
}

export interface RotationPlan {
  introduction: string;
  steps: RotationStep[];
}

export enum LoadingState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}