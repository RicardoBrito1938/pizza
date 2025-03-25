import { render, fireEvent } from '@testing-library/react-native'
import SignUp from '@/app/sign-up'
import { Alert } from 'react-native'

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
const mockRegister = jest.fn()
jest.mock('@/hooks/auth', () => ({
	useAuth: () => ({
		register: mockRegister,
		isLogging: false,
	}),
}))

// Mock react-native-iphone-x-helper
jest.mock('react-native-iphone-x-helper', () => ({
	getBottomSpace: jest.fn(() => 34),
	getStatusBarHeight: jest.fn(() => 44),
}))

// Mock Alert instead of using global.alert
jest.spyOn(Alert, 'alert').mockImplementation(() => 0)

// Mock expo-router
const mockBack = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		back: mockBack,
	}),
}))

describe('SignUp Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders correctly with all form elements', () => {
		const { getByTestId, getByPlaceholderText } = render(<SignUp />)

		// Check header and title
		expect(getByTestId('button-back-container')).toBeTruthy()
		expect(getByTestId('sign-up-button')).toBeTruthy() // Use testID for the button

		// Check form inputs
		expect(getByPlaceholderText('Name')).toBeTruthy()
		expect(getByPlaceholderText('E-mail')).toBeTruthy()
		expect(getByPlaceholderText('Password')).toBeTruthy()
		expect(getByPlaceholderText('Confirm Password')).toBeTruthy()

		// Check admin checkbox
		expect(getByTestId('checkbox-container')).toBeTruthy()
		expect(getByTestId('checkbox-label')).toBeTruthy()
	})

	it('toggles admin checkbox when pressed', () => {
		const { getByTestId } = render(<SignUp />)

		const checkbox = getByTestId('checkbox-input')

		// Initially unchecked
		expect(checkbox.props.accessibilityState.checked).toBeFalsy()

		// Press to check
		fireEvent.press(checkbox)

		// Should be checked
		expect(checkbox.props.accessibilityState.checked).toBeTruthy()

		// Press again to uncheck
		fireEvent.press(checkbox)

		// Should be unchecked again
		expect(checkbox.props.accessibilityState.checked).toBeFalsy()
	})

	it('shows validation error when passwords do not match', () => {
		const { getByTestId, getByPlaceholderText } = render(<SignUp />)

		// Fill form with mismatched passwords
		const nameInput = getByPlaceholderText('Name')
		const emailInput = getByPlaceholderText('E-mail')
		const passwordInput = getByPlaceholderText('Password')
		const confirmPasswordInput = getByPlaceholderText('Confirm Password')

		fireEvent.changeText(nameInput, 'Test User')
		fireEvent.changeText(emailInput, 'test@example.com')
		fireEvent.changeText(passwordInput, 'password123')
		fireEvent.changeText(confirmPasswordInput, 'different123')

		// Try to submit
		const signUpButton = getByTestId('sign-up-button') // Use testID
		fireEvent.press(signUpButton)

		// Check error alert
		expect(Alert.alert).toHaveBeenCalledWith(
			'Validation Error',
			'Passwords do not match',
		)

		// Register should not be called
		expect(mockRegister).not.toHaveBeenCalled()
	})

	it('calls register with form data when passwords match', () => {
		const { getByTestId, getByPlaceholderText } = render(<SignUp />)

		// Fill form with matching passwords
		const nameInput = getByPlaceholderText('Name')
		const emailInput = getByPlaceholderText('E-mail')
		const passwordInput = getByPlaceholderText('Password')
		const confirmPasswordInput = getByPlaceholderText('Confirm Password')
		const checkbox = getByTestId('checkbox-input')

		fireEvent.changeText(nameInput, 'Test User')
		fireEvent.changeText(emailInput, 'test@example.com')
		fireEvent.changeText(passwordInput, 'password123')
		fireEvent.changeText(confirmPasswordInput, 'password123')
		fireEvent.press(checkbox) // Make admin true

		// Submit form
		const signUpButton = getByTestId('sign-up-button')
		fireEvent.press(signUpButton)

		// Check register was called with correct data
		expect(mockRegister).toHaveBeenCalledWith(
			'test@example.com',
			'password123',
			'Test User',
		)
	})

	it('navigates back when back button is pressed', () => {
		const { getByTestId } = render(<SignUp />)

		// Press back button
		const backButton = getByTestId('button-back-container')
		fireEvent.press(backButton)

		// Check navigation back
		expect(mockBack).toHaveBeenCalledTimes(1)
	})
})
