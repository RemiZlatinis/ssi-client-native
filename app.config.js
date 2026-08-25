export default {
  expo: {
    name: "Service Status Indicator",
    slug: "ssi-client-mobile",
    owner: "remizlatinis",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ssiclientmobile",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      userInterfaceStyle: "automatic",
      bundleIdentifier: "com.remizlatinis.ssiclientmobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#e8f2f7",
        dark: {
          backgroundColor: "#091620",
        },
      },
      package: "com.remizlatinis.ssiclientmobile",
      userInterfaceStyle: "automatic",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "expo-image",
      "expo-status-bar",
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      "expo-notifications",
      "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          resizeMode: "contain",
          backgroundColor: "#e8f2f7",
          imageWidth: 200,
          dark: {
            image: "./assets/images/splash-icon.png",
            backgroundColor: "#091620",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "137fcc2e-85a4-4759-9045-3652b057a972",
      },
    },
  },
};
