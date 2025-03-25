import { render } from '@testing-library/react-native'
import { IconSymbol } from '../ui/IconSymbol.ios'

// Mock expo-symbols to avoid native module issues in tests
jest.mock('expo-symbols', () => {
	const React = require('react')

	return {
		SymbolView: jest
			.fn()
			.mockImplementation(
				({ name, weight, tintColor, style, testID, resizeMode }) => {
					return React.createElement('View', {
						testID,
						name,
						weight,
						tintColor,
						style,
						resizeMode,
					})
				},
			),
		SymbolWeight: {
			regular: 'regular',
			medium: 'medium',
			semibold: 'semibold',
			bold: 'bold',
		},
	}
})

describe('IconSymbol', () => {
	it('renders correctly with required props', () => {
		const { getByTestId } = render(<IconSymbol name='plus' color='#000000' />)

		const icon = getByTestId('icon-symbol')
		expect(icon).toBeTruthy()
		expect(icon.props.name).toBe('plus')
		expect(icon.props.tintColor).toBe('#000000')
	})

	it('renders with default size when not specified', () => {
		const { getByTestId } = render(<IconSymbol name='star' color='#FFFFFF' />)

		const icon = getByTestId('icon-symbol')
		expect(icon.props.style[0]).toEqual(
			expect.objectContaining({
				width: 24,
				height: 24,
			}),
		)
	})

	it('renders with custom size when specified', () => {
		const customSize = 32
		const { getByTestId } = render(
			<IconSymbol name='heart' color='#FF0000' size={customSize} />,
		)

		const icon = getByTestId('icon-symbol')
		expect(icon.props.style[0]).toEqual(
			expect.objectContaining({
				width: customSize,
				height: customSize,
			}),
		)
	})

	it('renders with default weight when not specified', () => {
		const { getByTestId } = render(
			<IconSymbol name='bookmark' color='#0000FF' />,
		)

		const icon = getByTestId('icon-symbol')
		expect(icon.props.weight).toBe('regular')
	})

	it('renders with custom weight when specified', () => {
		const { getByTestId } = render(
			<IconSymbol name='bell' color='#00FF00' weight='bold' />,
		)

		const icon = getByTestId('icon-symbol')
		expect(icon.props.weight).toBe('bold')
	})

	it('applies custom styles when provided', () => {
		const customStyle = { opacity: 0.5, margin: 10 }
		const { getByTestId } = render(
			<IconSymbol name='trash' color='#FF00FF' style={customStyle} />,
		)

		const icon = getByTestId('icon-symbol')
		// The style prop will be an array with two items:
		// the default size styles and the custom styles
		expect(icon.props.style[1]).toEqual(customStyle)
	})
})
