import { View, Text } from 'react-native'
import ExpoCheckBox from 'expo-checkbox'
import { styled } from '@fast-styles/react'
import extendedTheme from '@/styles/extendedTheme'

const CheckboxLabel = styled(Text, {
	marginLeft: 8,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

const Container = styled(View, {
	flexDirection: 'row',
	alignItems: 'center',
})

type CheckboxProps = {
	checked: boolean
	onPress: () => void
	label?: string
}

export function Checkbox({ checked, onPress, label }: CheckboxProps) {
	return (
		<Container testID='checkbox-container'>
			<ExpoCheckBox
				value={checked}
				onValueChange={onPress}
				color={checked ? extendedTheme.colors.$secondary900 : undefined}
				testID='checkbox-input'
				style={{ borderBlockColor: extendedTheme.colors.$secondary900 }}
			/>
			{label && <CheckboxLabel testID='checkbox-label'>{label}</CheckboxLabel>}
		</Container>
	)
}
