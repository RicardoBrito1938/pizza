import { render, waitFor } from '@testing-library/react-native'
import Orders from '@/app/(admin)/orders'
import { Alert } from 'react-native'
import { SWRConfig } from 'swr'

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
	single: jest.fn().mockResolvedValue({
		data: { status: 'preparing' },
		error: null,
	}),
	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	then: jest.fn((callback) => Promise.resolve(callback(mockSelectResponse))),
}))

// Mock the fetchOrders SWR fetcher function
jest.mock('@/app/(admin)/orders', () => {
	const originalModule = jest.requireActual('@/app/(admin)/orders')

	// Override the fetchOrders function to immediately return mock data
	const mockedModule = {
		...originalModule,
		__esModule: true,
		default: originalModule.default,
	}

	return mockedModule
})

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
		// Render with SWR config that uses a static cache
		const { getByText } = render(
			<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
				<Orders />
			</SWRConfig>,
		)

		// Use waitFor to ensure state updates are complete
		await waitFor(() => {
			expect(getByText('Orders')).toBeTruthy()
		})
	})

	it('mocks supabase from properly', async () => {
		// Render with SWR config to force bypass caching
		render(
			<SWRConfig
				value={{
					provider: () => new Map(),
					dedupingInterval: 0,
					suspense: false,
				}}
			>
				<Orders />
			</SWRConfig>,
		)

		// Wait for all promises to resolve with a longer timeout
		await waitFor(
			() => {
				// Verify the supabase mock works
				expect(mockFrom).toHaveBeenCalled()
			},
			{ timeout: 3000 },
		)
	})
})
