import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { TextInput } from 'react-native'
import { useInputContext } from './hooks/useInputContext'

const StyledInput = styled(TextInput, {
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
})

export const Trigger = () => {
	const {
		shouldFloat,
		handleChangeText,
		handleFocus,
		handleBlur,
		value,
		rest,
	} = useInputContext()

	return (
		<StyledInput
			placeholder={shouldFloat.value ? '' : rest.placeholder || ''}
			testID='input-container'
			value={value}
			onChangeText={handleChangeText}
			onFocus={handleFocus}
			onBlur={handleBlur}
			{...rest}
		/>
	)
}
