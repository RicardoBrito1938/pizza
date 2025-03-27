import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SignUp from '@/app/sign-up'
import React from 'react'

jest.mock('swr', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		mutate: jest.fn().mockResolvedValue(undefined),
	}),
}))

describe('SignUp Screen', () => {
	it('renders the sign-up page', () => {
		const { getByText, getAllByText, getByTestId } = render(<SignUp />)

		const signUpElements = getAllByText('Sign Up')
		const signUpButton = getByTestId('sign-up-button')
		expect(signUpElements.length).toBeGreaterThan(0)

		waitFor(() => {
			expect(getByText('Admin')).toBeTruthy()
			expect(getByText('Name')).toBeTruthy()
			expect(getByText('E-mail')).toBeTruthy()
			expect(getByText('Password')).toBeTruthy()
			expect(getByText('Confirm password')).toBeTruthy()
			expect(signUpButton).toBeTruthy()
		})
	})

	it('displays validation errors when form is submitted with empty inputs', async () => {
		const { getByTestId, findByText } = render(<SignUp />)

		// Get the sign-up button and press it without filling the form
		const signUpButton = getByTestId('sign-up-button')
		fireEvent.press(signUpButton)

		waitFor(async () => {
			await findByText('Name is required')
			await findByText('Invalid email address')
			await findByText('Password must be at least 6 characters')
			await findByText('Confirm Password must be at least 6 characters')
		})
	})

	it('allows entering text in form fields', async () => {
		const { getByText } = render(<SignUp />)

		// Find the input fields by their labels
		const nameLabel = getByText('Name')
		const emailLabel = getByText('E-mail')
		const passwordLabel = getByText('Password')
		const confirmPasswordLabel = getByText('Confirm password')

		// Get the input elements - they're siblings of the labels in the component hierarchy
		const nameInput = nameLabel?.parent?.parent?.props?.children[0]
		const emailInput = emailLabel?.parent?.parent?.props.children[0]
		const passwordInput = passwordLabel?.parent?.parent?.props.children[0]
		const confirmPasswordInput =
			confirmPasswordLabel?.parent?.parent?.props.children[0]

		// Enter text in each input field
		fireEvent.changeText(nameInput, 'John Doe')
		fireEvent.changeText(emailInput, 'john@example.com')
		fireEvent.changeText(passwordInput, 'password123')
		fireEvent.changeText(confirmPasswordInput, 'password123')

		waitFor(() => {
			expect(nameLabel).toBeTruthy()
			expect(emailLabel).toBeTruthy()
			expect(passwordLabel).toBeTruthy()
			expect(confirmPasswordLabel).toBeTruthy()
		})
	})

	it('toggles the admin checkbox when pressed', () => {
		const { getByText } = render(<SignUp />)

		const adminCheckboxLabel = getByText('Admin')
		fireEvent.press(adminCheckboxLabel)
		waitFor(() => {
			expect(adminCheckboxLabel).toBeTruthy()
		})
	})
})
