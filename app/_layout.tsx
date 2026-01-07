import {
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
} from "@expo-google-fonts/josefin-sans";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { colors } from "../constants/colors";
import { AuthProvider } from "../contexts/AuthContext";
import { Logger } from "../utils/logger";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Initialize console patch so all console.* are captured by Logger
    try {
      Logger.initConsolePatch();
    } catch (e) {
      // ignore
    }

    // Capture unhandled promise rejections (web)
    try {
      if (typeof window !== 'undefined' && (window as any).addEventListener) {
        (window as any).addEventListener('unhandledrejection', (e: any) => {
          void Logger.error('Unhandled promise rejection', { reason: e?.reason ?? e });
        });

        (window as any).addEventListener('error', (ev: any) => {
          void Logger.error('Uncaught error', { message: ev?.message, filename: ev?.filename, lineno: ev?.lineno, colno: ev?.colno });
        });
      }
    } catch (e) {
      // ignore
    }

    // React Native global handler (if available)
    try {
      const globalAny: any = global as any;
      if (globalAny.ErrorUtils && typeof globalAny.ErrorUtils.setGlobalHandler === 'function') {
        const prev = globalAny.ErrorUtils.getGlobalHandler && globalAny.ErrorUtils.getGlobalHandler();
        globalAny.ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
          void Logger.error('Uncaught JS error', { error: error?.message ?? error, isFatal });
          if (prev) prev(error, isFatal);
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
        initialRouteName="index"
      />
    </AuthProvider>
  );
}
