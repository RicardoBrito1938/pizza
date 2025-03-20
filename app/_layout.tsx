import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans'

import { AuthProvider } from '@/hooks/auth'
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
	useFonts({
		DMSerifDisplay_400Regular,
		DMSans_400Regular,
	})
	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='(stack)' />
				<Stack.Screen name='(tabs)' />
			</Stack>
		</AuthProvider>
	)
}
