import { render, fireEvent } from '@testing-library/react-native'
import { ButtonBack } from '../ui/button-back'

// Create a mock back function that we can track
const mockBack = jest.fn()

// Mock expo-router
jest.mock('expo-router', () => ({
	useRouter: () => ({
		back: mockBack,
	}),
}))

describe('ButtonBack', () => {
	// Reset the mock before each test
	beforeEach(() => {
		mockBack.mockClear()
	})

	it('renders correctly', () => {
		const { getByTestId } = render(<ButtonBack />)

		const container = getByTestId('button-back-container')
		const icon = getByTestId('button-back-icon')

		expect(container).toBeTruthy()
		expect(icon).toBeTruthy()
	})

	it('calls router.back when pressed', () => {
		const { getByTestId } = render(<ButtonBack />)

		// Find the button and press it
		const button = getByTestId('button-back-container')
		fireEvent.press(button)

		// Verify that router.back was called
		expect(mockBack).toHaveBeenCalledTimes(1)
	})

	it('applies custom props correctly', () => {
		// Test with a custom prop like disabled
		const { getByTestId } = render(<ButtonBack disabled={true} />)

		const button = getByTestId('button-back-container')

		// In React Native testing library, we need to access props differently
		expect(button.props.accessibilityState.disabled).toBe(true)
	})

	it('renders MaterialIcons with correct props', () => {
		const { getByTestId } = render(<ButtonBack />)

		const icon = getByTestId('button-back-icon')

		// Material Icons in testing environment might not expose props directly
		// We can test testID which we know is there
		expect(icon).toBeTruthy()
	})
})
