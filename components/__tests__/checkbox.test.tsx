import { render, fireEvent } from '@testing-library/react-native'
import { Checkbox } from '../ui/checkbox'

describe('Checkbox', () => {
	it('renders correctly with label', () => {
		const { getByTestId, getByText } = render(
			<Checkbox checked={false} onPress={jest.fn()} label='Accept terms' />,
		)

		const container = getByTestId('checkbox-container')
		const input = getByTestId('checkbox-input')
		const label = getByTestId('checkbox-label')

		expect(container).toBeTruthy()
		expect(input).toBeTruthy()
		expect(label).toBeTruthy()
		expect(getByText('Accept terms')).toBeTruthy()
	})

	it('renders without label when not provided', () => {
		const { getByTestId, queryByTestId } = render(
			<Checkbox checked={false} onPress={jest.fn()} />,
		)

		const container = getByTestId('checkbox-container')
		const input = getByTestId('checkbox-input')
		const label = queryByTestId('checkbox-label')

		expect(container).toBeTruthy()
		expect(input).toBeTruthy()
		expect(label).toBeFalsy() // Label shouldn't exist
	})

	it('shows the correct checked state', () => {
		const { getByTestId, rerender } = render(
			<Checkbox checked={true} onPress={jest.fn()} label='Checked box' />,
		)

		const input = getByTestId('checkbox-input')
		expect(input.props.accessibilityState.checked).toBe(true)

		// Test unchecked state
		rerender(
			<Checkbox checked={false} onPress={jest.fn()} label='Unchecked box' />,
		)

		expect(input.props.accessibilityState.checked).toBe(false)
	})

	it('calls onPress when checkbox is clicked', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<Checkbox
				checked={false}
				onPress={onPressMock}
				label='Clickable checkbox'
			/>,
		)

		const input = getByTestId('checkbox-input')
		fireEvent(input, 'onClick')

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})
})
