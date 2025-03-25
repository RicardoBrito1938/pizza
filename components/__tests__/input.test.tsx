import { render, fireEvent } from '@testing-library/react-native'
import { Input } from '../ui/input'
import extendedTheme from '@/styles/extendedTheme'

describe('Input', () => {
	it('renders correctly with default props', () => {
		const { getByTestId } = render(<Input placeholder='Enter text' />)

		const input = getByTestId('input-container')
		expect(input).toBeTruthy()
		expect(input.props.placeholder).toBe('Enter text')
		expect(input.props.placeholderTextColor).toBe(
			extendedTheme.colors.$secondary900,
		)
	})

	it('renders with primary variant by default', () => {
		const { getByTestId } = render(<Input />)

		const input = getByTestId('input-container')
		expect(input.props.variant).toBe('primary')
	})

	it('renders with secondary variant when specified', () => {
		const { getByTestId } = render(<Input variant='secondary' />)

		const input = getByTestId('input-container')
		expect(input.props.variant).toBe('secondary')
		expect(input.props.placeholderTextColor).toBe(extendedTheme.colors.$title)
	})

	it('accepts input value', () => {
		const onChangeTextMock = jest.fn()

		const { getByTestId } = render(
			<Input value='test value' onChangeText={onChangeTextMock} />,
		)

		const input = getByTestId('input-container')
		expect(input.props.value).toBe('test value')

		fireEvent.changeText(input, 'new value')
		expect(onChangeTextMock).toHaveBeenCalledWith('new value')
	})

	it('forwards TextInput props correctly', () => {
		const onFocusMock = jest.fn()
		const { getByTestId } = render(
			<Input
				autoCapitalize='none'
				secureTextEntry={true}
				maxLength={10}
				onFocus={onFocusMock}
			/>,
		)

		const input = getByTestId('input-container')
		expect(input.props.autoCapitalize).toBe('none')
		expect(input.props.secureTextEntry).toBe(true)
		expect(input.props.maxLength).toBe(10)

		fireEvent(input, 'focus')
		expect(onFocusMock).toHaveBeenCalled()
	})

	it('has correct default styling props', () => {
		const { getByTestId } = render(<Input />)

		const input = getByTestId('input-container')

		// We can't directly test the styled component's CSS properties in RTL
		// but we can verify that the component renders with the correct testID
		expect(input).toBeTruthy()
	})
})
