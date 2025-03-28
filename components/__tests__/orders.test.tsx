import { render, waitFor } from '@testing-library/react-native'
import Orders from '@/app/(admin)/orders'
import { Alert } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => {
	const originalModule = jest.requireActual('@tanstack/react-query')

	return {
		__esModule: true,
		...originalModule,
		useQuery: jest.fn().mockReturnValue({
			data: mockOrders,
			isLoading: false,
			error: null,
		}),
		useMutation: jest.fn().mockReturnValue({
			mutate: jest.fn(),
			isPending: false,
		}),
		useQueryClient: jest.fn().mockReturnValue({
			invalidateQueries: jest.fn(),
		}),
	}
})

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

// Helper function to render with QueryClient
const renderWithQueryClient = (ui: React.ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
		logger: {
			log: console.log,
			warn: console.warn,
			error: () => {},
		},
	})

	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	)
}

describe('Orders Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders correctly with orders header', async () => {
		const { getByText } = renderWithQueryClient(<Orders />)

		// Use waitFor to ensure state updates are complete
		await waitFor(() => {
			expect(getByText('Orders')).toBeTruthy()
		})
	})

	it('mocks supabase from properly', async () => {
		renderWithQueryClient(<Orders />)

		// Wait for all promises to resolve with a longer timeout
		await waitFor(
			() => {
				// Verify the useQuery hook is called
				expect(require('@tanstack/react-query').useQuery).toHaveBeenCalled()
			},
			{ timeout: 3000 },
		)
	})
})
