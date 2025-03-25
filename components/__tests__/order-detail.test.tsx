import { render, fireEvent, act } from '@testing-library/react-native'
import OrderDetail from '@/app/order/[id]'
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
jest.mock('@/hooks/auth', () => ({
	useAuth: () => ({
		user: { id: 'user123' },
	}),
}))

// Mock supabase with improved implementation
const mockPizza = {
	id: '1',
	name: 'Pepperoni',
	description: 'Classic pepperoni pizza with cheese',
	photo_url: 'https://example.com/pepperoni.jpg',
	price_size_s: 9.99,
	price_size_m: 14.99,
	price_size_l: 19.99,
}

// Mock insert operation to avoid "from is not a function" errors
const mockInsert = jest.fn().mockReturnValue({ error: null })

// Mock select operation
const mockSelect = jest.fn().mockImplementation(() => {
	return {
		eq: jest.fn().mockReturnValue({
			single: jest.fn().mockReturnValue({
				data: mockPizza,
				error: null,
			}),
		}),
	}
})

// Better mock implementation of supabase
const mockFrom = jest.fn().mockImplementation((table) => {
	if (table === 'orders') {
		return { insert: mockInsert }
	}
	return { select: mockSelect }
})

jest.mock('@/utils/supabase', () => ({
	supabase: {
		from: (table) => mockFrom(table),
	},
}))

// Mock expo-router
const mockRouterPush = jest.fn()
const mockRouterBack = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		push: mockRouterPush,
		back: mockRouterBack,
	}),
	useLocalSearchParams: () => ({
		id: '1',
	}),
}))

// Mock react-native-iphone-x-helper
jest.mock('react-native-iphone-x-helper', () => ({
	getStatusBarHeight: jest.fn(() => 44),
}))

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => 0)

// Mock pizza types
jest.mock('@/utils/pizza-types', () => ({
	PIZZA_TYPES: [
		{ id: 'S', name: 'Small' },
		{ id: 'M', name: 'Medium' },
		{ id: 'L', name: 'Large' },
	],
}))

describe('Order Detail Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders basic UI elements', () => {
		const { getByTestId, getByText } = render(<OrderDetail />)

		// Check for basic UI elements
		expect(getByTestId('button-back-container')).toBeTruthy()
		expect(getByText('Select your size')).toBeTruthy()
		expect(getByText('Table Number')).toBeTruthy()
		expect(getByText('Quantity')).toBeTruthy()
		expect(getByText('Add')).toBeTruthy()
	})

	it('shows radio buttons for sizes', () => {
		const { getAllByTestId } = render(<OrderDetail />)

		const radioButtons = getAllByTestId('radio-button-container')
		expect(radioButtons.length).toBe(3)
	})

	it('selects a size when radio button is pressed', () => {
		const { getAllByTestId, queryByTestId } = render(<OrderDetail />)

		// Initially no selection indicator
		expect(queryByTestId('radio-selected-indicator')).toBeFalsy()

		// Press Medium size
		const radioButtons = getAllByTestId('radio-button-container')
		act(() => {
			fireEvent.press(radioButtons[1])
		})

		// Selection indicator should appear
		expect(queryByTestId('radio-selected-indicator')).toBeTruthy()
	})

	it('shows validation when submitting with missing fields', () => {
		const { getByText } = render(<OrderDetail />)

		// Try to submit without filling anything
		act(() => {
			fireEvent.press(getByText('Add'))
		})

		// Should show validation alert
		expect(Alert.alert).toHaveBeenCalledWith('Order', 'Select a size')
	})

	it('calls supabase when submitting order with all fields', () => {
		const { getAllByTestId, getByText, getAllByPlaceholderText } = render(
			<OrderDetail />,
		)

		// Select medium size
		const radioButtons = getAllByTestId('radio-button-container')
		act(() => {
			fireEvent.press(radioButtons[1])
		})

		// Enter table number and quantity
		const tableInput = getAllByPlaceholderText('Table Number')[0]
		const quantityInput = getAllByPlaceholderText('Quantity')[0]

		act(() => {
			fireEvent.changeText(tableInput, '7')
			fireEvent.changeText(quantityInput, '2')
		})

		// Submit the order
		act(() => {
			fireEvent.press(getByText('Add'))
		})

		// Check that supabase.from was called with 'orders'
		expect(mockFrom).toHaveBeenCalledWith('orders')
		expect(mockInsert).toHaveBeenCalled()
	})

	it('goes back when back button is pressed', () => {
		const { getByTestId } = render(<OrderDetail />)

		// Press back button
		act(() => {
			fireEvent.press(getByTestId('button-back-container'))
		})

		// Check back function was called
		expect(mockRouterBack).toHaveBeenCalledTimes(1)
	})
})
