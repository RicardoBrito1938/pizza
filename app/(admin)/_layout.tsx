import { Tabs } from 'expo-router'
import extendedTheme from '@/styles/extendedTheme'
import { BottomMenu } from '@/components/ui/bottom-menu'
import { useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Fetcher function for notifications
const fetchNotifications = async () => {
	const { data, error } = await supabase
		.from('orders')
		.select('*', { count: 'exact' })
		.eq('status', 'prepared')

	if (error) {
		throw error
	}

	return data.length
}

export default function TabLayout() {
	const queryClient = useQueryClient()

	const { data: notifications = 0 } = useQuery({
		queryKey: ['notifications'],
		queryFn: fetchNotifications,
		staleTime: 1000 * 30, // 30 seconds
	})

	useEffect(() => {
		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'orders' },
				(payload) => {
					if (payload.new.status === 'prepared') {
						queryClient.invalidateQueries({ queryKey: ['notifications'] })
					}
				},
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'orders' },
				(payload) => {
					if (
						(payload.old.status !== 'prepared' &&
							payload.new.status === 'prepared') ||
						(payload.old.status === 'prepared' &&
							payload.new.status !== 'prepared')
					) {
						queryClient.invalidateQueries({ queryKey: ['notifications'] })
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(subscription)
		}
	}, [queryClient])

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: extendedTheme.colors.$secondary900,
				tabBarInactiveTintColor: extendedTheme.colors.$secondary400,
				headerShown: false,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name='home'
				options={{
					tabBarIcon: ({ color }) => (
						<BottomMenu title='Menu' color={color} notifications='0' />
					),
				}}
			/>
			<Tabs.Screen
				name='orders'
				options={{
					tabBarIcon: ({ color }) => (
						<BottomMenu
							title='Orders'
							color={color}
							notifications={notifications.toString()}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
