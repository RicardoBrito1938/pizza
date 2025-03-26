import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		DMSerifDisplay_400Regular,
		DMSans_400Regular,
		DMSans_700Bold,
	})

	if (!fontsLoaded) {
		return null
	}

	return (
		<>
			<StatusBar style='auto' />
			<Slot screenOptions={{ headerShown: false }} />
		</>
	)
}
