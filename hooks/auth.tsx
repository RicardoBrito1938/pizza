import {
	createContext,
	useContext,
	useState,
	useEffect,
	type PropsWithChildren,
} from 'react'
import {
	signInWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from 'firebase/auth'
import { Alert } from 'react-native'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { SplashScreen, useRouter } from 'expo-router'

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
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [isLogging, setIsLogging] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const [isLoadingUser, setIsLoadingUser] = useState(true)
	const router = useRouter()

	const signIn = async (email: string, password: string) => {
		if (!email || !password) {
			Alert.alert('Login Error', 'Email and password are required')
			return
		}

		try {
			setIsLogging(true)

			await signInWithEmailAndPassword(auth, email, password)
		} catch (error: any) {
			const errorMessage = error.message || 'Authentication failed'
			Alert.alert('Login Error', errorMessage)
		} finally {
			setIsLogging(false)
		}
	}

	const signOut = async () => {
		try {
			await auth.signOut()
			// Use the absolute path to ensure we're going to the root
			router.navigate('/(stack)')
		} catch (error: any) {
			const errorMessage = error.message || 'Sign out failed'
			Alert.alert('Sign Out Error', errorMessage)
		}
	}

	const forgotPassword = async (email: string) => {
		if (!email) {
			Alert.alert('Forgot Password', 'Email is required')
			return
		}

		try {
			await sendPasswordResetEmail(auth, email)
			Alert.alert('Forgot Password', 'Password reset email sent')
		} catch (error: any) {
			const errorMessage = error.message || 'Password reset failed'
			Alert.alert('Forgot Password', errorMessage)
		}
	}

	// Listen to authentication state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				// User is signed in
				try {
					const docRef = doc(db, 'users', firebaseUser.uid)
					const docSnap = await getDoc(docRef)

					if (docSnap.exists()) {
						const userData = docSnap.data()

						setUser({
							id: firebaseUser.uid,
							email: firebaseUser.email,
							isAdmin: !!userData?.isAdmin,
						})
					} else {
						setUser({
							id: firebaseUser.uid,
							email: firebaseUser.email,
							isAdmin: false,
						})
					}
				} catch (error) {
					console.error('Error fetching user data:', error)
				}
			} else {
				setUser(null)
			}

			setIsLoadingUser(false)
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		if (!isLoadingUser && !isLogging) {
			if (user) {
				router.replace('/(tabs)')
			} else {
				router.replace('/(stack)')
			}
			SplashScreen.hideAsync()
		}
	}, [user, router, isLoadingUser, isLogging])

	return (
		<AuthContext.Provider
			value={{
				signOut,
				signIn,
				isLogging,
				user,
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
