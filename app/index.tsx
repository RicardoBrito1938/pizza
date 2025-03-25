import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SplashScreen as ExpoSplashScreen, useRouter } from 'expo-router'

import { useAuth } from '@/hooks/auth'
import { supabase } from '@/supabase/supabase'

export default function SplashScreen() {
	const router = useRouter()
	const { user, isLoadingUser, isLogging, setUser, setIsLoadingUser } =
		useAuth()

	useEffect(() => {
		const fetchSessionAndNavigate = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (error) {
				console.error('Failed to fetch session:', error)
				setUser(null)
				setIsLoadingUser(false)
				return
			}

			const session = data.session

			if (!session?.user) {
				setUser(null)
			}

			if (session?.user) {
				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()

				if (profileError) {
					console.error('Error fetching profile:', profileError)
					setUser(null)
				} else {
					setUser({
						id: session.user.id,
						email: session.user.email || null,
						isAdmin: profileData.is_admin,
					})
				}
			} else {
				setUser(null)
			}
			setIsLoadingUser(false)

			if (!isLoadingUser && !isLogging) {
				if (user) {
					router.replace('/(admin)/home')
				} else {
					router.replace('/sign-in')
				}
				ExpoSplashScreen.hideAsync()
			}
		}

		fetchSessionAndNavigate()
	}, [user, isLoadingUser, isLogging, setUser, setIsLoadingUser, router])

	return (
		<View style={styles.container}>
			<Animatable.Text animation='bounceIn' duration={1500} style={styles.text}>
				Welcome to Pizza App!
			</Animatable.Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FF6347',
	},
	text: {
		fontSize: 24,
		color: '#fff',
		fontWeight: 'bold',
	},
})
