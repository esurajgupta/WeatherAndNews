import axios from 'axios';

const WEATHER_API_KEY = '';
const NEWS_API_KEY = '';

export const fetchNews = async (category = 'general') => {
  const res = await axios.get(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`,
  );
  return res.data.articles;
};

// Fetch current weather
export const fetchWeatherByCoords = async (lat, lon, unit = 'metric') => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`,
  );
  return res.data;
};

// Fetch 5-day forecast
export const fetchWeatherForecast = async (lat, lon, unit = 'metric') => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`,
  );
  return res.data;
};

// Fetch latest headlines (no category)
export const fetchTopHeadlines = async () => {
  const res = await axios.get(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`,
  );
  return res.data.articles;
};
