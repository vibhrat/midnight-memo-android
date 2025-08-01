
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.72c6dea7dbb84d3eafee2d39b47e068e',
  appName: 'Vertex',
  webDir: 'dist',
  server: {
    url: 'https://72c6dea7-dbb8-4d3e-afee-2d39b47e068e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#DBDBDB",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    Filesystem: {
      ioTimeout: 30000,
      dbPathSuffix: "databases"
    },
    Motion: {
      frequency: 100
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#000000",
    webContentsDebuggingEnabled: true,
  }
};

export default config;
