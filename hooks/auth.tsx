import {
	createContext,
	useContext,
	useState,
	useEffect,
	type PropsWithChildren,
} from 'react'
import { Alert } from 'react-native'
import { SplashScreen, useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'

type User = {
	id: string
	email: string | null
	isAdmin: boolean
}

type AuthContextData = {
	signIn: (email: string, password: string) => void
	signOut: () => void
	isLogging: boolean
	user: User | null
	isLoadingUser: boolean
	forgotPassword: (email: string) => void
	setUser: (user: User | null) => void
	register: (
		email: string,
		password: string,
		name?: string,
	) => Promise<{ success: boolean; user?: User | null; error?: string }>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [isLogging, setIsLogging] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const [isLoadingUser, setIsLoadingUser] = useState(true)
	const router = useRouter()

	const signIn = async (email: string, password: string) => {
		setIsLogging(true)

		if (!email || !password) {
			Alert.alert('Login Error', 'Email and password are required')
			return
		}

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			})

		if (authError) {
			Alert.alert('Login Error', authError.message || 'Authentication failed')
			setIsLogging(false)
			return
		}

		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', authData.user.id)
			.single()

		if (profileError) {
			Alert.alert(
				'Login Error',
				profileError.message || 'Authentication failed',
			)
			setIsLogging(false)
			return
		}

		setUser({
			id: authData.user.id,
			email: authData.user.email || null,
			isAdmin: profileData.is_admin,
		})
		setIsLogging(false)
	}

	const signOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			Alert.alert('Sign Out Error', error.message || 'Sign out failed')
			return
		}
		router.navigate('/')
	}

	const forgotPassword = async (email: string) => {
		if (!email) {
			Alert.alert('Forgot Password', 'Email is required')
			return
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email)
		if (error) {
			Alert.alert('Forgot Password', error.message || 'Password reset failed')
			return
		}

		Alert.alert('Forgot Password', 'Password reset email sent')
	}

	const register = async (
		email: string,
		password: string,
		name = '',
	): Promise<{ success: boolean; user?: User | null; error?: string }> => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		})

		if (error) {
			Alert.alert('Registration Error', error.message || 'Registration failed')
			return { success: false, error: error.message }
		}

		const supabaseUser = data.user
		if (supabaseUser) {
			Alert.alert(
				'Email Confirmation Required',
				'A confirmation email has been sent to your email address. Please confirm your email to complete the registration process.',
			)

			// Map Supabase user to custom User type
			const user: User = {
				id: supabaseUser.id,
				email: supabaseUser.email || null,
				isAdmin: false,
			}

			return { success: true, user }
		}

		return { success: false, user: null }
	}

	useEffect(() => {
		const fetchSession = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (error) {
				console.error('Failed to fetch session:', error)
				setUser(null)
				setIsLoadingUser(false)
				return
			}

			const session = data.session
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
		}

		fetchSession()
	}, [])

	useEffect(() => {
		if (user && !isLoadingUser && !isLogging) {
			router.replace('/(admin)/home')
			SplashScreen.hideAsync()
		}
	}, [user, router, isLoadingUser, isLogging])

	return (
		<AuthContext.Provider
			value={{
				signOut,
				signIn,
				register,
				isLogging,
				user,
				setUser,
				isLoadingUser,
				forgotPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
