import { GoogleGenAI, Type } from "@google/genai";
import { CropAnalysis, CropFormData, RotationPlan, WeatherData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCropInsights = async (data: CropFormData, weather: WeatherData): Promise<CropAnalysis> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as an expert agronomist. 
    I am a farmer growing '${data.cropName}' in '${data.location}' on a land area of '${data.landArea} ${data.landUnit}'.
    The sowing date was '${data.sowingDate}'.
    The current local weather conditions are: Temperature ${weather.temperature}°C, Humidity ${weather.humidity}%, Rainfall ${weather.rainfall}mm, Condition ${weather.condition}.
    
    Please provide a detailed analysis including:
    1. Ideal growing conditions.
    2. Specific fertilizer recommendations.
    3. Critical tips for harvest.
    4. PEST & DISEASE ALERTS: Based on the *current weather* provided (especially temp/humidity) and location, predict 2-3 likely pests or diseases.
    5. MARKET INSIGHTS: Estimate current market price range for this crop in this region (or general global trend if local unknown) and the price trend.
    6. ESTIMATED DURATION: The typical total growing duration (in days) for this crop variety in this season.
    7. A brief encouraging summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idealConditions: {
              type: Type.OBJECT,
              properties: {
                temperatureRange: { type: Type.STRING },
                humidityRange: { type: Type.STRING },
                rainfallRequirement: { type: Type.STRING },
                soilType: { type: Type.STRING },
              },
              required: ["temperatureRange", "humidityRange", "rainfallRequirement", "soilType"]
            },
            fertilizers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  applicationMethod: { type: Type.STRING },
                  timing: { type: Type.STRING },
                },
                required: ["name", "quantity", "applicationMethod", "timing"]
              }
            },
            pestsAndDiseases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  symptoms: { type: Type.STRING },
                  prevention: { type: Type.STRING },
                },
                required: ["name", "riskLevel", "symptoms", "prevention"]
              }
            },
            marketOutlook: {
              type: Type.OBJECT,
              properties: {
                averagePrice: { type: Type.STRING, description: "Price range per unit (kg/ton)" },
                currency: { type: Type.STRING, description: "Currency symbol e.g. $" },
                trend: { type: Type.STRING, enum: ["Up", "Down", "Stable"] },
                seasonalInsight: { type: Type.STRING, description: "Short note on market demand" },
              },
              required: ["averagePrice", "currency", "trend", "seasonalInsight"]
            },
            harvestTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING },
            totalDurationDays: { type: Type.INTEGER, description: "Total days from sowing to harvest" }
          },
          required: ["idealConditions", "fertilizers", "pestsAndDiseases", "marketOutlook", "harvestTips", "summary", "totalDurationDays"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CropAnalysis;
    } else {
      throw new Error("No analysis generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateRotationPlan = async (currentCrop: string, landSize: string, location: string): Promise<RotationPlan> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    I am a farmer in ${location} with ${landSize} of land.
    My most recent crop was ${currentCrop}.
    Generate a 3-season crop rotation plan to maximize soil fertility and reduce disease.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING, description: "Brief explanation of why rotation is good" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  season: { type: Type.STRING, description: "e.g., Next Season, Following Year" },
                  recommendedCrop: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  soilBenefit: { type: Type.STRING },
                },
                required: ["season", "recommendedCrop", "reason", "soilBenefit"]
              }
            }
          },
          required: ["introduction", "steps"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RotationPlan;
    } else {
      throw new Error("No rotation plan generated.");
    }
  } catch (error) {
    console.error("Rotation Plan Error", error);
    throw error;
  }
};