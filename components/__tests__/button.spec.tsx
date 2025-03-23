import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../ui/button' // Adjust path as needed

// Mock the theme
jest.mock('@/styles/extendedTheme', () => ({
	__esModule: true,
	default: {
		colors: {
			$primary900: '#000',
			$success900: '#000',
			$title: '#000',
		},
		fonts: {
			$textFont: 'System',
		},
	},
}))

describe('Button', () => {
	it('renders correctly with default props', () => {
		const { getByText } = render(<Button title='Test Button' />)

		const buttonText = getByText('Test Button')
		expect(buttonText).toBeTruthy()
	})

	it('renders with primary variant by default', () => {
		const { getByText } = render(<Button title='Primary Button' />)
		expect(getByText('Primary Button')).toBeTruthy()
	})

	it('renders with secondary variant when specified', () => {
		const { getByText } = render(
			<Button title='Secondary Button' variant='secondary' />,
		)
		expect(getByText('Secondary Button')).toBeTruthy()
	})

	it('shows loading indicator when loading is true', () => {
		const { queryByText, getByTestId } = render(
			<Button title='Loading Button' loading={true} />,
		)

		// Text should not be visible when loading
		expect(queryByText('Loading Button')).toBeNull()

		// Loading spinner should be present
		expect(getByTestId('loading-indicator')).toBeTruthy()
	})

	it('disables the button when loading', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<Button title='Loading Button' loading={true} onPress={onPressMock} />,
		)

		const pressable = getByTestId('button-container')
		fireEvent.press(pressable)

		expect(onPressMock).not.toHaveBeenCalled()
	})

	it('calls onPress function when pressed', () => {
		const onPressMock = jest.fn()
		const { getByTestId } = render(
			<Button title='Clickable Button' onPress={onPressMock} />,
		)

		const pressable = getByTestId('button-container')
		fireEvent.press(pressable)

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})
})
