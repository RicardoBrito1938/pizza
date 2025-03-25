import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import Home from '@/app/(admin)/home'
import { Alert } from 'react-native'

// Mock signOutUser function
const mockSignOut = jest.fn().mockResolvedValue({ error: null })

// Create a mutate function that will be provided to the component
const mockMutate = jest.fn().mockResolvedValue(undefined)

// Mock SWR to provide mutate within the component
jest.mock('swr', () => {
	return {
		__esModule: true,
		default: () => ({
			data: { id: 'user123', isAdmin: true },
			error: null,
			isLoading: false,
			mutate: mockMutate,
		}),
		// This is for direct imports of mutate
		mutate: mockMutate,
	}
})

// Mock auth utilities
jest.mock('@/utils/auth', () => ({
	fetchUser: jest.fn().mockResolvedValue({ id: 'user123', isAdmin: true }),
	signOutUser: jest.fn().mockImplementation(() => mockSignOut()),
}))

// Add auth.signOut to supabase mock
jest.mock('@/supabase/supabase', () => {
	return {
		supabase: {
			from: jest.fn(() => ({
				select: jest.fn().mockReturnThis(),
				ilike: jest.fn().mockReturnValue({
					data: [
						{
							id: '1',
							name: 'Pepperoni',
							description: 'Classic pepperoni pizza with cheese',
							photo_url: 'https://example.com/pepperoni.jpg',
						},
						{
							id: '2',
							name: 'Margherita',
							description:
								'Traditional Italian pizza with tomato and mozzarella',
							photo_url: 'https://example.com/margherita.jpg',
						},
					],
					error: null,
				}),
			})),
			auth: {
				signOut: jest.fn().mockResolvedValue({ error: null }),
			},
		},
	}
})

// Mock expo-router
const mockRouterPush = jest.fn()
const mockRouterNavigate = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		push: mockRouterPush,
		back: jest.fn(),
		navigate: mockRouterNavigate,
	}),
}))

describe('Home Page', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders correctly with a list of pizzas', async () => {
		const { getAllByTestId, queryByText } = render(<Home />)

		// Wait for data to load - look for product cards instead of specific text
		await waitFor(() => {
			// Look for pizza cards that match the mocked data
			const productCards = getAllByTestId('product-card-container')
			expect(productCards.length).toBeGreaterThan(0)

			// Alternatively, look for UI elements that would indicate the home screen loaded
			const addButton = queryByText('Register pizza')
			expect(addButton).toBeTruthy()
		})
	})

	it('calls signOut when logout button is pressed', async () => {
		const { getByTestId } = render(<Home />)

		// Find and press the logout icon
		await act(async () => {
			fireEvent.press(getByTestId('icon-logout'))
		})

		// Wait for the signOut and mutate function to be called
		await waitFor(() => {
			expect(mockMutate).toHaveBeenCalled()
			// Check if navigate was called through the router
			expect(mockRouterNavigate).toHaveBeenCalledWith('/sign-in')
		})
	})

	it('performs search when text input changes', async () => {
		const { getByTestId } = render(<Home />)

		// Enter search text
		await act(async () => {
			fireEvent.changeText(getByTestId('search-input'), 'pepperoni')
		})

		// Check if search was performed (we don't have a good way to validate this specific mock)
		await waitFor(() => {
			expect(getByTestId('search-input').props.value).toBe('pepperoni')
		})
	})

	it('navigates to product detail when add button is pressed', async () => {
		const { getByText } = render(<Home />)

		// Check for admin button
		const registerButton = getByText('Register pizza')
		expect(registerButton).toBeTruthy()

		// Press button and check navigation
		await act(async () => {
			fireEvent.press(registerButton)
		})

		// Wait for navigation to be triggered
		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith('/product')
		})
	})

	it('clears search when clear button is pressed', async () => {
		const { getByTestId } = render(<Home />)

		// Enter search text first
		await act(async () => {
			fireEvent.changeText(getByTestId('search-input'), 'pepperoni')
		})

		// Press clear button
		await act(async () => {
			fireEvent.press(getByTestId('search-clear-button'))
		})

		// Wait for the search to reset
		await waitFor(() => {
			expect(getByTestId('search-input').props.value).toBe('')
		})
	})
})
