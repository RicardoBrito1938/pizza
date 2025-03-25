import { render, fireEvent } from '@testing-library/react-native'
import { RadioButton } from '../ui/radio-button'

describe('RadioButton', () => {
	it('renders correctly with required props', () => {
		const { getByTestId, getByText } = render(<RadioButton title='Option 1' />)

		expect(getByTestId('radio-button-container')).toBeTruthy()
		expect(getByTestId('radio-outer-circle')).toBeTruthy()
		expect(getByTestId('radio-title')).toBeTruthy()
		expect(getByText('Option 1')).toBeTruthy()
	})

	it('does not show selected indicator when not selected', () => {
		const { queryByTestId } = render(
			<RadioButton title='Option 1' selected={false} />,
		)

		expect(queryByTestId('radio-selected-indicator')).toBeFalsy()
	})

	it('shows selected indicator when selected', () => {
		const { getByTestId } = render(
			<RadioButton title='Option 1' selected={true} />,
		)

		expect(getByTestId('radio-selected-indicator')).toBeTruthy()
	})

	it('handles press events', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<RadioButton title='Option 1' onPress={onPressMock} />,
		)

		const radioButton = getByTestId('radio-button-container')
		fireEvent.press(radioButton)

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})

	it('applies selected styling when selected', () => {
		const { getByTestId, rerender } = render(
			<RadioButton title='Option 1' selected={true} />,
		)

		const container = getByTestId('radio-button-container')
		expect(container.props.selected).toBe('true')

		// Test unselected state
		rerender(<RadioButton title='Option 1' selected={false} />)
		expect(container.props.selected).toBe('false')
	})

	it('displays the correct title', () => {
		const testTitle = 'Test Radio Option'
		const { getByText } = render(<RadioButton title={testTitle} />)

		expect(getByText(testTitle)).toBeTruthy()
	})
})
