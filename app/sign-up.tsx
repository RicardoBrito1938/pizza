import { styled } from '@fast-styles/react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
	Alert,
} from 'react-native'
import extendedTheme from '@/styles/extendedTheme'
import { Button } from '@/components/ui/button'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import brandImg from '@/assets/images/brand.png'
import { Checkbox } from '@/components/ui/checkbox'
import { fetchUser, registerUser } from '@/utils/auth'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

const Container = styled(View, {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: extendedTheme.colors.$background,
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
	color: extendedTheme.colors.$secondary900,
	fontSize: 32,
	fontFamily: extendedTheme.fonts.$titleFont,
	marginBottom: 24,
	lineHeight: 40,
	alignSelf: 'flex-start',
})

const Brand = styled(Image, {
	height: 240,
	marginTop: 64,
	width: '100%',

	attributes: {
		resizeMode: 'contain',
		source: brandImg,
	},
})

const InputGroup = styled(View, {
	gap: 4,
})

const ErrorText = styled(Text, {
	color: extendedTheme.tokens.$gradientEnd,
	fontSize: 12,
	alignSelf: 'flex-start',
})

const CheckboxContainer = styled(View, {
	flexDirection: 'row',
	alignItems: 'center',
	marginBottom: 20,
})

const CheckboxLabel = styled(Text, {
	color: extendedTheme.colors.$secondary900,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
	marginLeft: 8,
})

const AvoidingView = styled(KeyboardAvoidingView, {
	flex: 1,
	width: '100%',

	attributes: {
		behavior: Platform.OS === 'ios' ? 'padding' : 'height',
	},
})

const Form = styled(View, {
	width: '100%',
	gap: 12,
})

const signUpSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm Password must be at least 6 characters'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export default function SignUp() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})
	const [isAdmin, setIsAdmin] = useState(false)
	const queryClient = useQueryClient()
	const router = useRouter()

	const registerMutation = useMutation({
		mutationFn: async (data: {
			name: string
			email: string
			password: string
		}) => {
			const result = await registerUser(data.email, data.password, data.name)
			if (!result.success || !result.user) {
				throw new Error('Failed to register user')
			}
			return result.user
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['user'] })
			router.replace('/sign-in')
		},
		onError: (error) => {
			Alert.alert(
				'Registration Error',
				error.message || 'Failed to register user',
			)
		},
	})

	const handleRegister = async (data: {
		name: string
		email: string
		password: string
	}) => {
		registerMutation.mutate(data)
	}

	return (
		<Container>
			<AvoidingView>
				<Content>
					<Brand />
					<Title>Sign Up</Title>
					<Form>
						<Controller
							control={control}
							name='name'
							render={({ field: { onChange, value } }) => (
								<InputGroup>
									<Input.Root
										autoCorrect={false}
										autoCapitalize='words'
										onChangeText={onChange}
										value={value}
									>
										<Input.AnimatedPlaceholder
											backgroundColor={extendedTheme.colors.$background}
											color={extendedTheme.colors.$secondary900}
										>
											Name
										</Input.AnimatedPlaceholder>
										<Input.Trigger />
									</Input.Root>
									{errors.name ? (
										<ErrorText>{errors.name.message}</ErrorText>
									) : (
										<View style={{ height: 12 }} />
									)}
								</InputGroup>
							)}
						/>
						<Controller
							control={control}
							name='email'
							render={({ field: { onChange, value } }) => (
								<InputGroup>
									<Input.Root
										autoCorrect={false}
										autoCapitalize='none'
										onChangeText={onChange}
										value={value}
									>
										<Input.AnimatedPlaceholder
											backgroundColor={extendedTheme.colors.$background}
											color={extendedTheme.colors.$secondary900}
										>
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
										value={value}
										secureTextEntry
									>
										<Input.AnimatedPlaceholder
											backgroundColor={extendedTheme.colors.$background}
											color={extendedTheme.colors.$secondary900}
										>
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
						<Controller
							control={control}
							name='confirmPassword'
							render={({ field: { onChange, value } }) => (
								<InputGroup>
									<Input.Root
										autoCorrect={false}
										autoCapitalize='none'
										onChangeText={onChange}
										value={value}
										// secureTextEntry
									>
										<Input.AnimatedPlaceholder
											backgroundColor={extendedTheme.colors.$background}
											color={extendedTheme.colors.$secondary900}
										>
											Confirm password
										</Input.AnimatedPlaceholder>
										<Input.Trigger />
									</Input.Root>
									{errors.confirmPassword ? (
										<ErrorText>{errors.confirmPassword.message}</ErrorText>
									) : (
										<View style={{ height: 12 }} />
									)}
								</InputGroup>
							)}
						/>
					</Form>
					<CheckboxContainer>
						<Checkbox checked={isAdmin} onPress={() => setIsAdmin(!isAdmin)} />
						<CheckboxLabel>Admin</CheckboxLabel>
					</CheckboxContainer>
					<Button
						title={registerMutation.isPending ? 'Signing up...' : 'Sign Up'}
						variant='primary'
						onPress={handleSubmit(handleRegister)}
						testID='sign-up-button'
						disabled={registerMutation.isPending}
					/>
				</Content>
			</AvoidingView>
		</Container>
	)
}
