// jest.setup.js

import '@testing-library/jest-native'
import { Alert } from 'react-native'

// Common UI mocks
jest.mock('expo-linear-gradient', () => {
	const React = require('react')
	const { View } = require('react-native')
	return {
		LinearGradient: jest.fn(({ children, testID }) => {
			return React.createElement(
				View,
				{ testID: testID || 'linear-gradient' },
				children,
			)
		}),
	}
})

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
	const React = require('react')
	const { View } = require('react-native')

	return {
		MaterialIcons: function MockMaterialIcons(props) {
			return React.createElement(View, {
				testID: props.testID || `icon-${props.name}`,
				name: props.name,
				size: props.size,
				color: props.color,
			})
		},
		Feather: function MockFeather(props) {
			return React.createElement(View, {
				testID: props.testID || `icon-${props.name}`,
				name: props.name,
				size: props.size,
				color: props.color,
			})
		},
	}
})

// Mock react-native-iphone-x-helper
jest.mock('react-native-iphone-x-helper', () => ({
	getBottomSpace: jest.fn(() => 34),
	getStatusBarHeight: jest.fn(() => 44),
}))

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
	console.log(`Alert called: ${title} - ${message}`)
	return 0
})

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
	default: {
		getItem: jest.fn(),
		setItem: jest.fn(),
		removeItem: jest.fn(),
	},
}))

// Mock expo-font
jest.mock('expo-font', () => ({
	isLoaded: () => [true],
	useFonts: () => [true],
	loadAsync: () => Promise.resolve(),
}))

// Mock expo-asset
jest.mock('expo-asset', () => ({
	Asset: {
		loadAsync: () => Promise.resolve(),
	},
}))

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
	preventAutoHideAsync: jest.fn(),
	hideAsync: jest.fn(),
}))

// Improved expo-router mock
jest.mock('expo-router', () => {
	const mockBack = jest.fn()
	const mockPush = jest.fn()

	return {
		useRouter: () => ({
			push: mockPush,
			back: mockBack,
		}),
		useLocalSearchParams: jest.fn(() => ({})),
		SplashScreen: {
			preventAutoHideAsync: jest.fn(),
			hideAsync: jest.fn(),
		},
	}
})

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
	requestMediaLibraryPermissionsAsync: jest
		.fn()
		.mockResolvedValue({ status: 'granted' }),
	launchImageLibraryAsync: jest.fn().mockResolvedValue({
		canceled: false,
		assets: [{ uri: 'file:///test.jpg' }],
	}),
}))

// Mock expo-checkbox
jest.mock('expo-checkbox', () => {
	const React = require('react')
	return jest.fn().mockImplementation(({ value, onValueChange, testID }) => {
		return React.createElement('View', {
			testID,
			onClick: () => onValueChange(!value),
			accessibilityState: {
				checked: value,
			},
		})
	})
})

// Mock react-native-mime-types
jest.mock('react-native-mime-types', () => ({
	lookup: jest.fn().mockReturnValue('image/jpeg'),
}))

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
	getInfoAsync: jest
		.fn()
		.mockResolvedValue({ exists: true, uri: 'file://test.jpg' }),
	readAsStringAsync: jest.fn().mockResolvedValue('file-content'),
}))

// Mock the supabase client globally
jest.mock('@/supabase/supabase', () => ({
	supabase: {
		auth: {
			getSession: jest.fn(() =>
				Promise.resolve({
					data: { session: { user: { id: '123', email: 'test@example.com' } } },
					error: null,
				}),
			),
			signIn: jest.fn(),
			signOut: jest.fn(),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn(() =>
				Promise.resolve({
					data: { is_admin: true },
					error: null,
				}),
			),
		})),
	},
}))
