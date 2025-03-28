import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import type { PressableProps, GestureResponderEvent } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'

const Container = styled(Pressable, {
	width: '100%',
	padding: 16,
	borderRadius: 12,
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',

	variants: {
		variant: {
			primary: {
				backgroundColor: extendedTheme.colors.$primary900,
			},
			secondary: {
				backgroundColor: extendedTheme.colors.$success900,
			},
		},
	},
})

const Title = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFontBold,
})

const Loading = styled(ActivityIndicator, {
	color: extendedTheme.colors.$title,
})

const RippleContainer = styled(View, {
	overflow: 'hidden',
	borderRadius: 12,
	width: '100%',
	position: 'relative',
})

const AnimatedView = Animated.createAnimatedComponent(View)

export type ButtonProps = PressableProps & {
	title: string
	variant?: 'primary' | 'secondary'
	loading?: boolean
}

export const Button = ({
	title,
	variant = 'primary',
	loading = false,
	...rest
}: ButtonProps) => {
	const scale = useSharedValue(0)
	const opacity = useSharedValue(1)
	const centerX = useSharedValue(0)
	const centerY = useSharedValue(0)

	const rippleStyle = useAnimatedStyle(() => {
		return {
			position: 'absolute',
			width: 200,
			height: 200,
			borderRadius: 100,
			backgroundColor: 'rgba(255, 255, 255, 0.3)',
			top: centerY.value - 100,
			left: centerX.value - 100,
			opacity: opacity.value,
			transform: [{ scale: scale.value }],
			zIndex: 0, // Ensure ripple is below content
		}
	})

	const handlePressIn = (event: GestureResponderEvent) => {
		centerX.value = event.nativeEvent.locationX
		centerY.value = event.nativeEvent.locationY
		opacity.value = 1
		scale.value = 0
		scale.value = withTiming(4, { duration: 500 })
	}

	const handlePressOut = () => {
		opacity.value = withTiming(0, { duration: 300 })
	}

	return (
		<RippleContainer>
			<Container
				variant={variant}
				disabled={loading}
				testID='button-container'
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				{...rest}
			>
				<AnimatedView style={rippleStyle} />
				{loading ? (
					<Loading testID='button-loading-indicator' />
				) : (
					<Title testID='button-text'>{title}</Title>
				)}
			</Container>
		</RippleContainer>
	)
}
