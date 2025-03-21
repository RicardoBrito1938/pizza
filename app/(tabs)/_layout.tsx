import { Tabs } from 'expo-router'
import extendedTheme from '@/styles/extendedTheme'
import { BottomMenu } from '@/components/ui/bottom-menu'

export default function TabLayout() {
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
				name='index'
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
						<BottomMenu title='Orders' color={color} notifications='5' />
					),
				}}
			/>
		</Tabs>
	)
}
