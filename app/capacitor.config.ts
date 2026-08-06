import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.pomogayka.rozkazhy",
  appName: "Розкажи",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#FEF6E4",
    },
    CapacitorSQLite: {
      androidIsEncryption: false,
    },
  },
};

export default config;
