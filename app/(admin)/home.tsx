import { useAuth } from '@/hooks/auth'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import happyEmoji from '@/assets/images/happy.png'
import { MaterialIcons } from '@expo/vector-icons'
import { Search } from '@/components/ui/search'
import { ProductCard, type ProductProps } from '@/components/ui/product-card'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase'
import { type Route, useRouter } from 'expo-router'

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
	const { signOut, user } = useAuth()
	const routes = useRouter()
	const [pizzas, setPizzas] = useState<ProductProps[]>([])
	const [searchValue, setSearchValue] = useState('')

	const fetchPizzas = useCallback(async (value: string) => {
		const formattedValue = value.trim().toLowerCase()

		try {
			const { data, error } = await supabase
				.from('pizzas')
				.select('*')
				.ilike('name', `%${formattedValue}%`)

			if (error) {
				throw error
			}

			setPizzas(data as ProductProps[])
		} catch (error) {
			Alert.alert('Error', 'An error occurred while fetching pizzas')
		}
	}, [])

	const handleClear = () => {
		setSearchValue('')
		fetchPizzas('')
	}

	const handleOpenProduct = (id: string) => {
		const route = user?.isAdmin ? `/product/${id}` : `/order/${id}`
		routes.push(route as Route)
	}

	const HandleAdd = () => {
		routes.push('/product')
	}

	useEffect(() => {
		fetchPizzas(searchValue)
	}, [searchValue, fetchPizzas])

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
					<GreetingText>Hello, User</GreetingText>
				</Greeting>
				<Pressable
					onPress={signOut}
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
