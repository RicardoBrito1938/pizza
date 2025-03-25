import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { TextInput, type TextInputProps } from 'react-native'

export const Container = styled(TextInput, {
	width: '100%',
	height: 56,
	backgroundColor: 'transparent',
	borderRadius: 12,
	fontSize: 14,
	paddingVertical: 7,
	paddingHorizontal: 0,
	paddingLeft: 20,
	marginBottom: 16,
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
}

export const Input = ({ variant = 'primary', ...rest }: InputProps) => {
	const placeholderTextColor =
		variant === 'primary'
			? extendedTheme.colors.$secondary900
			: extendedTheme.colors.$title

	return (
		<Container
			variant={variant}
			placeholderTextColor={placeholderTextColor}
			testID='input-container'
			{...rest}
		/>
	)
}
