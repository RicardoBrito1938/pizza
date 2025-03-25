import { render, fireEvent } from '@testing-library/react-native'
import { ProductCard } from '../ui/product-card'

// Mock Feather icons
jest.mock('@expo/vector-icons', () => {
	const React = require('react')
	const { View } = require('react-native')

	return {
		Feather: jest.fn(({ name, size, color, testID }) => {
			return React.createElement(View, { testID, name, size, color })
		}),
	}
})

// Mock sample product data
const mockProduct = {
	id: '1',
	photo_url: 'https://example.com/pizza.jpg',
	name: 'Pepperoni Pizza',
	description: 'Classic pepperoni pizza with cheese and tomato sauce',
}

describe('ProductCard', () => {
	it('renders correctly with provided data', () => {
		const { getByTestId, getByText } = render(
			<ProductCard data={mockProduct} />,
		)

		expect(getByTestId('product-card-container')).toBeTruthy()
		expect(getByTestId('product-card-content')).toBeTruthy()
		expect(getByTestId('product-card-image')).toBeTruthy()
		expect(getByTestId('product-card-details')).toBeTruthy()
		expect(getByTestId('product-card-name')).toBeTruthy()
		expect(getByTestId('product-card-description')).toBeTruthy()
		expect(getByTestId('product-card-chevron')).toBeTruthy()
		expect(getByTestId('product-card-line')).toBeTruthy()

		expect(getByText('Pepperoni Pizza')).toBeTruthy()
		expect(
			getByText('Classic pepperoni pizza with cheese and tomato sauce'),
		).toBeTruthy()
	})

	it('sets correct image source', () => {
		const { getByTestId } = render(<ProductCard data={mockProduct} />)

		const image = getByTestId('product-card-image')
		expect(image.props.source).toEqual({ uri: mockProduct.photo_url })
	})

	it('handles press events', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<ProductCard data={mockProduct} onPress={onPressMock} />,
		)

		const content = getByTestId('product-card-content')
		fireEvent.press(content)

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})

	it('renders product details correctly', () => {
		const customProduct = {
			id: '2',
			photo_url: 'https://example.com/veggie.jpg',
			name: 'Veggie Supreme',
			description: 'Loaded with fresh vegetables',
		}

		const { getByText } = render(<ProductCard data={customProduct} />)

		expect(getByText('Veggie Supreme')).toBeTruthy()
		expect(getByText('Loaded with fresh vegetables')).toBeTruthy()
	})

	it('passes additional props to the content component', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<ProductCard
				data={mockProduct}
				disabled={true}
				accessibilityLabel='Product item'
				onPress={onPressMock}
			/>,
		)

		const content = getByTestId('product-card-content')

		// In React Native Testing Library, we need to check accessibility state for disabled
		expect(content.props.accessibilityState).toEqual(
			expect.objectContaining({ disabled: true }),
		)

		expect(content.props.accessibilityLabel).toBe('Product item')

		// Verify that the press handler is not called when disabled
		fireEvent.press(content)
		expect(onPressMock).not.toHaveBeenCalled()
	})
})
