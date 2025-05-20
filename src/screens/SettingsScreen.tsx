import React, {useContext} from 'react';
import {View, Text, Switch, StyleSheet, ScrollView} from 'react-native';
import {AppContext} from '../context/AppContext';

const SettingsScreen = () => {
  const {unit, saveUnit, categories, saveCategories} = useContext(AppContext);

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    saveUnit(newUnit);
  };

  const toggleCategory = cat => {
    const updated = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    saveCategories(updated);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>🌡 Temperature Unit</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>
            {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
          </Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={toggleUnit}
            trackColor={{false: '#ccc', true: '#4e8ef5'}}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>📰 News Categories</Text>
        {['general', 'sports', 'business', 'technology'].map(cat => (
          <View key={cat} style={styles.settingRow}>
            <Text style={styles.label}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
            <Switch
              value={categories.includes(cat)}
              onValueChange={() => toggleCategory(cat)}
              trackColor={{false: '#ccc', true: '#4e8ef5'}}
              thumbColor="#ffffff"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f5f7fa',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
});

export default SettingsScreen;
