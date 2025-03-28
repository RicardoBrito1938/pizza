import { useFonts } from 'expo-font'
import { SplashScreen, Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans'
import { MaterialIcons } from '@expo/vector-icons'
import extendedTheme from '@/styles/extendedTheme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		DMSerifDisplay_400Regular,
		DMSans_400Regular,
		DMSans_700Bold,
	})

	const [queryClient] = useState(() => new QueryClient())

	if (!fontsLoaded) {
		return null
	}

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar style='auto' />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name='sign-up'
					options={{
						headerTitle: '',
						headerShown: true,
						headerTransparent: true,
						headerLeft: () => (
							<MaterialIcons
								name='chevron-left'
								size={36}
								color={extendedTheme.colors.$secondary900}
								testID='button-back-icon'
								onPress={() => router.back()}
							/>
						),
					}}
				/>
			</Stack>
		</QueryClientProvider>
	)
}
