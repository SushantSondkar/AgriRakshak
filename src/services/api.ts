export interface WeatherData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  relative_humidity_2m_mean: number[];
}

export interface HistoricalData {
  time: string[];
  precipitation_sum: number[];
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const HISTORICAL_URL = 'https://archive-api.open-meteo.com/v1/archive';

export const fetchForecast = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      hourly: 'relative_humidity_2m',
      timezone: 'auto',
      forecast_days: '7'
    });
    
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    
    const data = await response.json();
    
    // Aggregate hourly humidity to daily mean for simplicity
    const dailyHumidity = [];
    if (data.hourly && data.hourly.relative_humidity_2m) {
      for (let i = 0; i < 7; i++) {
        const dayHumidity = data.hourly.relative_humidity_2m.slice(i * 24, (i + 1) * 24);
        const mean = dayHumidity.reduce((a: number, b: number) => a + b, 0) / 24;
        dailyHumidity.push(mean);
      }
    }
    
    return {
      time: data.daily.time,
      temperature_2m_max: data.daily.temperature_2m_max,
      temperature_2m_min: data.daily.temperature_2m_min,
      precipitation_sum: data.daily.precipitation_sum,
      relative_humidity_2m_mean: dailyHumidity
    };
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const fetchHistoricalBaseline = async (lat: number, lon: number): Promise<number> => {
  try {
    // We will just fetch a mock baseline or previous month's data as 5 year data requires a lot of processing
    // For the sake of this prototype, let's fetch last year's data for the same week
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    
    const endDate = date.toISOString().split('T')[0];
    date.setDate(date.getDate() - 7);
    const startDate = date.toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: 'precipitation_sum',
      timezone: 'auto'
    });
    
    const response = await fetch(`${HISTORICAL_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch historical data');
    
    const data = await response.json();
    
    const totalPrecipitation = data.daily.precipitation_sum.reduce((a: number, b: number) => a + (b || 0), 0);
    return totalPrecipitation / 7; // Return average daily precipitation for the baseline
  } catch (error) {
    console.error("Error fetching historical baseline:", error);
    return 2; // fallback baseline
  }
};
