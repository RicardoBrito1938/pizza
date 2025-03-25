import { Tabs } from 'expo-router'
import extendedTheme from '@/styles/extendedTheme'
import { BottomMenu } from '@/components/ui/bottom-menu'
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'

export default function TabLayout() {
	const [notifications, setNotifications] = useState(0)

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const { data, error } = await supabase
					.from('orders')
					.select('*', { count: 'exact' })
					.eq('status', 'prepared')

				if (error) {
					throw error
				}

				setNotifications(data.length)
			} catch (error) {
				console.error('Error fetching notifications:', error)
			}
		}

		fetchNotifications()

		const subscription = supabase
			.channel('orders')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'orders' },
				(payload) => {
					if (payload.new.status === 'prepared') {
						setNotifications((prev) => prev + 1)
					}
				},
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'orders' },
				(payload) => {
					if (
						payload.old.status !== 'prepared' &&
						payload.new.status === 'prepared'
					) {
						setNotifications((prev) => prev + 1)
					} else if (
						payload.old.status === 'prepared' &&
						payload.new.status !== 'prepared'
					) {
						setNotifications((prev) => Math.max(prev - 1, 0))
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(subscription)
		}
	}, [])

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
