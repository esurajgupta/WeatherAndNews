/* eslint-disable curly */
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AppContext} from '../context/AppContext';
import {fetchWeather, fetchNews} from '../utils/api';

const filterNewsByWeather = (weather, news) => {
  if (weather < 10)
    return news.filter(
      n =>
        n.title.toLowerCase().includes('death') ||
        n.title.toLowerCase().includes('loss'),
    );
  if (weather > 30)
    return news.filter(
      n =>
        n.title.toLowerCase().includes('fire') ||
        n.title.toLowerCase().includes('fear'),
    );
  return news.filter(
    n =>
      n.title.toLowerCase().includes('win') ||
      n.title.toLowerCase().includes('happy'),
  );
};

const HomeScreen = () => {
  const {unit, categories} = useContext(AppContext);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const weatherData = await fetchWeather('Bengaluru', unit);
        setWeather(weatherData);

        const allNews = await Promise.all(
          categories.map(cat => fetchNews(cat)),
        );
        const mergedNews = [].concat(...allNews);
        const filtered = filterNewsByWeather(weatherData.main.temp, mergedNews);
        setNews(filtered);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [unit, categories]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(item.url)}
      style={styles.newsCard}>
      {item.urlToImage && (
        <Image
          source={{uri: item.urlToImage}}
          style={styles.newsImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.description || 'No description available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.location}>{weather.name}</Text>
          <Text style={styles.temp}>
            {weather.main.temp}° {unit === 'metric' ? 'C' : 'F'}
          </Text>
          <Text style={styles.condition}>{weather.weather[0].main}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>News Based on Weather</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="tomato"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={news}
          keyExtractor={item => item.url}
          renderItem={renderItem}
          contentContainerStyle={styles.newsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  weatherContainer: {
    backgroundColor: '#4e8ef5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {fontSize: 20, color: '#fff', fontWeight: '600'},
  temp: {fontSize: 32, color: '#fff', fontWeight: 'bold'},
  condition: {fontSize: 18, color: '#fff', marginTop: 4},
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  newsList: {paddingBottom: 20},
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  newsImage: {width: 100, height: 100},
  newsContent: {flex: 1, padding: 10},
  newsTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  newsDescription: {fontSize: 14, color: '#666', marginTop: 4},
});

export default HomeScreen;
