import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { type ImageProps, Image as RNImage, Text, View } from 'react-native'

export const Image = styled(RNImage, {
	width: 160,
	height: 160,
	borderRadius: 80,
})

export const Placeholder = styled(View, {
	width: 160,
	height: 160,
	borderRadius: 80,
	justifyContent: 'center',
	alignItems: 'center',

	borderWidth: 1,
	borderStyle: 'dashed',
	borderColor: extendedTheme.colors.$secondary900,
})

export const PlaceholderTitle = styled(Text, {
	fontSize: 14,
	textAlign: 'center',
	fontFamily: extendedTheme.fonts.$textFont,
	color: extendedTheme.colors.$secondary900,
})

type Props = {
	uri?: string | null
	rest?: ImageProps
}

export const Photo = ({ uri, ...rest }: Props) => {
	return uri ? (
		<Image source={{ uri }} testID='photo-image' {...rest} />
	) : (
		<Placeholder testID='photo-placeholder'>
			<PlaceholderTitle testID='photo-placeholder-title'>
				No photo
				{/* biome-ignore lint/style/noUnusedTemplateLiteral: <explanation> */}
				{`\n`} loaded
			</PlaceholderTitle>
		</Placeholder>
	)
}
