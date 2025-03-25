import extendedTheme from '@/styles/extendedTheme'
import { MaterialIcons } from '@expo/vector-icons'
import { styled } from '@fast-styles/react'
import type { WithStyles } from '@fast-styles/react/lib/typescript/types'
import { Pressable, type PressableProps } from 'react-native'
import { useRouter } from 'expo-router'

const Container = styled(Pressable, {
	width: 40,
	height: 40,
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: 12,
	borderWidth: 1,
	borderColor: extendedTheme.colors.$primary100,
})

export const ButtonBack = ({ ...rest }: WithStyles<PressableProps>) => {
	const router = useRouter()

	return (
		<Container
			{...rest}
			onPress={() => router.back()}
			testID='button-back-container'
		>
			<MaterialIcons
				name='chevron-left'
				size={18}
				color={extendedTheme.colors.$title}
				testID='button-back-icon'
			/>
		</Container>
	)
}
