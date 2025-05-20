import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Linking, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { fetchWeather, fetchNews } from '../utils/api';

const filterNewsByWeather = (weather, news) => {
  if (weather < 10) return news.filter(n => n.title.toLowerCase().includes('death' || 'loss'));
  if (weather > 30) return news.filter(n => n.title.toLowerCase().includes('fire' || 'fear'));
  return news.filter(n => n.title.toLowerCase().includes('win' || 'happy'));
};

const HomeScreen = () => {
  const { unit, categories } = useContext(AppContext);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const weatherData = await fetchWeather('Bengaluru', unit);
      setWeather(weatherData);

      const allNews = await Promise.all(categories.map(cat => fetchNews(cat)));
      const mergedNews = [].concat(...allNews);
      const filtered = filterNewsByWeather(weatherData.main.temp, mergedNews);
      setNews(filtered);
    };
    loadData();
  }, [unit, categories]);

  return (
    <View style={styles.container}>
      {weather && (
        <Text style={styles.weatherText}>
          {weather.name}: {weather.main.temp}° {unit === 'metric' ? 'C' : 'F'} - {weather.weather[0].main}
        </Text>
      )}
      <FlatList
        data={news}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <Text
            style={styles.newsItem}
            onPress={() => Linking.openURL(item.url)}
          >
            {item.title}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  weatherText: { fontSize: 18, marginBottom: 10 },
  newsItem: { fontSize: 16, marginBottom: 8, color: 'blue' },
});

export default HomeScreen;