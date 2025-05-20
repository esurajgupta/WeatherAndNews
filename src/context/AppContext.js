import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [unit, setUnit] = useState('metric');
  const [categories, setCategories] = useState(['general']);

  useEffect(() => {
    const loadSettings = async () => {
      const storedUnit = await AsyncStorage.getItem('unit');
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedUnit) setUnit(storedUnit);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
    };
    loadSettings();
  }, []);

  const saveUnit = async (newUnit) => {
    setUnit(newUnit);
    await AsyncStorage.setItem('unit', newUnit);
  };

  const saveCategories = async (newCategories) => {
    setCategories(newCategories);
    await AsyncStorage.setItem('categories', JSON.stringify(newCategories));
  };

  return (
    <AppContext.Provider value={{ unit, categories, saveUnit, saveCategories }}>
      {children}
    </AppContext.Provider>
  );
};