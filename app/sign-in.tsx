import 'react-native-url-polyfill/auto'
import { styled } from '@fast-styles/react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
	Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import extendedTheme from '@/styles/extendedTheme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import brandImg from '@/assets/images/brand.png'
import { useState } from 'react'
import { SplashScreen, useRouter } from 'expo-router'
import { supabase } from '@/supabase/supabase'
import useSWR from 'swr'
import { fetchUser } from '@/utils/auth'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const Container = styled(View, {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: extendedTheme.tokens.$gradientStart,
})

const Content = styled(ScrollView, {
	width: '100%',
	paddingHorizontal: 32,

	attributes: {
		showsVerticalScrollIndicator: false,
		contentContainerStyle: {
			paddingBottom: getBottomSpace() + 48,
		},
	},
})

const Title = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 32,
	fontFamily: extendedTheme.fonts.$titleFont,
	marginBottom: 24,
	lineHeight: 40,
	alignSelf: 'flex-start',
})

const Brand = styled(Image, {
	height: 340,
	marginTop: 64,
	marginBottom: 32,

	attributes: {
		resizeMode: 'contain',
		source: brandImg,
	},
})

const ForgotPasswordButton = styled(Pressable, {
	alignSelf: 'flex-end',
	marginBottom: 20,
})

const ForgotPasswordText = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
})

const ButtonsContainer = styled(View, {
	gap: 4,
})

const SignUpText = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
	textDecorationLine: 'underline',
	textAlign: 'center',
	marginTop: 16,
})

const signInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

SplashScreen.preventAutoHideAsync()

export default function SignIn() {
	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const { mutate } = useSWR('/user', fetchUser)

	const handleSignIn = async (data: { email: string; password: string }) => {
		setIsLoading(true)

		const { email, password } = data
		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			})

		if (authError) {
			Alert.alert('Login Error', authError.message || 'Authentication failed')
			setIsLoading(false)
			return
		}

		await mutate() // Revalidate user data with SWR
		setIsLoading(false)
		router.navigate('/(admin)/home')
	}

	const handleForgotPassword = async (email: string) => {
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

	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ width: '100%' }}
			>
				<Content>
					<Brand />
					<Title>Login</Title>
					<Controller
						control={control}
						name='email'
						render={({ field: { onChange, value } }) => (
							<Input
								variant='secondary'
								animatedPlaceholder='E-mail'
								autoCorrect={false}
								autoCapitalize='none'
								onChangeText={onChange}
								cursorColor={extendedTheme.colors.$title}
								value={value}
							/>
						)}
					/>
					<Controller
						control={control}
						name='password'
						render={({ field: { onChange, value } }) => (
							<Input
								variant='secondary'
								animatedPlaceholder='Password'
								autoCorrect={false}
								autoCapitalize='none'
								onChangeText={onChange}
								cursorColor={extendedTheme.colors.$title}
								value={value}
								secureTextEntry
							/>
						)}
					/>
					<ForgotPasswordButton
						onPress={() => handleForgotPassword(getValues('email'))}
					>
						<ForgotPasswordText>Forgot password?</ForgotPasswordText>
					</ForgotPasswordButton>
					<ButtonsContainer>
						<Button
							title='Sign in'
							variant='primary'
							onPress={handleSubmit(handleSignIn)}
							loading={isLoading}
						/>
					</ButtonsContainer>
					<Pressable onPress={() => router.push('/sign-up')}>
						<SignUpText>Go to Sign Up</SignUpText>
					</Pressable>
				</Content>
			</KeyboardAvoidingView>
		</Container>
	)
}
