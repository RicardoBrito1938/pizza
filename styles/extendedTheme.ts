import { extendDefaultTheme } from '@fast-styles/react'

const primary = {
	900: '#B83341',
	800: '#E03F50',
}

const extendedTheme = extendDefaultTheme({
	colors: {
		// Incorporate the new theme colors
		$primary900: primary[900],
		$primary800: primary[800],
		$primary100: '#D16470',
		$primary50: '#FFABB3',

		$secondary900: '#572D31',
		$secondary500: '#7A6769',
		$secondary400: '#93797B',

		$success900: '#528F33',
		$success50: '#F7FFF9',

		$alert900: '#B27F00',
		$alert800: '#C5941A',
		$alert50: '#F3EFE5',

		$background: '#F7F7F7',
		$shape: '#DCDCDC',
		$title: '#FFF',
	},
	tokens: {
		// Using the primary color for text defaults
		$textDefault: primary[800],
		$textLight: '#F7F7F7',
		// Add any additional tokens as needed based on the new theme
		$gradientStart: primary[900],
		$gradientEnd: primary[800],
	},
	fonts: {
		// Add fonts from the new theme
		$titleFont: 'DMSerifDisplay_400Regular',
		$textFont: 'DMSans_400Regular',
		$textFontBold: 'DMSans_700Bold',
	},
})

export default extendedTheme
