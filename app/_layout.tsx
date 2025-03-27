import { useFonts } from 'expo-font'
import { Slot, SplashScreen, ScreenProps, Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans'
import { ButtonBack } from '@/components/ui/button-back'
import { MaterialIcons } from '@expo/vector-icons'
import extendedTheme from '@/styles/extendedTheme'

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
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name='sign-up'
					options={{
						headerTitle: '',
						headerShown: true,
						headerLeft: () => (
							<MaterialIcons
								name='chevron-left'
								size={48}
								color={extendedTheme.colors.$secondary900}
								testID='button-back-icon'
								onPress={() => router.back()}
							/>
						),
					}}
				/>
			</Stack>
		</>
	)
}
