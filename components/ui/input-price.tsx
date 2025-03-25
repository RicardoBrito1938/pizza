import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import type { WithStyles } from '@fast-styles/react/lib/typescript/types'
import { Text, TextInput, type TextInputProps, View } from 'react-native'

const Container = styled(View, {
	width: '100%',
	height: 56,
	borderWidth: 1,
	borderRadius: 12,
	borderColor: extendedTheme.colors.$shape,
	marginBottom: 8,
	flexDirection: 'row',
	alignItems: 'center',
})

const Size = styled(View, {
	width: 56,
	height: 56,
	justifyContent: 'center',
	alignItems: 'center',
	borderRightWidth: 1,
	borderRightColor: extendedTheme.colors.$shape,
	marginRight: 8,
})

const Label = styled(Text, {
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
	color: extendedTheme.colors.$secondary900,
})

const Input = styled(TextInput, {
	flex: 1,
	marginLeft: 8,
})

type Props = WithStyles<TextInputProps> & {
	size: string
}

export const InputPrice = ({ size, ...rest }: Props) => {
	return (
		<Container testID='input-price-container'>
			<Size testID='input-price-size-container'>
				<Label testID='input-price-size-label'>{size}</Label>
			</Size>
			<Label testID='input-price-currency-label'>£</Label>
			<Input keyboardType='numeric' testID='input-price-input' {...rest} />
		</Container>
	)
}
