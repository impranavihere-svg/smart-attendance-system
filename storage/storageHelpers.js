import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJson(key, fallbackValue) {
  const rawValue = await AsyncStorage.getItem(key);
  return rawValue ? JSON.parse(rawValue) : fallbackValue;
}

export async function writeJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
