import { ItemSeparator } from '@/components/ui/item-separator'
import { OrdersCard } from '@/components/ui/orders-card'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const Container = styled(View, {
	flex: 1,
	backgroundColor: extendedTheme.colors.$background,
})

const Header = styled(LinearGradient, {
	paddingTop: getStatusBarHeight() + 33,
	paddingBottom: 33,
})

const Title = styled(Text, {
	color: extendedTheme.colors.$title,
	fontFamily: extendedTheme.fonts.$titleFont,
	fontSize: 24,
	lineHeight: 32,
	textAlign: 'center',
})

type Order = {
	id: string
	quantity: number
	amount: number
	pizza: string
	size: string
	table_number: string
	status: string
	waiter_id: string
	image: string
}

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([])

	const updateOrderStatus = async (id: string) => {
		try {
			const { error } = await supabase
				.from('orders')
				.update({ status: 'delivered' })
				.eq('id', id)

			if (error) {
				throw error
			}
		} catch (error) {
			console.error('Error updating order status:', error)
		}
	}

	const handlePizzaDelivered = async (id: string) => {
		Alert.alert('Order', 'Confirm order delivered?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => updateOrderStatus(id),
			},
		])
	}

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const { data, error } = await supabase
					.from('orders')
					.select('*')
					.order('status')

				if (error) {
					throw error
				}

				setOrders(data as Order[])
			} catch (error) {
				console.error('Error fetching orders:', error)
			}
		}

		fetchOrders()

		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'orders' },
				(payload) => {
					setOrders((prevOrders) => [payload.new as Order, ...prevOrders])
				},
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'orders' },
				(payload) => {
					setOrders((prevOrders) =>
						prevOrders.map((order) =>
							order.id === payload.new.id ? (payload.new as Order) : order,
						),
					)
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(subscription)
		}
	}, [])

	return (
		<Container>
			<Header
				colors={[
					extendedTheme.tokens.$gradientStart,
					extendedTheme.tokens.$gradientEnd,
				]}
			>
				<Title>Orders</Title>
			</Header>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<OrdersCard
						index={index}
						disabled={item.status === 'delivered'}
						onPress={() => handlePizzaDelivered(item.id)}
						data={{
							pizza: item.pizza,
							size: item.size,
							quantity: item.quantity,
							amount: item.amount,
							status: item.status,
							image: item.image,
							table_number: item.table_number,
						}}
					/>
				)}
				numColumns={2}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 125,
				}}
				ItemSeparatorComponent={ItemSeparator}
			/>
		</Container>
	)
}
