import { Button } from '@/components/ui/button'
import { ButtonBack } from '@/components/ui/button-back'
import { Input } from '@/components/ui/input'
import { RadioButton } from '@/components/ui/radio-button'
import extendedTheme from '@/styles/extendedTheme'
import { PIZZA_TYPES } from '@/utils/pizza-types'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from 'react-native'
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

const Form = styled(View, {
	flex: 1,
	padding: 24,
	paddingBottom: 24,
})

const Title = styled(Text, {
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$titleFont,
	fontSize: 32,
	lineHeight: 40,
	marginBottom: 32,
	textAlign: 'center',
})

const Label = styled(Text, {
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
	fontSize: 14,
	lineHeight: 22,
	marginBottom: 16,
})

const FormRow = styled(View, {
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'space-between',
})

const InputGroup = styled(View, {
	width: '48%',
})

const Price = styled(Text, {
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
	fontSize: 14,
	lineHeight: 22,
	marginVertical: 24,
	alignSelf: 'flex-end',
})

const ContentScroll = styled(ScrollView, {
	backgroundColor: extendedTheme.colors.$background,

	attributes: {
		showsVerticalScrollIndicator: false,
	},
})

export const Order = () => {
	const [size, setSize] = useState('')
	return (
		<Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ContentScroll>
				<Header
					colors={[
						extendedTheme.tokens.$gradientStart,
						extendedTheme.tokens.$gradientEnd,
					]}
				>
					<ButtonBack style={{ marginBottom: 108 }} />
				</Header>
				<Photo source={{ uri: 'http://github.com/RicardoBrito1938.png' }} />
				<Form>
					<Title>Pizza name</Title>
					<Label>Select your size</Label>
					<Sizes>
						{PIZZA_TYPES.map((type) => (
							<RadioButton
								key={type.id}
								title={type.name}
								onPress={() => setSize(type.id)}
								selected={size === type.id}
							/>
						))}
					</Sizes>

					<FormRow>
						<InputGroup>
							<Label>Table Number</Label>
							<Input placeholder='Table Number' keyboardType='numeric' />
						</InputGroup>

						<InputGroup>
							<Label>Quantity</Label>
							<Input placeholder='Table Number' keyboardType='numeric' />
						</InputGroup>
					</FormRow>

					<Price>$ 20.00</Price>

					<Button title='Add to cart' />
				</Form>
			</ContentScroll>
		</Container>
	)
}
