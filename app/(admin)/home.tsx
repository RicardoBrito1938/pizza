import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import happyEmoji from '@/assets/images/happy.png'
import { MaterialIcons } from '@expo/vector-icons'
import { Search } from '@/components/ui/search'
import { ProductCard } from '@/components/ui/product-card'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/supabase/supabase'
import { type Route, useRouter } from 'expo-router'
import useSWR from 'swr'
import { fetchUser } from '@/utils/auth'
import { fetchPizzas } from '@/utils/api'

const Container = styled(View, {
	flex: 1,
	backgroundColor: extendedTheme.colors.$background,
})

const Header = styled(LinearGradient, {
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingTop: getStatusBarHeight() + 33,
	paddingBottom: 58,
	paddingHorizontal: 24,
})

const Greeting = styled(View, {
	flexDirection: 'row',
	alignItems: 'center',
})

const GreetingEmoji = styled(Image, {
	height: 32,
	width: 32,
	marginRight: 8,
})

const GreetingText = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 20,
	fontFamily: extendedTheme.fonts.$titleFont,
})

const MenuHeader = styled(View, {
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	margin: 24,
	marginBottom: 0,
	paddingBottom: 22,
	borderBottomWidth: 1,
	borderBottomColor: extendedTheme.colors.$shape,
})

const MenuItemNumber = styled(Text, {
	fontSize: 14,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

const Title = styled(Text, {
	fontSize: 20,
	lineHeight: 24,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$titleFont,
})

const Body = styled(View, {
	flex: 1,
	paddingHorizontal: 24,
	paddingBottom: 48,
})

export default function Home() {
	const { data: user, mutate: mutateUser } = useSWR('/user', fetchUser)
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')

	// Using SWR to fetch pizzas with the search value as a key
	const { data: pizzas = [], mutate: mutatePizzas } = useSWR(
		['pizzas', searchValue],
		() => fetchPizzas(searchValue),
		{
			revalidateOnFocus: true,
			dedupingInterval: 2000,
		},
	)

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			Alert.alert('Sign Out Error', error.message || 'Sign out failed')
			return
		}

		await mutateUser(null, false) // Update the SWR cache
		router.navigate('/sign-in')
	}

	const handleClear = () => {
		setSearchValue('')
	}

	const handleOpenProduct = (id: string) => {
		const route = user?.isAdmin ? `/product/${id}` : `/order/${id}`
		router.push(route as Route)
	}

	const HandleAdd = () => {
		router.push('/product')
	}

	return (
		<Container>
			<Header
				colors={[
					extendedTheme.tokens.$gradientStart,
					extendedTheme.tokens.$gradientEnd,
				]}
			>
				<Greeting>
					<GreetingEmoji source={happyEmoji} />
					<GreetingText>
						Hello, {user?.email?.split('@')[0] || 'User'}
					</GreetingText>
				</Greeting>
				<Pressable
					onPress={handleSignOut}
					style={({ pressed }) => [
						{
							opacity: pressed ? 0.7 : 1,
							padding: 8,
						},
					]}
				>
					<MaterialIcons
						name='logout'
						size={24}
						color={extendedTheme.colors.$title}
						testID='icon-logout'
					/>
				</Pressable>
			</Header>
			<Search
				onChangeText={setSearchValue}
				value={searchValue}
				onClear={handleClear}
				testID='home-search'
			/>

			<MenuHeader>
				<Title>Menu</Title>
				<MenuItemNumber>{pizzas.length} pizzas</MenuItemNumber>
			</MenuHeader>

			<Body>
				<FlatList
					data={pizzas}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<ProductCard
							data={item}
							onPress={() => handleOpenProduct(item.id)}
						/>
					)}
					contentContainerStyle={{
						paddingTop: 20,
					}}
				/>
				{user?.isAdmin && (
					<Button
						title='Register pizza'
						variant='secondary'
						onPress={HandleAdd}
					/>
				)}
			</Body>
		</Container>
	)
}
