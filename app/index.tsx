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
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import extendedTheme from '@/styles/extendedTheme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import brandImg from '@/assets/images/brand.png'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { SplashScreen, useRouter } from 'expo-router'

const Container = styled(LinearGradient, {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
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

SplashScreen.preventAutoHideAsync()

export default function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { signIn, isLogging, forgotPassword } = useAuth()
	const router = useRouter()

	const handleSignIn = () => {
		signIn(email, password)
	}

	return (
		<Container
			colors={[
				extendedTheme.tokens.$gradientStart,
				extendedTheme.tokens.$gradientEnd,
			]}
			start={{ x: 0, y: 1 }}
			end={{ x: 0.5, y: 0.5 }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ width: '100%' }}
			>
				<Content>
					<Brand />
					<Title>Login</Title>
					<Input
						variant='secondary'
						placeholder='E-mail'
						autoCorrect={false}
						autoCapitalize='none'
						onChangeText={setEmail}
					/>
					<Input
						variant='secondary'
						placeholder='Password'
						autoCorrect={false}
						autoCapitalize='none'
						onChangeText={setPassword}
						secureTextEntry
					/>
					<ForgotPasswordButton onPress={() => forgotPassword(email)}>
						<ForgotPasswordText>Forgot password?</ForgotPasswordText>
					</ForgotPasswordButton>
					<ButtonsContainer>
						<Button
							title='Sign in'
							variant='primary'
							onPress={handleSignIn}
							loading={isLogging}
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
