import { ButtonBack } from '@/components/ui/button-back'
import { RadioButton } from '@/components/ui/radio-button'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const Container = styled(KeyboardAvoidingView, {
	flex: 1,
})

const Header = styled(LinearGradient, {
	paddingHorizontal: 24,
	paddingTop: getStatusBarHeight() + 33,
})

const Photo = styled(Image, {
	width: 240,
	height: 240,
	borderRadius: 120,
	alignSelf: 'center',
	position: 'relative',
	top: -120,
})

const Sizes = styled(View, {
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'center',
	marginBottom: 40,
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
			<Photo source={{ uri: 'http://github.com/RicardoBrito1938.png' }} />
			<Sizes>
				<RadioButton title='Small' />
			</Sizes>
		</Container>
	)
}
