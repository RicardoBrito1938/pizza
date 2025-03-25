import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { AuthProvider } from '@/hooks/auth'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		DMSerifDisplay_400Regular,
		DMSans_400Regular,
	})

	if (!fontsLoaded) {
		return null
	}

	return (
		<AuthProvider>
			<Slot screenOptions={{ headerShown: false }} />
		</AuthProvider>
	)
}
