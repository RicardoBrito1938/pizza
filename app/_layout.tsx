import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/hooks/auth'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	useFonts({
		DMSerifDisplay_400Regular,
		DMSans_400Regular,
	})

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<StatusBar style='auto' />
			<AuthProvider>
				<Slot screenOptions={{ headerShown: false }} />
			</AuthProvider>
		</ThemeProvider>
	)
}
