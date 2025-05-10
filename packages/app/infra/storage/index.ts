import * as SecureStore from 'expo-secure-store';
import { IStorage } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const mobileStorage: IStorage = {
  setItem: SecureStore.setItemAsync,
  getItem: SecureStore.getItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const crossStorage: IStorage = {
  setItem: AsyncStorage.setItem,
  getItem: AsyncStorage.getItem,
  removeItem: AsyncStorage.removeItem,
};

export const secureStorage = Platform.select({
  native: mobileStorage,
  default: crossStorage,
});

export const storage = crossStorage;
