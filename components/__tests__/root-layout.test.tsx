import { render, fireEvent, waitFor } from '@testing-library/react-native'
import RootLayout from '@/app/index'

// Mock dependencies
jest.mock('expo-linear-gradient', () => {
	const React = require('react')
	const { View } = require('react-native')
	return {
		LinearGradient: jest.fn(({ children, testID }) => {
			return React.createElement(
				View,
				{ testID: testID || 'linear-gradient' },
				children,
			)
		}),
	}
})

// Mock the auth hook
const mockSignIn = jest.fn()
const mockForgotPassword = jest.fn()
jest.mock('@/hooks/auth', () => ({
	useAuth: () => ({
		signIn: mockSignIn,
		isLogging: false,
		forgotPassword: mockForgotPassword,
	}),
}))

// Mock the router (already done in jest.setup.js)
const mockRouterPush = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		push: mockRouterPush,
		back: jest.fn(),
	}),
	SplashScreen: {
		preventAutoHideAsync: jest.fn(),
		hideAsync: jest.fn(),
	},
}))

// Mock react-native-iphone-x-helper
jest.mock('react-native-iphone-x-helper', () => ({
	getBottomSpace: jest.fn(() => 34),
}))

describe('RootLayout (Login Page)', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks()
	})

	it('renders correctly with all elements', () => {
		const { getByText, getByPlaceholderText } = render(<RootLayout />)

		// Check for key UI elements
		expect(getByText('Login')).toBeTruthy()
		expect(getByPlaceholderText('E-mail')).toBeTruthy()
		expect(getByPlaceholderText('Password')).toBeTruthy()
		expect(getByText('Forgot password?')).toBeTruthy()
		expect(getByText('Sign in')).toBeTruthy()
		expect(getByText('Go to Sign Up')).toBeTruthy()
	})

	it('calls signIn with entered credentials', () => {
		const { getByPlaceholderText, getByText } = render(<RootLayout />)

		// Enter email and password
		const emailInput = getByPlaceholderText('E-mail')
		const passwordInput = getByPlaceholderText('Password')
		const signInButton = getByText('Sign in')

		// Type in the inputs
		fireEvent.changeText(emailInput, 'test@example.com')
		fireEvent.changeText(passwordInput, 'password123')

		// Click sign in button
		fireEvent.press(signInButton)

		// Verify the auth function was called with correct credentials
		expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
	})

	it('calls forgotPassword when "Forgot password?" is pressed', () => {
		const { getByText, getByPlaceholderText } = render(<RootLayout />)

		// Enter email
		const emailInput = getByPlaceholderText('E-mail')
		fireEvent.changeText(emailInput, 'test@example.com')

		// Press forgot password
		const forgotPasswordText = getByText('Forgot password?')
		fireEvent.press(forgotPasswordText)

		// Verify forgotPassword was called with the email
		expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com')
	})

	it('navigates to sign-up page when "Go to Sign Up" is pressed', () => {
		const { getByText } = render(<RootLayout />)

		// Press the sign up link
		const signUpLink = getByText('Go to Sign Up')
		fireEvent.press(signUpLink)

		// Verify router.push was called with the right route
		expect(mockRouterPush).toHaveBeenCalledWith('/sign-up')
	})

	it('should use secondary variant for input fields', () => {
		const { getAllByTestId } = render(<RootLayout />)

		// Get all inputs (assuming Input component has testID="input-container")
		const inputs = getAllByTestId('input-container')

		// Verify each input has the secondary variant
		// biome-ignore lint/complexity/noForEach: <explanation>
		inputs.forEach((input) => {
			expect(input.props.variant).toBe('secondary')
		})
	})
})
