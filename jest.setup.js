import '@testing-library/jest-native'
import 'react-native-gesture-handler/jestSetup'

// Mock error-guard that contains Flow types
jest.mock('@react-native/js-polyfills/error-guard', () => ({
	ErrorUtils: {
		setGlobalHandler: jest.fn(),
		getGlobalHandler: jest.fn(),
		reportError: jest.fn(),
	},
}))

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

jest.mock('@react-native-async-storage/async-storage', () => ({
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
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
		// biome-ignore lint/style/useNamingConvention: <explanation>
		INVITED: 'INVITED',
		// biome-ignore lint/style/useNamingConvention: <explanation>
		ACTIVE: 'ACTIVE',
		// biome-ignore lint/style/useNamingConvention: <explanation>
		INACTIVE: 'INACTIVE',
	},
}))

jest.mock('expo-router', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
	})),
}))

// Mock the React Native modules that are not critical for tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Mock any other native modules you're using
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

// Fix the mock for @fast-styles/react to properly return a styled component
jest.mock('@fast-styles/react', () => ({
	styled: (Component) => {
		// Return a forwarded component that passes props through
		const ForwardedComponent = (props) => {
			return <Component {...props} />
		}
		return ForwardedComponent
	},
}))

// Mock the theme if needed
jest.mock('@/styles/extendedTheme', () => ({
	colors: {
		$primary900: '#000',
		$success900: '#000',
		$title: '#fff',
	},
	fonts: {
		$textFont: 'System',
	},
}))
