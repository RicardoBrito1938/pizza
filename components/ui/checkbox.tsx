import { View, Text } from 'react-native'
import ExpoCheckBox from 'expo-checkbox'
import { styled } from '@fast-styles/react'
import extendedTheme from '@/styles/extendedTheme'

const CheckboxLabel = styled(Text, {
	marginLeft: 8,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

type CheckboxProps = {
	checked: boolean
	onPress: () => void
	label?: string
}

export function Checkbox({ checked, onPress, label }: CheckboxProps) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<ExpoCheckBox
				value={checked}
				onValueChange={onPress}
				color={checked ? extendedTheme.colors.$secondary900 : undefined}
			/>
			{label && <CheckboxLabel>{label}</CheckboxLabel>}
		</View>
	)
}
