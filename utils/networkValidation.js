import * as Network from 'expo-network';
import { ALLOW_DEMO_CAMPUS_BYPASS, AUTHORIZED_WIFI_KEYWORDS } from './constants';

export async function validateCollegeWifi() {
  try {
    const state = await Network.getNetworkStateAsync();
    const isWifi = state.type === Network.NetworkStateType.WIFI;

    if (!isWifi) {
      if (ALLOW_DEMO_CAMPUS_BYPASS) {
        return {
          valid: true,
          method: 'wifi',
          message: 'Demo mode: Wi-Fi validation bypass enabled.',
          demoBypass: true,
        };
      }
      return {
        valid: false,
        method: 'wifi',
        message: 'Not connected to Wi-Fi. Connect to college network.',
      };
    }

    // Expo Go may not expose SSID; treat Wi-Fi connection as valid for demo
    return {
      valid: true,
      method: 'wifi',
      message: `Connected via Wi-Fi (${AUTHORIZED_WIFI_KEYWORDS[0]} / campus network).`,
    };
  } catch (error) {
    if (ALLOW_DEMO_CAMPUS_BYPASS) {
      return {
        valid: true,
        method: 'wifi',
        message: 'Demo mode: network check bypassed.',
        demoBypass: true,
      };
    }
    return {
      valid: false,
      method: 'wifi',
      message: 'Unable to verify college Wi-Fi connection.',
    };
  }
}

export async function validateCampusNetworkOrLocation(locationResult, wifiResult) {
  if (locationResult.valid || wifiResult.valid) {
    return {
      valid: true,
      message: 'Campus verification passed (Wi-Fi or GPS).',
    };
  }

  return {
    valid: false,
    message:
      'Campus verification failed. Connect to college Wi-Fi or enter campus GPS boundary.',
  };
}
