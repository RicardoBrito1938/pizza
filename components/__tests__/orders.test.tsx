import { render, waitFor, act } from '@testing-library/react-native'
import Orders from '@/app/(admin)/orders'
import { Alert } from 'react-native'

// Create mock data
const mockOrders = [
	{
		id: '1',
		pizza: 'Pepperoni',
		size: 'M',
		quantity: 2,
		amount: 25.99,
		status: 'preparing',
		image: 'https://example.com/pizza.jpg',
		table_number: '15',
		waiter_id: 'waiter123',
	},
	{
		id: '2',
		pizza: 'Margherita',
		size: 'L',
		quantity: 1,
		amount: 18.99,
		status: 'prepared',
		image: 'https://example.com/margherita.jpg',
		table_number: '7',
		waiter_id: 'waiter123',
	},
]

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => 0)

// Improved supabase mock with promise resolution
const mockSubscribe = jest.fn().mockReturnThis()
const mockOn = jest.fn().mockReturnThis()

const mockChannel = {
	on: mockOn,
	subscribe: mockSubscribe,
}

// Resolve the promise with mockOrders data
const mockSelectResponse = {
	data: mockOrders,
	error: null,
}

const mockFrom = jest.fn().mockImplementation(() => ({
	select: jest.fn().mockReturnThis(),
	order: jest.fn().mockReturnThis(),
	update: jest.fn().mockReturnThis(),
	eq: jest.fn().mockReturnThis(),
	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	then: jest.fn((callback) => Promise.resolve(callback(mockSelectResponse))),
}))

// This pattern helps avoid the "from is not a function" error
jest.mock('@/supabase/supabase', () => {
	return {
		supabase: {
			from: (...args) => mockFrom(...args),
			channel: () => mockChannel,
			removeChannel: jest.fn(),
		},
	}
})

describe('Orders Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders correctly with orders header', async () => {
		// Use act to wrap the rendering and ensure the component is mounted
		const { getByText } = render(<Orders />)

		// Use waitFor to ensure state updates are complete
		await waitFor(() => {
			expect(getByText('Orders')).toBeTruthy()
		})
	})

	it('mocks supabase from properly', async () => {
		// Use act to wrap the rendering
		render(<Orders />)

		// Wait for all promises to resolve
		await waitFor(() => {
			// Verify the supabase mock works
			expect(mockFrom).toHaveBeenCalled()
		})
	})
})
