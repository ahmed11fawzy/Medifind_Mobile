import { ExpoConfig } from 'expo/config';

// Get the IP address from environment or use default
const localIP = process.env.BASE_URL ? process.env.BASE_URL.replace(/^https?:\/\//, '').split(':')[0] : '192.168.1.57';

const config: ExpoConfig = {
  name: "Medi_Mob",
  slug: "Medi_Mob",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.medifind.mobile"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.medifind.mobile"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "medifind-mobile"
    },
    // Add the local IP address for easier connection
    localIP: localIP
  },
  plugins: [
    "expo-image-picker"
  ]
};

export default config; 