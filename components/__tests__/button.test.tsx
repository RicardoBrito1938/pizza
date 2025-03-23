import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Button } from '../ui/button'

describe('Button', () => {
	it('renders correctly with title', () => {
		render(<Button title='Click me' />)

		const buttonText = screen.getByText('Click me')
		expect(buttonText).toBeTruthy()
	})
})
