module.exports = {
	preset: 'jest-expo',
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
	setupFiles: ['./jest.setup.js'],
	rootDir: './',
	transform: {
		'^.+\\.[jt]sx?$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'node_modules/(?!((jest-)?react-native|' +
			'@react-native(-community)?|' +
			'expo|expo-.*|@expo/.*|@expo-google-fonts/.*|' +
			'expo-modules-core|' +
			'react-navigation|@react-navigation/.*|' +
			'unimodules|@unimodules/.*|' +
			'native-base|sentry-expo|' +
			'react-native-svg))',
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
}
