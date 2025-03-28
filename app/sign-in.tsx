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
import extendedTheme from '@/styles/extendedTheme'
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
import { Input } from '@/components/ui/input'

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

const AvoidingView = styled(KeyboardAvoidingView, {
	flex: 1,
	width: '100%',

	attributes: {
		behavior: Platform.OS === 'ios' ? 'padding' : 'height',
	},
})

const ErrorText = styled(Text, {
	color: 'gold',
	fontSize: 12,
	alignSelf: 'flex-start',
})

const InputGroup = styled(View, {
	gap: 4,
})

const signInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Form = styled(View, {
	width: '100%',
	gap: 12,
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
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (authError) {
			Alert.alert('Login Error', authError.message || 'Authentication failed')
			setIsLoading(false)
			return
		}

		await mutate()
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
			<AvoidingView>
				<Content>
					<Brand />
					<Title>Login</Title>

					<Form>
						<Controller
							control={control}
							name='email'
							render={({ field: { onChange, value } }) => (
								<InputGroup>
									<Input.Root
										autoCorrect={false}
										autoCapitalize='none'
										onChangeText={onChange}
										cursorColor={extendedTheme.colors.$title}
										value={value}
										style={{
											color: extendedTheme.colors.$title,
										}}
									>
										<Input.AnimatedPlaceholder>
											E-mail
										</Input.AnimatedPlaceholder>
										<Input.Trigger />
									</Input.Root>
									{errors.email ? (
										<ErrorText>{errors.email.message}</ErrorText>
									) : (
										<View style={{ height: 12 }} />
									)}
								</InputGroup>
							)}
						/>
						<Controller
							control={control}
							name='password'
							render={({ field: { onChange, value } }) => (
								<InputGroup>
									<Input.Root
										autoCorrect={false}
										autoCapitalize='none'
										onChangeText={onChange}
										cursorColor={extendedTheme.colors.$title}
										value={value}
										secureTextEntry
										style={{
											color: extendedTheme.colors.$title,
										}}
									>
										<Input.AnimatedPlaceholder>
											Password
										</Input.AnimatedPlaceholder>
										<Input.Trigger />
									</Input.Root>
									{errors.password ? (
										<ErrorText>{errors.password.message}</ErrorText>
									) : (
										<View style={{ height: 12 }} />
									)}
								</InputGroup>
							)}
						/>
						<ForgotPasswordButton
							onPress={() => handleForgotPassword(getValues('email'))}
						>
							<ForgotPasswordText>Forgot password?</ForgotPasswordText>
						</ForgotPasswordButton>
					</Form>
					<ButtonsContainer>
						<Button
							title='Sign in'
							variant='secondary'
							onPress={handleSubmit(handleSignIn)}
							loading={isLoading}
						/>
					</ButtonsContainer>
					<Pressable onPress={() => router.push('/sign-up')}>
						<SignUpText>Go to Sign Up</SignUpText>
					</Pressable>
				</Content>
			</AvoidingView>
		</Container>
	)
}
