// biome-ignore lint/complexity/useArrowFunction: <explanation>
module.exports = function (api) {
	api.cache(true)

	return {
		presets: ['babel-preset-expo'],
		plugins: ['@fast-styles/babel-plugin', 'react-native-reanimated/plugin'],
	}
}
