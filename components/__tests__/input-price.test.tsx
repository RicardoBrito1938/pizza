import { render, fireEvent } from '@testing-library/react-native'
import { InputPrice } from '../ui/input-price'

describe('InputPrice', () => {
	it('renders correctly with required props', () => {
		const { getByTestId, getByText } = render(<InputPrice size='P' />)

		const container = getByTestId('input-price-container')
		const sizeContainer = getByTestId('input-price-size-container')
		const sizeLabel = getByTestId('input-price-size-label')
		const currencyLabel = getByTestId('input-price-currency-label')
		const input = getByTestId('input-price-input')

		expect(container).toBeTruthy()
		expect(sizeContainer).toBeTruthy()
		expect(sizeLabel).toBeTruthy()
		expect(currencyLabel).toBeTruthy()
		expect(input).toBeTruthy()

		// Check text content
		expect(getByText('P')).toBeTruthy()
		expect(getByText('£')).toBeTruthy()
	})

	it('displays the size provided as prop', () => {
		const { getByText } = render(<InputPrice size='L' />)
		expect(getByText('L')).toBeTruthy()
	})

	it('uses numeric keyboard type', () => {
		const { getByTestId } = render(<InputPrice size='M' />)
		const input = getByTestId('input-price-input')
		expect(input.props.keyboardType).toBe('numeric')
	})

	it('accepts input value', () => {
		// We need to test with an explicit value prop and onChangeText handler
		const onChangeTextMock = jest.fn()

		const { getByTestId } = render(
			<InputPrice size='M' value='9.99' onChangeText={onChangeTextMock} />,
		)

		const input = getByTestId('input-price-input')

		// First verify the value is what we passed in
		expect(input.props.value).toBe('9.99')

		// Then test that onChangeText is called when we change the text
		fireEvent.changeText(input, '10.99')
		expect(onChangeTextMock).toHaveBeenCalledWith('10.99')
	})

	it('forwards other TextInput props correctly', () => {
		const onChangeTextMock = jest.fn()
		const placeholder = 'Enter price'

		const { getByTestId } = render(
			<InputPrice
				size='S'
				placeholder={placeholder}
				onChangeText={onChangeTextMock}
			/>,
		)

		const input = getByTestId('input-price-input')
		expect(input.props.placeholder).toBe(placeholder)

		fireEvent.changeText(input, '5.99')
		expect(onChangeTextMock).toHaveBeenCalledWith('5.99')
	})

	it('is accessible with testIDs', () => {
		const { getByTestId } = render(<InputPrice size='XL' />)

		expect(getByTestId('input-price-container')).toBeTruthy()
		expect(getByTestId('input-price-size-container')).toBeTruthy()
		expect(getByTestId('input-price-size-label')).toBeTruthy()
		expect(getByTestId('input-price-currency-label')).toBeTruthy()
		expect(getByTestId('input-price-input')).toBeTruthy()
	})
})
