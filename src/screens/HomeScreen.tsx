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
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from '../context/AppContext';
import {
  fetchWeatherByCoords,
  fetchWeatherForecast,
  fetchTopHeadlines,
} from '../utils/api';

const filterNewsByWeather = (temp, news) => {
  if (temp < 10) {
    return news.filter(
      n =>
        n.title?.toLowerCase().includes('death') ||
        n.title?.toLowerCase().includes('loss'),
    );
  } else if (temp > 30) {
    return news.filter(
      n =>
        n.title?.toLowerCase().includes('fire') ||
        n.title?.toLowerCase().includes('fear'),
    );
  } else {
    return news.filter(
      n =>
        n.title?.toLowerCase().includes('win') ||
        n.title?.toLowerCase().includes('happy'),
    );
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'We need your location to fetch weather info',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const HomeScreen = () => {
  const {unit} = useContext(AppContext);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          const weatherData = await fetchWeatherByCoords(
            latitude,
            longitude,
            unit,
          );
          setWeather(weatherData);

          const forecastData = await fetchWeatherForecast(
            latitude,
            longitude,
            unit,
          );

          const dailyForecastMap: {[date: string]: any} = {};
          forecastData.list.forEach(({item}: any) => {
            const date = item.dt_txt.split(' ')[0];
            const time = item.dt_txt.split(' ')[1];
            if (!dailyForecastMap[date]) {
              if (time === '12:00:00') {
                dailyForecastMap[date] = item;
              } else {
                dailyForecastMap[date] = item;
              }
            }
          });
          const uniqueForecasts = Object.values(dailyForecastMap).slice(0, 5);
          setForecast(uniqueForecasts);

          const allNews = await fetchTopHeadlines();
          const filtered = filterNewsByWeather(weatherData.main.temp, allNews);
          setNews(filtered);
          setLoading(false);
        },
        error => {
          console.error('Location error:', error);
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    loadData();
  }, [unit]);

  const renderNewsItem = ({item}: any) => (
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
    <ScrollView contentContainerStyle={styles.container}>
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.location}>{weather.name}</Text>
          <Text style={styles.temp}>
            {weather.main.temp}° {unit === 'metric' ? 'C' : 'F'}
          </Text>
          <Text style={styles.condition}>{weather.weather[0].main}</Text>
        </View>
      )}

      {forecast.length > 0 && (
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>
          {forecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDate}>
                {item.dt_txt.split(' ')[0]}
              </Text>
              <Text>{item.main.temp}°</Text>
              <Text>{item.weather[0].main}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Today's Headlines</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="tomato"
          style={{marginTop: 20}}
        />
      ) : news.length > 0 ? (
        <FlatList
          data={news}
          keyExtractor={item => item.url}
          renderItem={renderNewsItem}
          scrollEnabled={false}
          contentContainerStyle={styles.newsList}
        />
      ) : (
        <Text style={{textAlign: 'center', marginTop: 10}}>
          No matching news articles found.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff'},
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
  forecastContainer: {
    backgroundColor: '#eef4fd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    paddingVertical: 6,
  },
  forecastDate: {width: 100},
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
