import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SignUp from '@/app/sign-up'
import { Alert } from 'react-native'

// Mock the registerUser function
const mockRegisterUser = jest.fn().mockResolvedValue({
	success: true,
	user: { id: 'new-user-123' },
})

// Mock SWR's mutate function
const mockMutate = jest.fn().mockResolvedValue(undefined)

// Set up mocks before importing the component
jest.mock('@/utils/auth', () => ({
	fetchUser: jest.fn(),
	registerUser: jest
		.fn()
		.mockImplementation((...args) => mockRegisterUser(...args)),
}))

// Mock SWR simply
jest.mock('swr', () => {
	return {
		__esModule: true,
		default: () => ({ data: null, error: null, isLoading: false }),
		mutate: mockMutate,
	}
})

// Mock router functions
const mockRouterBack = jest.fn()
const mockRouterReplace = jest.fn()

// Create a simple router mock
jest.mock('expo-router', () => ({
	useRouter: () => ({
		back: mockRouterBack,
		replace: mockRouterReplace,
	}),
}))

// Mock Alert
jest.spyOn(Alert, 'alert')

describe('SignUp Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders form elements', () => {
		const { getByTestId, getByPlaceholderText } = render(<SignUp />)

		// Check if basic UI elements are rendered
		expect(getByTestId('button-back-container')).toBeTruthy()
		expect(getByPlaceholderText('Name')).toBeTruthy()
		expect(getByPlaceholderText('E-mail')).toBeTruthy()
		expect(getByPlaceholderText('Password')).toBeTruthy()
		expect(getByPlaceholderText('Confirm Password')).toBeTruthy()
		expect(getByTestId('checkbox-container')).toBeTruthy()
		expect(getByTestId('sign-up-button')).toBeTruthy()
	})

	it('toggles admin checkbox', () => {
		const { getByTestId } = render(<SignUp />)

		const checkbox = getByTestId('checkbox-input')

		// Initial state should be unchecked
		expect(checkbox.props.accessibilityState.checked).toBeFalsy()

		// Press to check
		fireEvent.press(checkbox)
		expect(checkbox.props.accessibilityState.checked).toBeTruthy()

		// Press again to uncheck
		fireEvent.press(checkbox)
		expect(checkbox.props.accessibilityState.checked).toBeFalsy()
	})

	it('shows error for non-matching passwords', () => {
		const { getByPlaceholderText, getByTestId } = render(<SignUp />)

		// Fill form with non-matching passwords
		fireEvent.changeText(getByPlaceholderText('Name'), 'Test User')
		fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com')
		fireEvent.changeText(getByPlaceholderText('Password'), 'password123')
		fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different')

		// Submit form
		fireEvent.press(getByTestId('sign-up-button'))

		// Check if error alert is shown
		expect(Alert.alert).toHaveBeenCalledWith(
			'Validation Error',
			'Passwords do not match',
		)
	})

	it('navigates back when back button is pressed', () => {
		const { getByTestId } = render(<SignUp />)

		fireEvent.press(getByTestId('button-back-container'))

		expect(mockRouterBack).toHaveBeenCalledTimes(1)
	})
})
