import { ItemSeparator } from '@/components/ui/item-separator'
import { OrdersCard } from '@/components/ui/orders-card'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Text, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
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

	const fetchOrders = useCallback(async () => {
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
	}, [])

	const updateOrderStatus = async (id: string) => {
		try {
			const { error } = await supabase
				.from('orders')
				.update({ status: 'delivered' })
				.eq('id', id)
				.select()

			if (error) {
				throw error
			}

			Alert.alert('Update', 'Order status updated successfully!')
		} catch (error) {
			console.error('Error updating order status:', error)
			Alert.alert('Error', 'An error occurred while updating the order status.')
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
		fetchOrders()

		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'orders' }, // Listen to all events
				(payload) => {
					if (payload.eventType === 'INSERT') {
						setOrders((prevOrders) => [payload.new as Order, ...prevOrders])
					} else if (payload.eventType === 'UPDATE') {
						setOrders((prevOrders) =>
							prevOrders.map((order) =>
								order.id === payload.new.id ? (payload.new as Order) : order,
							),
						)
					} else if (payload.eventType === 'DELETE') {
						setOrders((prevOrders) =>
							prevOrders.filter((order) => order.id !== payload.old.id),
						)
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(subscription)
		}
	}, [fetchOrders])

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
