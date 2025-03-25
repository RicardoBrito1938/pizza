import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../ui/button'

describe('Button', () => {
	it('renders correctly with default props', () => {
		const { getByTestId, getByText } = render(<Button title='Test Button' />)

		const buttonContainer = getByTestId('button-container')
		const buttonText = getByTestId('button-text')

		expect(buttonContainer).toBeTruthy()
		expect(buttonText).toBeTruthy()
		expect(getByText('Test Button')).toBeTruthy()
	})

	it('renders correctly with primary variant', () => {
		const { getByTestId, getByText } = render(
			<Button title='Primary Button' variant='primary' />,
		)

		const buttonContainer = getByTestId('button-container')
		expect(buttonContainer).toBeTruthy()
		expect(getByText('Primary Button')).toBeTruthy()
	})

	it('renders correctly with secondary variant', () => {
		const { getByTestId, getByText } = render(
			<Button title='Secondary Button' variant='secondary' />,
		)

		const buttonContainer = getByTestId('button-container')
		expect(buttonContainer).toBeTruthy()
		expect(getByText('Secondary Button')).toBeTruthy()
	})

	it('displays loading indicator when loading is true', () => {
		const { queryByText, getByTestId } = render(
			<Button title='Loading Button' loading={true} />,
		)

		// Text should not be visible when loading
		expect(queryByText('Loading Button')).toBeFalsy()

		const loadingIndicator = getByTestId('button-loading-indicator')
		expect(loadingIndicator).toBeTruthy()
	})

	it('calls onPress when button is pressed', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<Button title='Pressable Button' onPress={onPressMock} />,
		)

		const buttonContainer = getByTestId('button-container')
		fireEvent.press(buttonContainer)

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})

	it('does not call onPress when button is disabled due to loading', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<Button title='Disabled Button' loading={true} onPress={onPressMock} />,
		)

		const buttonContainer = getByTestId('button-container')
		fireEvent.press(buttonContainer)

		expect(onPressMock).not.toHaveBeenCalled()
	})
})
