import React from 'react'
import { render } from '@testing-library/react-native'
import { Button } from '../ui/button'

describe('Button', () => {
	it('renders correctly', () => {
		const { getByText } = render(<Button title='Test Button' />)

		// Check if the button with the specified text is in the document
		const buttonText = getByText('Test Button')
		expect(buttonText).toBeTruthy()
	})
})
