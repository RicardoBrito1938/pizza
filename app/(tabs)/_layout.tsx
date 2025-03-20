import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { IconSymbol } from '@/components/ui/IconSymbol'
import extendedTheme from '@/styles/extendedTheme'

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: extendedTheme.colors.$secondary900,
				tabBarInactiveTintColor: extendedTheme.colors.$secondary400,
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: {
					position: Platform.OS === 'ios' ? 'absolute' : 'relative',
					height: 80,
					paddingVertical: Platform.OS === 'ios' ? 20 : 0,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name='house.fill' color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='orders'
				options={{
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name='paperplane.fill' color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
