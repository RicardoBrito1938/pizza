import { render } from '@testing-library/react-native'
import { Photo } from '../ui/photo'

describe('Photo', () => {
	it('renders image when uri is provided', () => {
		const testUri = 'https://example.com/photo.jpg'
		const { getByTestId, queryByTestId } = render(<Photo uri={testUri} />)

		// Image should be rendered
		const image = getByTestId('photo-image')
		expect(image).toBeTruthy()
		expect(image.props.source).toEqual({ uri: testUri })

		// Placeholder should not be rendered
		const placeholder = queryByTestId('photo-placeholder')
		expect(placeholder).toBeFalsy()
	})

	it('renders placeholder when uri is not provided', () => {
		const { getByTestId, queryByTestId, getByText } = render(<Photo />)

		// Placeholder should be rendered
		const placeholder = getByTestId('photo-placeholder')
		expect(placeholder).toBeTruthy()

		// Placeholder title should be visible
		const placeholderTitle = getByTestId('photo-placeholder-title')
		expect(placeholderTitle).toBeTruthy()
		expect(getByText('No photo loaded')).toBeTruthy()

		// Image should not be rendered
		const image = queryByTestId('photo-image')
		expect(image).toBeFalsy()
	})

	it('renders placeholder when uri is null', () => {
		const { getByTestId, queryByTestId } = render(<Photo uri={null} />)

		// Placeholder should be rendered
		const placeholder = getByTestId('photo-placeholder')
		expect(placeholder).toBeTruthy()

		// Image should not be rendered
		const image = queryByTestId('photo-image')
		expect(image).toBeFalsy()
	})

	it('forwards rest props to the Image component', () => {
		const testProps = {
			resizeMode: 'cover',
			accessibilityLabel: 'Test photo',
		}

		const { getByTestId } = render(
			<Photo
				uri='https://example.com/test.jpg'
				resizeMode={testProps.resizeMode}
				accessibilityLabel={testProps.accessibilityLabel}
			/>,
		)

		const image = getByTestId('photo-image')
		expect(image.props.resizeMode).toBe(testProps.resizeMode)
		expect(image.props.accessibilityLabel).toBe(testProps.accessibilityLabel)
	})
})
