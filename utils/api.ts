import { supabase } from '@/supabase/supabase'

export type Order = {
	id: string
	quantity: number
	amount: number
	pizza: string
	size: string
	table_number: string
	status: string
	waiter_id: string
	image: string
	created_at?: string
}

export type Pizza = {
	id: string
	name: string
	description: string
	price_size_s: number
	price_size_m: number
	price_size_l: number
	photo_url: string
	photo_path: string
	price_sizes?: {
		S: number
		M: number
		L: number
	}
}

/**
 * Fetches all orders sorted by creation date
 */
export const fetchOrders = async (): Promise<Order[]> => {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data as Order[]
}

/**
 * Fetches prepared orders count for notifications
 */
export const fetchNotifications = async (): Promise<number> => {
	const { data, error } = await supabase
		.from('orders')
		.select('*', { count: 'exact' })
		.eq('status', 'prepared')

	if (error) {
		throw error
	}

	return data.length
}

/**
 * Fetches a single pizza by ID
 */
export const fetchPizzaById = async (id: string): Promise<Pizza | null> => {
	if (!id) return null

	const { data, error } = await supabase
		.from('pizzas')
		.select('*')
		.eq('id', id)
		.single()

	if (error) {
		throw error
	}

	// Transform the fetched data to include a price_sizes object
	const transformedData = {
		...data,
		price_sizes: {
			S: data.price_size_s,
			M: data.price_size_m,
			L: data.price_size_l,
		},
	}

	return transformedData as Pizza
}

/**
 * Fetches pizzas with optional name search filter
 */
export const fetchPizzas = async (
	searchValue: string = '',
): Promise<Pizza[]> => {
	const formattedValue = searchValue.trim().toLowerCase()

	const { data, error } = await supabase
		.from('pizzas')
		.select('*')
		.ilike('name', `%${formattedValue}%`)

	if (error) {
		throw error
	}

	return data as Pizza[]
}
