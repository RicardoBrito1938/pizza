import { ItemSeparator } from '@/components/ui/item-separator'
import { OrdersCard } from '@/components/ui/orders-card'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Text, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/supabase/supabase'
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

const nextStatusMap = {
	preparing: 'prepared',
	prepared: 'delivered',
}

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([])

	const fetchOrders = async () => {
		try {
			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.order('created_at', { ascending: false })

			if (error) {
				throw error
			}

			setOrders(data as Order[])
		} catch (error) {
			console.error('Error fetching orders:', error)
		}
	}

	const updateOrderStatus = async (id: string) => {
		try {
			// Fetch the current status of the order
			const { data: order, error: fetchError } = await supabase
				.from('orders')
				.select('status')
				.eq('id', id)
				.single()

			if (fetchError) {
				throw fetchError
			}

			// Update the order status
			const { error: updateError } = await supabase
				.from('orders')
				.update({
					status: nextStatusMap[order?.status as keyof typeof nextStatusMap],
				})
				.eq('id', id)
				.select()

			if (updateError) {
				throw updateError
			}

			// Refetch orders to update the state
			await fetchOrders()

			Alert.alert(
				'Update',
				`Order status updated to ${nextStatusMap[order?.status as keyof typeof nextStatusMap]} successfully!`,
			)
		} catch (error) {
			console.error('Error updating order status:', error)
			Alert.alert('Error', 'An error occurred while updating the order status.')
		}
	}

	const handlePizzaDelivered = async (id: string) => {
		Alert.alert('Order', 'Confirm order update?', [
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
		const fetchOrdersEffect = async () => {
			try {
				const { data, error } = await supabase
					.from('orders')
					.select('*')
					.order('created_at', { ascending: false })

				if (error) {
					throw error
				}

				setOrders(data as Order[])
			} catch (error) {
				console.error('Error fetching orders:', error)
			}
		}

		fetchOrdersEffect()

		// Subscribe to real-time updates
		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'orders' },
				(payload) => {
					console.log('Change received!', payload)
					fetchOrdersEffect() // Refresh orders on any change
				},
			)
			.subscribe()

		// Cleanup subscription on unmount
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
