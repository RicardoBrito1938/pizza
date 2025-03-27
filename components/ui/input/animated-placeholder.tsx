import extendedTheme from '@/styles/extendedTheme'
import type { PropsWithChildren } from 'react'
import { useInputContext } from './hooks/useInputContext'
import Animated, {
	useAnimatedStyle,
	withTiming,
	useDerivedValue,
} from 'react-native-reanimated'

type AnimatedPlaceholderProps = {
	color?: string
	backgroundColor?: string
}

export const AnimatedPlaceholder = ({
	children,
	color = 'white',
	backgroundColor = extendedTheme.tokens.$gradientStart,
}: PropsWithChildren<AnimatedPlaceholderProps>) => {
	const { shouldFloat } = useInputContext()

	const animatedTop = useDerivedValue(() => (shouldFloat.value ? -8 : 18))
	const animatedFontSize = useDerivedValue(() => (shouldFloat.value ? 12 : 14))

	const labelStyle = useAnimatedStyle(() => ({
		position: 'absolute',
		left: 20,
		top: withTiming(animatedTop.value, { duration: 200 }),
		fontSize: withTiming(animatedFontSize.value, { duration: 200 }),
		color: color,
		fontFamily: extendedTheme.fonts.$textFont,
		zIndex: 999,
		elevation: 1,
		paddingHorizontal: 4,
		backgroundColor: backgroundColor,
	}))

	return (
		<Animated.Text style={labelStyle} testID='animated-placeholder'>
			{children}
		</Animated.Text>
	)
}
