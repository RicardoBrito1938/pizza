import { render } from '@testing-library/react-native'
import { BottomMenu } from '../ui/bottom-menu'

describe('BottomMenu', () => {
	it('renders correctly with basic props', () => {
		const { getByTestId, getByText } = render(
			<BottomMenu title='Home' color='#FFFFFF' />,
		)

		const container = getByTestId('bottom-menu-container')
		const title = getByTestId('bottom-menu-title')

		expect(container).toBeTruthy()
		expect(title).toBeTruthy()
		expect(getByText('Home')).toBeTruthy()
	})

	it('renders with active notification when notifications is not "0"', () => {
		const { getByTestId, getByText } = render(
			<BottomMenu title='Cart' color='#FFFFFF' notifications='5' />,
		)

		const notification = getByTestId('bottom-menu-notification')
		const quantity = getByTestId('bottom-menu-quantity')

		expect(notification).toBeTruthy()
		expect(quantity).toBeTruthy()
		expect(getByText('5')).toBeTruthy()
	})

	it('renders with inactive notification when notifications is "0"', () => {
		const { getByTestId, getByText } = render(
			<BottomMenu title='Notifications' color='#FFFFFF' notifications='0' />,
		)

		const notification = getByTestId('bottom-menu-notification')
		const quantity = getByTestId('bottom-menu-quantity')

		expect(notification).toBeTruthy()
		expect(quantity).toBeTruthy()
		expect(getByText('0')).toBeTruthy()
	})

	it('does not render notification when notifications prop is not provided', () => {
		const { queryByTestId } = render(
			<BottomMenu title='Profile' color='#FFFFFF' />,
		)

		const notification = queryByTestId('bottom-menu-notification')
		const quantity = queryByTestId('bottom-menu-quantity')

		expect(notification).toBeFalsy()
		expect(quantity).toBeFalsy()
	})

	it('applies the color to the title', () => {
		const testColor = '#FF0000'
		const { getByTestId } = render(
			<BottomMenu title='Settings' color={testColor} />,
		)

		const title = getByTestId('bottom-menu-title')
		expect(title.props.style).toEqual(
			expect.objectContaining({ color: testColor }),
		)
	})

	it('renders with numeric notifications', () => {
		const { getByText } = render(
			<BottomMenu title='Messages' color='#FFFFFF' notifications={3} />,
		)

		expect(getByText('3')).toBeTruthy()
	})
})
