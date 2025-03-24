// jest.setup.js

import '@testing-library/jest-native'

jest.mock('i18next', () => ({
	changeLanguage: jest.fn().mockResolvedValue({}),
	t: jest.fn((key) => key),
	exists: jest.fn(() => true),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
	default: {
		getItem: jest.fn(),
		setItem: jest.fn(),
		removeItem: jest.fn(),
	},
}))

jest.mock('expo-font', () => ({
	isLoaded: () => [true],
	useFonts: () => [true],
	loadAsync: () => Promise.resolve(),
}))

jest.mock('expo-asset', () => ({
	Asset: {
		loadAsync: () => Promise.resolve(),
	},
}))

jest.mock('@tanstack/react-query', () => ({
	useMutation: jest.fn(() => ({
		mutateAsync: jest.fn(),
		isPending: false,
	})),
	useQuery: jest.fn(() => ({
		data: [],
		isFetching: false,
	})),
	QueryClient: jest.fn(),
	QueryClientProvider: jest.fn(({ children }) => children),
}))

jest.mock('expo-splash-screen', () => ({
	preventAutoHideAsync: jest.fn(),
	hideAsync: jest.fn(),
}))

jest.mock('@/components/Icon/Background', () => 'SvgMock')
jest.mock('@/components/Icon/Icon', () => 'SvgMock')
jest.mock('@/assets/icons/cloud-with-hourglass.svg', () => 'SvgMock')
jest.mock('@/assets/icons/square-pattern-background.svg', () => 'SvgMock')
jest.mock('@/assets/icons/arrow-left.svg', () => 'SvgMock')
jest.mock('@/assets/images/sf-logo-vertical.svg', () => 'SvgMock')

jest.mock('@/components/Icon', () => ({
	Icon: {
		Root: 'View',
		Background: () => 'SvgMock',
		IconContainer: 'View',
		Icon: () => 'SvgMock',
	},
}))

jest.mock('@/hooks/useColorScheme', () => ({
	useColorScheme: () => 'light',
}))

jest.mock('@clerk/clerk-expo', () => ({
	ClerkProvider: ({ children }) => children,
	ClerkLoaded: ({ children }) => children,
	useSignIn: jest.fn(() => ({
		signIn: jest.fn(),
		setActive: jest.fn(),
		isLoaded: true,
	})),
	useUser: jest.fn(),
	useAuth: jest.fn(() => ({
		isSignedIn: false,
		getToken: jest.fn().mockResolvedValue('test-token'),
	})),
}))

jest.mock('@/gen/index', () => ({
	useAuthControllerHandle: jest.fn(),
	unifiedUserDTOStatusEnum: {
		INVITED: 'INVITED',
		ACTIVE: 'ACTIVE',
		INACTIVE: 'INACTIVE',
	},
}))

jest.mock('expo-router', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
	})),
}))
