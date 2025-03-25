import { render, act, waitFor } from '@testing-library/react-native'
import SplashScreen from '@/app/index'

// Mock the auth hook
const mockSetUser = jest.fn()
jest.mock('@/hooks/auth', () => ({
	useAuth: () => ({
		setUser: mockSetUser,
	}),
}))

// Override router mock for this specific test
const mockRouterReplace = jest.fn()
jest.mock('expo-router', () => ({
	useRouter: () => ({
		replace: mockRouterReplace,
	}),
	SplashScreen: {
		preventAutoHideAsync: jest.fn(),
		hideAsync: jest.fn(),
	},
}))

describe('SplashScreen', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks()
	})

	it('renders the welcome text', () => {
		const { getByText } = render(<SplashScreen />)
		expect(getByText('Welcome to Pizza App!')).toBeTruthy()
	})

	it('navigates to admin home page when session and profile are valid', async () => {
		render(<SplashScreen />)

		// Wait for the useEffect to execute
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0))
		})

		waitFor(() => {
			// Verify user is set with correct data
			expect(mockSetUser).toHaveBeenCalledWith({
				id: '123',
				email: 'test@example.com',
				isAdmin: true,
			})

			// Verify navigation happened
			expect(mockRouterReplace).toHaveBeenCalledWith('/(admin)/home')
		})
	})
})
