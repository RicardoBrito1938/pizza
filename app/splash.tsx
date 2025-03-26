import { useEffect } from 'react'
import { View, Text as RNText } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SplashScreen as ExpoSplashScreen, useRouter } from 'expo-router'
import useSWR from 'swr'
import { supabase } from '@/supabase/supabase'
import { styled } from '@fast-styles/react'

ExpoSplashScreen.hideAsync()

const Container = styled(View, {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'tomato',
})

const Text = styled(Animated.createAnimatedComponent(RNText), {
	fontSize: 24,
	color: '#fff',
	fontWeight: 'bold',
})

// Define the fetchUser function directly in the splash screen
const fetchUser = async () => {
	const { data: session } = await supabase.auth.getSession()
	if (!session?.session?.user) return null

	const { data: profileData, error: profileError } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session.session.user.id)
		.single()

	if (profileError) {
		throw new Error(profileError.message)
	}

	return {
		id: session.session.user.id,
		email: session.session.user.email || null,
		isAdmin: profileData.is_admin,
	}
}

export default function SplashScreen() {
	const router = useRouter()
	const { data: user, error, isLoading } = useSWR('/user', fetchUser)

	useEffect(() => {
		if (isLoading) return

		if (!user || error) {
			router.replace('/sign-in')
		} else {
			router.replace('/(admin)/home')
		}
	}, [user, isLoading, router, error])

	return (
		<Container>
			<Text entering={FadeIn.duration(1500)}>Welcome to Pizza App!</Text>
		</Container>
	)
}
