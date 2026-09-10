import type { WeatherData } from './api';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface CropAdvisory {
  crop: string;
  advisory: string;
  reasoning: string;
  droughtRisk: RiskLevel;
  floodRisk: RiskLevel;
  pestRisk: RiskLevel;
  compositeRisk: RiskLevel;
}

export const CROP_CONFIGS = {
  Sugarcane: {
    maxTemp: 35,
    minTemp: 20,
    waterNeeds: 'high'
  },
  Onion: {
    maxTemp: 30,
    minTemp: 13,
    waterNeeds: 'medium'
  },
  Cotton: {
    maxTemp: 32,
    minTemp: 21,
    waterNeeds: 'low'
  }
};

const calculateDroughtRisk = (precipitation: number[], baselinePrecipitation: number): RiskLevel => {
  const totalPrec = precipitation.reduce((a, b) => a + (b || 0), 0);
  const avgPrec = totalPrec / 7;
  if (avgPrec < baselinePrecipitation * 0.3) return 'High';
  if (avgPrec < baselinePrecipitation * 0.7) return 'Medium';
  return 'Low';
};

const calculateFloodRisk = (precipitation: number[]): RiskLevel => {
  const maxDailyPrec = Math.max(...(precipitation.map(p => p || 0)));
  if (maxDailyPrec > 50) return 'High';
  if (maxDailyPrec > 25) return 'Medium';
  return 'Low';
};

const calculatePestRisk = (maxTemps: number[], humidity: number[]): RiskLevel => {
  const avgTemp = maxTemps.reduce((a, b) => a + b, 0) / 7;
  const avgHum = humidity.reduce((a, b) => a + b, 0) / 7;
  
  if (avgTemp > 25 && avgTemp < 35 && avgHum > 80) return 'High';
  if (avgTemp > 20 && avgHum > 60) return 'Medium';
  return 'Low';
};

const getCompositeRisk = (drought: RiskLevel, flood: RiskLevel, pest: RiskLevel): RiskLevel => {
  const risks = [drought, flood, pest];
  if (risks.includes('High')) return 'High';
  if (risks.filter(r => r === 'Medium').length >= 2) return 'High';
  if (risks.includes('Medium')) return 'Medium';
  return 'Low';
};

export const generateAdvisories = (
  forecast: WeatherData,
  baselinePrecipitation: number
): CropAdvisory[] => {
  const droughtRisk = calculateDroughtRisk(forecast.precipitation_sum, baselinePrecipitation);
  const floodRisk = calculateFloodRisk(forecast.precipitation_sum);
  const pestRisk = calculatePestRisk(forecast.temperature_2m_max, forecast.relative_humidity_2m_mean);
  
  return Object.entries(CROP_CONFIGS).map(([crop, config]) => {
    let advisory = "Conditions are stable. Continue standard farming practices.";
    let reasoning = "Weather patterns fall within typical historical baselines.";
    
    if (floodRisk === 'High') {
      advisory = "Delay irrigation immediately. Ensure proper drainage.";
      reasoning = "Heavy rainfall expected which may lead to waterlogging.";
    } else if (droughtRisk === 'High' && config.waterNeeds === 'high') {
      advisory = "Prioritize irrigation. Consider mulching to retain soil moisture.";
      reasoning = "Significant rainfall deficit compared to historical average.";
    } else if (pestRisk === 'High') {
      advisory = "Spray preventive fungicide/pesticide. Monitor crops closely.";
      reasoning = "High humidity and warm temperatures create ideal conditions for pests and disease.";
    }

    const compositeRisk = getCompositeRisk(droughtRisk, floodRisk, pestRisk);

    return {
      crop,
      advisory,
      reasoning,
      droughtRisk,
      floodRisk,
      pestRisk,
      compositeRisk
    };
  });
};
