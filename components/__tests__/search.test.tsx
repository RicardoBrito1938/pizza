import { render, fireEvent } from '@testing-library/react-native'
import { Search } from '../ui/search'

// @expo/vector-icons mock is now in jest.setup.js

describe('Search', () => {
	it('renders correctly with all elements', () => {
		const { getByTestId } = render(
			<Search onSearch={jest.fn()} onClear={jest.fn()} />,
		)

		expect(getByTestId('search-container')).toBeTruthy()
		expect(getByTestId('search-input-area')).toBeTruthy()
		expect(getByTestId('search-input')).toBeTruthy()
		expect(getByTestId('search-clear-button')).toBeTruthy()
		expect(getByTestId('search-clear-icon')).toBeTruthy()
		expect(getByTestId('search-button')).toBeTruthy()
		expect(getByTestId('search-icon')).toBeTruthy()
	})

	it('calls onClear when clear button is pressed', () => {
		const onClearMock = jest.fn()
		const { getByTestId } = render(
			<Search onSearch={jest.fn()} onClear={onClearMock} />,
		)

		const clearButton = getByTestId('search-clear-button')
		fireEvent.press(clearButton)

		expect(onClearMock).toHaveBeenCalledTimes(1)
	})

	it('calls onSearch when search button is pressed', () => {
		const onSearchMock = jest.fn()
		const { getByTestId } = render(
			<Search onSearch={onSearchMock} onClear={jest.fn()} />,
		)

		const searchButton = getByTestId('search-button')
		fireEvent.press(searchButton)

		expect(onSearchMock).toHaveBeenCalledTimes(1)
	})

	it('renders input with placeholder text', () => {
		const { getByPlaceholderText } = render(
			<Search onSearch={jest.fn()} onClear={jest.fn()} />,
		)

		expect(getByPlaceholderText('search...')).toBeTruthy()
	})

	it('handles text input correctly', () => {
		const onChangeTextMock = jest.fn()
		const { getByTestId } = render(
			<Search
				onSearch={jest.fn()}
				onClear={jest.fn()}
				onChangeText={onChangeTextMock}
			/>,
		)

		const input = getByTestId('search-input')
		fireEvent.changeText(input, 'pizza')

		expect(onChangeTextMock).toHaveBeenCalledWith('pizza')
	})

	it('passes additional props to the TextInput', () => {
		const { getByTestId } = render(
			<Search
				onSearch={jest.fn()}
				onClear={jest.fn()}
				autoCapitalize='none'
				value='test'
			/>,
		)

		const input = getByTestId('search-input')
		expect(input.props.autoCapitalize).toBe('none')
		expect(input.props.value).toBe('test')
	})
})
