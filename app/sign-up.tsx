import { styled } from '@fast-styles/react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
	SafeAreaView,
	Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import extendedTheme from '@/styles/extendedTheme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	getBottomSpace,
	getStatusBarHeight,
} from 'react-native-iphone-x-helper'
import brandImg from '@/assets/images/brand.png'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { ButtonBack } from '@/components/ui/button-back'
import { fetchUser, registerUser } from '@/utils/auth'
import useSWR from 'swr'
import { router } from 'expo-router'

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

const CheckboxContainer = styled(View, {
	flexDirection: 'row',
	alignItems: 'center',
	marginBottom: 20,
})

const CheckboxLabel = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
	marginLeft: 8,
})

const Header = styled(View, {
	width: '100%',
	paddingHorizontal: 24,
	paddingTop: getStatusBarHeight() + 33,
	marginBottom: 16,
})

export default function SignUp() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const { mutate } = useSWR('/user', fetchUser)

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			Alert.alert('Validation Error', 'Passwords do not match')
			return
		}

		const result = await registerUser(email, password, name)

		if (result.success && result.user) {
			await mutate()
			router.replace('/(admin)/home')
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
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
					<Header>
						<ButtonBack />
					</Header>
					<Content>
						<Brand />
						<Title>Sign Up</Title>
						<Input
							variant='secondary'
							placeholder='Name'
							autoCorrect={false}
							autoCapitalize='words'
							onChangeText={setName}
						/>
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
							// secureTextEntry
						/>
						<Input
							variant='secondary'
							placeholder='Confirm Password'
							autoCorrect={false}
							autoCapitalize='none'
							onChangeText={setConfirmPassword}
							// secureTextEntry
						/>
						<CheckboxContainer>
							<Checkbox
								checked={isAdmin}
								onPress={() => setIsAdmin(!isAdmin)}
							/>
							<CheckboxLabel testID='checkbox-label'>Admin</CheckboxLabel>
						</CheckboxContainer>
						<Button
							title='Sign Up'
							variant='primary'
							onPress={handleRegister}
							testID='sign-up-button'
						/>
					</Content>
				</KeyboardAvoidingView>
			</Container>
		</SafeAreaView>
	)
}
