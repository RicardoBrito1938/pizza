import { Alert } from 'react-native'
import { supabase } from '@/supabase/supabase'

type User = {
	id: string
	email: string | null
	isAdmin: boolean
}

export const registerUser = async (
	email: string,
	password: string,
	name = '',
	isAdmin = false,
): Promise<{ success: boolean; user?: User | null; error?: string }> => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	})

	if (error) {
		Alert.alert('Registration Error', error.message || 'Registration failed')
		return { success: false, error: error.message }
	}

	const supabaseUser = data?.user

	if (!supabaseUser) {
		return { success: false, user: null }
	}

	Alert.alert(
		'Email Confirmation Required',
		'A confirmation email has been sent to your email address. Please confirm your email to complete the registration process.',
	)

	// Map Supabase user to custom User type
	const user: User = {
		id: supabaseUser.id,
		email: supabaseUser.email || null,
		isAdmin,
	}

	return { success: true, user }
}

export const fetchUser = async () => {
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
