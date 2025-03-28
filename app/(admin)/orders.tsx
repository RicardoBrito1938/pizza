import { ItemSeparator } from '@/components/ui/item-separator'
import { OrdersCard } from '@/components/ui/orders-card'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Text, View } from 'react-native'
import { useCallback, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

// Fetcher function for SWR
const fetchOrders = async () => {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data as Order[]
}

export default function Orders() {
	const queryClient = useQueryClient()

	const { data: orders = [] } = useQuery({
		queryKey: ['orders'],
		queryFn: fetchOrders,
		staleTime: 0, // Always fetch fresh data
	})

	const updateOrderMutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: string }) => {
			const { error } = await supabase
				.from('orders')
				.update({ status })
				.eq('id', id)

			if (error) throw error
			return { id, status }
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: (error) => {
			console.error('Error updating order status:', error)
			Alert.alert('Error', 'An error occurred while updating the order status.')
		},
	})

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

			const newStatus =
				nextStatusMap[order?.status as keyof typeof nextStatusMap]

			updateOrderMutation.mutate({ id, status: newStatus })

			Alert.alert(
				'Update',
				`Order status updated to ${newStatus} successfully!`,
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
		// Subscribe to real-time updates
		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'orders' },
				() => {
					queryClient.invalidateQueries({ queryKey: ['orders'] })
					queryClient.invalidateQueries({ queryKey: ['notifications'] })
				},
			)
			.subscribe()

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(subscription)
		}
	}, [queryClient])

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
