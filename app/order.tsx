import { ButtonBack } from '@/components/ui/button-back'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const Container = styled(KeyboardAvoidingView, {
	flex: 1,
})

const Header = styled(LinearGradient, {
	paddingHorizontal: 24,
	paddingTop: getStatusBarHeight() + 33,
})

export const Order = () => {
	return (
		<Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Header
				colors={[
					extendedTheme.tokens.$gradientStart,
					extendedTheme.tokens.$gradientEnd,
				]}
			>
				<ButtonBack style={{ marginBottom: 108 }} />
			</Header>
		</Container>
	)
}
