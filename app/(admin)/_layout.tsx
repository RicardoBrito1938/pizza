import { Tabs } from 'expo-router'
import extendedTheme from '@/styles/extendedTheme'
import { BottomMenu } from '@/components/ui/bottom-menu'
import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

export default function TabLayout() {
	const [notifications, setNotifications] = useState(0)

	useEffect(() => {
		const ordersRef = collection(db, 'orders')
		const q = query(ordersRef, where('status', '==', 'prepared'))

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setNotifications(querySnapshot.size)
		})

		// Cleanup subscription on unmount
		return () => unsubscribe()
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
