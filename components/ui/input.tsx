import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { TextInput, type TextInputProps, View } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import { useEffect, useState } from 'react'

const Wrapper = styled(View, {
	width: '100%',
	position: 'relative',
})

export const Container = styled(TextInput, {
	width: '100%',
	height: 56,
	backgroundColor: 'transparent',
	borderRadius: 12,
	fontSize: 14,
	paddingVertical: 7,
	paddingHorizontal: 0,
	paddingLeft: 20,
	fontFamily: extendedTheme.fonts.$textFont,
	borderColor: extendedTheme.colors.$shape,
	borderWidth: 1,

	variants: {
		variant: {
			primary: {
				color: extendedTheme.colors.$secondary900,
			},
			secondary: {
				color: extendedTheme.colors.$title,
			},
		},
	},
})

export type InputProps = TextInputProps & {
	variant?: 'primary' | 'secondary'
	animatedPlaceholder?: string
}

export const Input = ({
	variant = 'primary',
	placeholder,
	animatedPlaceholder,
	value,
	onChangeText,
	...rest
}: InputProps) => {
	const placeholderTextColor =
		variant === 'primary'
			? extendedTheme.colors.$secondary900
			: extendedTheme.colors.$title

	const [inputValue, setInputValue] = useState(value || '')
	const isFocused = useSharedValue(0)
	const shouldFloat = useSharedValue(value ? 1 : 0)

	useEffect(() => {
		shouldFloat.value =
			inputValue && inputValue.length > 0 ? 1 : isFocused.value
	}, [inputValue, isFocused.value, shouldFloat])

	const labelStyle = useAnimatedStyle(() => {
		return {
			position: 'absolute',
			left: 20,
			top: withTiming(shouldFloat.value ? -8 : 18, { duration: 200 }),
			fontSize: withTiming(shouldFloat.value ? 12 : 14, { duration: 200 }),
			color: placeholderTextColor,
			fontFamily: extendedTheme.fonts.$textFont,
			zIndex: 999,
			elevation: 1,
			paddingHorizontal: 4,
			backgroundColor: extendedTheme.tokens.$gradientStart, // Match input background color
		}
	})

	const handleChangeText = (text: string) => {
		setInputValue(text)
		if (onChangeText) {
			onChangeText(text)
		}
	}

	return (
		<Wrapper>
			{animatedPlaceholder && (
				<Animated.Text style={labelStyle} testID='animated-placeholder'>
					{animatedPlaceholder}
				</Animated.Text>
			)}
			<Container
				variant={variant}
				placeholder={shouldFloat.value ? '' : placeholder}
				placeholderTextColor={placeholderTextColor}
				testID='input-container'
				value={value}
				onChangeText={handleChangeText}
				onFocus={() => {
					isFocused.value = 1
					shouldFloat.value = 1
				}}
				onBlur={() => {
					isFocused.value = 0
					shouldFloat.value = inputValue.length > 0 ? 1 : 0
				}}
				style={{ paddingTop: 12 }} // Add padding to create space for the label
				blurOnSubmit
				{...rest}
			/>
		</Wrapper>
	)
}
