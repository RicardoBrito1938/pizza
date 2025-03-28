import { Button } from '@/components/ui/button'
import { ButtonBack } from '@/components/ui/button-back'
import { Input } from '@/components/ui/input'
import { RadioButton } from '@/components/ui/radio-button'
import extendedTheme from '@/styles/extendedTheme'
import { PIZZA_TYPES } from '@/utils/pizza-types'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { supabase } from '@/supabase/supabase'
import { fetchUser } from '@/utils/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPizzaById } from '@/utils/api'
import type { ProductProps } from '@/components/ui/product-card'

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
	justifyContent: 'space-between',
	marginBottom: 40,
})

const Form = styled(View, {
	flex: 1,
	padding: 24,
	paddingBottom: 24,
	top: -120,
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

type PizzaResponse = ProductProps & {
	price_sizes: {
		[key: string]: number
	}
}

export default function Order() {
	const router = useRouter()
	const { id } = useLocalSearchParams()
	const pizzaId = id ? String(id) : ''
	const queryClient = useQueryClient()

	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: fetchUser,
	})

	const { data: pizza } = useQuery({
		queryKey: ['pizza', pizzaId],
		queryFn: () => fetchPizzaById(pizzaId),
		enabled: !!pizzaId,
	})

	const [size, setSize] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [tableNumber, setTableNumber] = useState('0')

	const amount =
		size && pizza?.price_sizes && pizza.price_sizes[size]
			? pizza.price_sizes[size] * quantity
			: '0.00'

	const orderMutation = useMutation({
		mutationFn: async (orderData: {
			quantity: number
			amount: string | number
			pizza: string | undefined
			size: string
			table_number: string
			status: string
			waiter_id: string | undefined
			image: string | undefined
		}) => {
			const { error } = await supabase.from('orders').insert(orderData)
			if (error) throw error
			return true
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			Alert.alert('Order', 'Order placed successfully!')
			router.push('/home')
		},
		onError: (error) => {
			Alert.alert('Order', 'An error occurred while placing the order')
			console.error('Error adding order:', error)
		},
	})

	const handleOrder = async () => {
		if (!size) {
			Alert.alert('Order', 'Select a size')
			return
		}
		if (!quantity) {
			Alert.alert('Order', 'Select a quantity')
			return
		}
		if (!tableNumber) {
			Alert.alert('Order', 'Select a table number')
			return
		}

		const order = {
			quantity,
			amount,
			pizza: pizza?.name,
			size,
			table_number: tableNumber,
			status: 'preparing',
			waiter_id: user?.id,
			image: pizza?.photo_url,
		}

		orderMutation.mutate(order)
	}

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
				<Photo
					source={{
						uri: pizza?.photo_url,
					}}
				/>
				<Form>
					<Title>{pizza?.name || 'Pizza name'}</Title>
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
							<Input.Root
								placeholder='Table Number'
								keyboardType='numeric'
								onChangeText={setTableNumber}
							>
								<Input.AnimatedPlaceholder
									backgroundColor={extendedTheme.colors.$background}
									color={extendedTheme.colors.$secondary900}
								>
									Table Number
								</Input.AnimatedPlaceholder>
								<Input.Trigger />
							</Input.Root>
						</InputGroup>

						<InputGroup>
							<Input.Root
								placeholder='Quantity'
								keyboardType='numeric'
								onChangeText={(value) => setQuantity(Number(value))}
							>
								<Input.AnimatedPlaceholder
									backgroundColor={extendedTheme.colors.$background}
									color={extendedTheme.colors.$secondary900}
								>
									Quantity
								</Input.AnimatedPlaceholder>
								<Input.Trigger />
							</Input.Root>
						</InputGroup>
					</FormRow>

					<Price>${amount}</Price>

					<Button
						title='Add'
						onPress={handleOrder}
						loading={orderMutation.isPending}
					/>
				</Form>
			</ContentScroll>
		</Container>
	)
}
