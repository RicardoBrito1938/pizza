import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import OrderDetail from '@/app/order/[id]'
import { Alert } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => {
	const originalModule = jest.requireActual('@tanstack/react-query')

	return {
		__esModule: true,
		...originalModule,
		useQuery: jest.fn().mockImplementation(({ queryKey }) => {
			if (queryKey[0] === 'user') {
				return {
					data: { id: 'user123' },
					error: null,
					isLoading: false,
				}
			}

			if (queryKey[0] === 'pizza') {
				return {
					data: {
						id: '1',
						name: 'Pepperoni',
						description: 'Classic pepperoni pizza with cheese',
						photo_url: 'https://example.com/pepperoni.jpg',
						price_size_s: 9.99,
						price_size_m: 14.99,
						price_size_l: 19.99,
						price_sizes: {
							S: 9.99,
							M: 14.99,
							L: 19.99,
						},
					},
				}
			}

			return { data: undefined }
		}),
		useMutation: jest.fn().mockImplementation(() => ({
			mutate: jest.fn(),
			isPending: false,
		})),
		useQueryClient: jest.fn().mockReturnValue({
			invalidateQueries: jest.fn(),
		}),
	}
})

// Mock fetchUser utility
jest.mock('@/utils/auth', () => ({
	fetchUser: jest.fn().mockResolvedValue({ id: 'user123' }),
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

jest.mock('@/supabase/supabase', () => ({
	supabase: {
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

// Helper function to render with query client
const renderWithQueryClient = (ui: React.ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	})

	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	)
}

describe('Order Detail Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders basic UI elements', async () => {
		const { getByTestId, getByText } = renderWithQueryClient(<OrderDetail />)

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
		const { getAllByTestId } = renderWithQueryClient(<OrderDetail />)

		// Wait for the component to load
		await waitFor(() => {
			const radioButtons = getAllByTestId('radio-button-container')
			expect(radioButtons.length).toBe(3)
		})
	})

	it('selects a size when radio button is pressed', async () => {
		const { getAllByTestId, queryByTestId } = renderWithQueryClient(
			<OrderDetail />,
		)

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
		const { getByText } = renderWithQueryClient(<OrderDetail />)

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
		const { getAllByTestId, getByText, getAllByPlaceholderText } =
			renderWithQueryClient(<OrderDetail />)

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
		const { getByTestId } = renderWithQueryClient(<OrderDetail />)

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
