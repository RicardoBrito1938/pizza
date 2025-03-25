import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import OrderDetail from '@/app/order/[id]'
import { Alert } from 'react-native'

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
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		from: (table: any) => mockFrom(table),
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

	it('renders basic UI elements', async () => {
		const { getByTestId, getByText } = render(<OrderDetail />)

		// Wait for the component to load
		await waitFor(() => {
			expect(getByTestId('button-back-container')).toBeTruthy()
			expect(getByText('Select your size')).toBeTruthy()
			expect(getByText('Table Number')).toBeTruthy()
			expect(getByText('Quantity')).toBeTruthy()
			expect(getByText('Add')).toBeTruthy()
		})
	})

	it('shows radio buttons for sizes', async () => {
		const { getAllByTestId } = render(<OrderDetail />)

		// Wait for the component to load
		await waitFor(() => {
			const radioButtons = getAllByTestId('radio-button-container')
			expect(radioButtons.length).toBe(3)
		})
	})

	it('selects a size when radio button is pressed', async () => {
		const { getAllByTestId, queryByTestId } = render(<OrderDetail />)

		// Wait for the component to load
		await waitFor(() => {
			expect(queryByTestId('radio-selected-indicator')).toBeFalsy()
		})

		// Press Medium size
		const radioButtons = getAllByTestId('radio-button-container')
		act(() => {
			fireEvent.press(radioButtons[1])
		})

		// Wait for the selection indicator to appear
		await waitFor(() => {
			expect(queryByTestId('radio-selected-indicator')).toBeTruthy()
		})
	})

	it('shows validation when submitting with missing fields', async () => {
		const { getByText } = render(<OrderDetail />)

		// Try to submit without filling anything
		act(() => {
			fireEvent.press(getByText('Add'))
		})

		// Wait for the validation alert
		await waitFor(() => {
			expect(Alert.alert).toHaveBeenCalledWith('Order', 'Select a size')
		})
	})

	it('calls supabase when submitting order with all fields', async () => {
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

		// Wait for the supabase call
		await waitFor(() => {
			expect(mockFrom).toHaveBeenCalledWith('orders')
			expect(mockInsert).toHaveBeenCalled()
		})
	})

	it('goes back when back button is pressed', async () => {
		const { getByTestId } = render(<OrderDetail />)

		// Press back button
		act(() => {
			fireEvent.press(getByTestId('button-back-container'))
		})

		// Wait for the back function to be called
		await waitFor(() => {
			expect(mockRouterBack).toHaveBeenCalledTimes(1)
		})
	})
})
