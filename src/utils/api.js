import axios from 'axios';

const WEATHER_API_KEY = '';
const NEWS_API_KEY = '';

export const fetchWeather = async (city, unit = 'metric') => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${WEATHER_API_KEY}`,
  );
  return res.data;
};

export const fetchNews = async (category = 'general') => {
  const res = await axios.get(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`,
  );
  return res.data.articles;
};
