module.exports = {
	preset: 'jest-expo',
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
	setupFiles: ['./jest.setup.js'],
	rootDir: './',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
	},
	testMatch: [
		'**/__tests__/**/*.(js|jsx|ts|tsx)',
		'**/?(*.)+(spec|test).(js|jsx|ts|tsx)',
	],
	transformIgnorePatterns: [
		'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|@react-native/js-polyfills|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
	],
	moduleNameMapper: {
		'^@/components/(.*)$': '<rootDir>/components/$1',
		'^@/hooks/(.*)$': '<rootDir>/hooks/$1',
		'^@/constants/(.*)$': '<rootDir>/constants/$1',
		'^@/utils/(.*)$': '<rootDir>/utils/$1',
		'^@/app/(.*)$': '<rootDir>/app/$1',
		'^@/assets/(.*)$': '<rootDir>/assets/$1',
		'^@/services/(.*)$': '<rootDir>/services/$1',
		'^@/gen/(.*)$': '<rootDir>/gen/$1',
	},
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/coverage/**',
		'!**/node_modules/**',
		'!**/babel.config.js',
		'!**/jest.setup.js',
	],
}
