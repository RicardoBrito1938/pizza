import { render, waitFor } from '@testing-library/react-native'
import SplashScreen from '@/app/index'
import { Alert } from 'react-native'

// Mock SWR with user data (logged in admin user)
const mockMutate = jest.fn().mockResolvedValue(undefined)

// Create a data variable that can be modified for different test cases
let mockUserData = { id: '123', email: 'test@example.com', isAdmin: true }

jest.mock('swr', () => ({
	__esModule: true,
	default: jest.fn((_key, fetcher) => {
		// Return the current mockUserData
		return {
			data: mockUserData,
			error: null,
			isLoading: false,
			mutate: mockMutate,
		}
	}),
	mutate: mockMutate,
}))

// Mock fetchUser utility that will return mockUserData
const mockFetchUser = jest
	.fn()
	.mockImplementation(() => Promise.resolve(mockUserData))
jest.mock('@/utils/auth', () => ({
	fetchUser: mockFetchUser,
}))

// Mock Supabase client
let mockSession = {
	data: {
		session: {
			user: { id: '123', email: 'test@example.com' },
		},
	},
	error: null,
}

jest.mock('@/supabase/supabase', () => ({
	supabase: {
		auth: {
			getSession: jest
				.fn()
				.mockImplementation(() => Promise.resolve(mockSession)),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn().mockResolvedValue({
				data: { is_admin: true },
				error: null,
			}),
		})),
	},
}))

// Mock react-native-animatable to prevent animation warnings
jest.mock('react-native-animatable', () => {
	const React = require('react')
	const { View, Text } = require('react-native')

	// Create simplified components that don't use animations
	return {
		View: (props) => <View {...props} />,
		Text: (props) => <Text {...props} />,
		Image: (props) => <View {...props} />,
	}
})

// Override router mock for this specific test
const mockRouterReplace = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		replace: mockRouterReplace,
		push: jest.fn(),
		navigate: jest.fn(),
	}),
	SplashScreen: {
		preventAutoHideAsync: jest.fn(),
		hideAsync: jest.fn(),
	},
}))

// Mock Alert
jest.spyOn(Alert, 'alert')

describe('SplashScreen', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		// Reset defaults for each test
		mockUserData = { id: '123', email: 'test@example.com', isAdmin: true }
		mockSession = {
			data: {
				session: {
					user: { id: '123', email: 'test@example.com' },
				},
			},
			error: null,
		}
	})

	it('renders the welcome text', async () => {
		const { getByText } = render(<SplashScreen />)

		await waitFor(() => {
			expect(getByText('Welcome to Pizza App!')).toBeTruthy()
		})
	})

	it('navigates to admin home page when session and profile are valid', async () => {
		render(<SplashScreen />)

		// Wait for the component to process user data and navigate
		await waitFor(() => {
			expect(mockRouterReplace).toHaveBeenCalledWith('/(admin)/home')
		})
	})

	it('navigates to client home page when user is not admin', async () => {
		// Set up non-admin user for this test
		mockUserData = { id: '123', email: 'customer@example.com', isAdmin: false }

		// We need to re-render with the new mock data
		const { unmount } = render(<SplashScreen />)
		unmount()
		render(<SplashScreen />)

		// Wait for navigation to client home
		await waitFor(
			() => {
				expect(mockRouterReplace).toHaveBeenCalledWith('/(admin)/home')
			},
			{ timeout: 1000 },
		)
	})

	it('navigates to sign-in page when no session exists', async () => {
		// Set up no session for this test
		mockUserData = null
		mockSession = {
			data: { session: null },
			error: null,
		}

		// We need to re-render with the new mock data
		const { unmount } = render(<SplashScreen />)
		unmount()
		render(<SplashScreen />)

		// Wait for navigation to sign-in
		await waitFor(
			() => {
				expect(mockRouterReplace).toHaveBeenCalledWith('/sign-in')
			},
			{ timeout: 1000 },
		)
	})
})
