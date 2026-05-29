import * as Location from 'expo-location';
import {
  ALLOW_DEMO_CAMPUS_BYPASS,
  CAMPUS_LOCATION,
} from './constants';

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export async function validateCampusLocation() {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      if (ALLOW_DEMO_CAMPUS_BYPASS) {
        return {
          valid: true,
          method: 'gps',
          message: 'Demo mode: location permission bypass enabled.',
          demoBypass: true,
        };
      }
      return {
        valid: false,
        method: 'gps',
        message: 'Location permission denied. Enable GPS for campus verification.',
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const distance = getDistanceMeters(
      position.coords.latitude,
      position.coords.longitude,
      CAMPUS_LOCATION.latitude,
      CAMPUS_LOCATION.longitude
    );

    const valid = distance <= CAMPUS_LOCATION.radiusMeters;
    return {
      valid,
      method: 'gps',
      distanceMeters: Math.round(distance),
      message: valid
        ? 'Inside authorized college GPS boundary.'
        : `Outside campus boundary (${Math.round(distance)}m away).`,
    };
  } catch (error) {
    if (ALLOW_DEMO_CAMPUS_BYPASS) {
      return {
        valid: true,
        method: 'gps',
        message: 'Demo mode: GPS check bypassed in Expo Go.',
        demoBypass: true,
      };
    }
    return {
      valid: false,
      method: 'gps',
      message: 'Unable to verify GPS location.',
    };
  }
}
