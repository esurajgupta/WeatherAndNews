import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const { unit, saveUnit, categories, saveCategories } = useContext(AppContext);

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    saveUnit(newUnit);
  };

  const toggleCategory = (cat) => {
    const updated = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    saveCategories(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Temperature Unit</Text>
      <View style={styles.row}>
        <Text>{unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</Text>
        <Switch value={unit === 'imperial'} onValueChange={toggleUnit} />
      </View>

      <Text style={styles.header}>News Categories</Text>
      {['general', 'sports', 'business', 'technology'].map(cat => (
        <View key={cat} style={styles.row}>
          <Text>{cat}</Text>
          <Switch
            value={categories.includes(cat)}
            onValueChange={() => toggleCategory(cat)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
});

export default SettingsScreen;