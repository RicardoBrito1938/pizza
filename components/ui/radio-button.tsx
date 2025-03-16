import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { Pressable, type PressableProps, Text, View } from 'react-native'

const Container = styled(Pressable, {
	width: 104,
	height: 82,
	borderRadius: 8,
	paddingVertical: 14,
	paddingHorizontal: 16,
	borderWidth: 1,
	variants: {
		selected: {
			true: {
				borderColor: extendedTheme.colors.$success900,
				backkgroundColor: extendedTheme.colors.$success50,
			},
			false: {
				borderColor: extendedTheme.colors.$shape,
				backgroundColor: extendedTheme.colors.$title,
			},
		},
	},
})

export const Title = styled(Text, {
	fontSize: 16,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

export const Radio = styled(View, {
	width: 20,
	height: 20,
	borderRadius: 10,
	borderWidth: 1,
	borderColor: extendedTheme.colors.$secondary900,
	marginBottom: 16,
	justifyContent: 'center',
	alignItems: 'center',
})

export const Selected = styled(View, {
	width: 8,
	height: 8,
	borderRadius: 4,
	backgroundColor: extendedTheme.colors.$success900,
})

type RadioButtonProps = PressableProps & {
	selected?: boolean
	title: string
}

export const RadioButton = ({
	selected = false,
	...props
}: RadioButtonProps) => {
	return (
		<Container selected={selected ? 'true' : 'false'} {...props}>
			<Radio>{selected && <Selected />}</Radio>
			<Title>{props.title}</Title>
		</Container>
	)
}
