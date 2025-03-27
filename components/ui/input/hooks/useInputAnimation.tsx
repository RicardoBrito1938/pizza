import { useSharedValue } from 'react-native-reanimated'

export const useInputAnimation = (initialValue: string) => {
	const isFocused = useSharedValue(0)
	const shouldFloat = useSharedValue(initialValue?.length > 0 ? 1 : 0)

	const handleFocus = () => {
		isFocused.value = 1
		shouldFloat.value = 1
	}

	const handleBlur = () => {
		isFocused.value = 0
		shouldFloat.value = initialValue.length > 0 ? 1 : 0
	}

	return { isFocused, shouldFloat, handleFocus, handleBlur }
}
