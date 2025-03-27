import { View, type TextInputProps } from 'react-native'
import { useInputAnimation } from './hooks/useInputAnimation'
import type { SharedValue } from 'react-native-reanimated'
import { createContext } from 'react'
import { styled } from '@fast-styles/react'
import type { WithStyles } from '@fast-styles/react/lib/typescript/types'

const Wrapper = styled(View, {
	width: '100%',
})

type InputContextProp = {
	shouldFloat: SharedValue<number>
	handleChangeText: (text: string) => void
	handleFocus: () => void
	handleBlur: () => void
	value: string
	rest: WithStyles<TextInputProps>
} | null

export const InputContext = createContext<InputContextProp>(null)

export const Root = ({
	value = '',
	children,
	onChangeText,
	...rest
}: WithStyles<TextInputProps>) => {
	const { shouldFloat, handleFocus, handleBlur } = useInputAnimation(value)

	const handleChangeText = (text: string) => {
		onChangeText?.(text)
	}

	return (
		<InputContext.Provider
			value={{
				shouldFloat,
				handleChangeText,
				handleFocus,
				handleBlur,
				value,
				rest,
			}}
		>
			<Wrapper>{children}</Wrapper>
		</InputContext.Provider>
	)
}
