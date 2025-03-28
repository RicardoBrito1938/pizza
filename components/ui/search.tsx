import extendedTheme from '@/styles/extendedTheme'
import { Feather } from '@expo/vector-icons'
import { styled } from '@fast-styles/react'
import type { WithStyles } from '@fast-styles/react/lib/typescript/types'
import {
	TextInput,
	type TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native'

const Container = styled(View, {
	width: '100%',
	flexDirection: 'row',
	alignItems: 'center',
	marginTop: -30,
	paddingHorizontal: 24,
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5,
})

const InputArea = styled(View, {
	flex: 1,
	flexDirection: 'row',
	alignItems: 'center',
	borderRadius: 16,
	backgroundColor: extendedTheme.colors.$title,
	borderColor: extendedTheme.colors.$shape,
})

const Input = styled(TextInput, {
	flex: 1,
	height: 52,
	paddingLeft: 12,
	fontFamily: extendedTheme.fonts.$textFont,
})

const Clear = styled(TouchableOpacity, {
	marginRight: 7,
})

const Button = styled(TouchableOpacity, {
	height: 52,
	width: 52,
	borderRadius: 16,
	backgroundColor: extendedTheme.colors.$success900,
	alignItems: 'center',
	justifyContent: 'center',
	marginLeft: 8,
})

export const searchTestIDs = {
	container: 'search-container',
	inputArea: 'search-input-area',
	input: 'search-input',
	clearButton: 'search-clear-button',
	clearIcon: 'search-clear-icon',
}

type Props = WithStyles<TextInputProps> & {
	onClear: () => void
	testID?: string
}

export const Search = ({ onClear, testID, ...rest }: Props) => {
	return (
		<Container testID={testID || searchTestIDs.container}>
			<InputArea testID={searchTestIDs.inputArea}>
				<Input placeholder='search...' testID={searchTestIDs.input} {...rest} />
				<Clear onPress={onClear} testID={searchTestIDs.clearButton}>
					<Feather name='x' size={16} testID={searchTestIDs.clearIcon} />
				</Clear>
			</InputArea>
		</Container>
	)
}
