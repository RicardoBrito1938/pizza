import Product from '@/app/product/[id]'
import { render, waitFor } from '@testing-library/react-native'

// Mock the expo-router module
jest.mock('expo-router', () => ({
	useLocalSearchParams: jest.fn(() => ({
		id: 'mocked-product-id',
	})),
	// Add any other hooks or functions from expo-router that your component might use
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		back: jest.fn(),
	})),
}))

describe('Product Detail Screen', () => {
	it('renders the product page with mocked ID parameter', () => {
		// Now your test can expect the component to use the mocked 'id' parameter
		// Add assertions based on how your component should behave with this ID
	})
})
