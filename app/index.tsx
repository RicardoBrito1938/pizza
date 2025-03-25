import { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SplashScreen as ExpoSplashScreen, useRouter } from 'expo-router'
import { useAuth } from '@/hooks/auth'
import { supabase } from '@/supabase/supabase'
import { styled } from '@fast-styles/react'

ExpoSplashScreen.hideAsync()

const Container = styled(View, {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'tomato',
})

const Text = styled(Animatable.Text, {
	fontSize: 24,
	color: '#fff',
	fontWeight: 'bold',

	attributes: {
		animation: 'bounceIn',
		duration: 1500,
	},
})

export default function SplashScreen() {
	const router = useRouter()
	const { setUser } = useAuth()

	const fetchSessionAndNavigate = useCallback(async () => {
		const { data, error } = await supabase.auth.getSession()
		if (error || !data?.session?.user) {
			console.error('Failed to fetch session:', error)
			return router.replace('/sign-in')
		}

		const session = data.session

		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single()

		if (profileError) {
			console.error('Error fetching profile:', profileError)
			return router.replace('/sign-in')
		}
		setUser({
			id: session.user.id,
			email: session.user.email || null,
			isAdmin: profileData.is_admin,
		})
		router.replace('/(admin)/home')
	}, [setUser, router])

	useEffect(() => {
		fetchSessionAndNavigate()
	}, [fetchSessionAndNavigate])

	return (
		<Container>
			<Text>Welcome to Pizza App!</Text>
		</Container>
	)
}
