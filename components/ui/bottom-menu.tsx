import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { Text, View } from 'react-native'

const Container = styled(View, {
	flexDirection: 'row',
	alignItems: 'center',
	width: '100%',
	minWidth: 60,
})

const Title = styled(Text, {
	fontFamily: extendedTheme.fonts.$titleFont,
})

const Notification = styled(View, {
	height: 20,
	borderRadius: 12,
	alignItems: 'center',
	justifyContent: 'center',
	paddingHorizontal: 12,
	marginLeft: 8,

	variants: {
		variant: {
			active: {
				backgroundColor: extendedTheme.colors.$success900,
			},
			inactive: {
				backgroundColor: 'transparent',
				borderWidth: 1,
				borderColor: extendedTheme.colors.$shape,
			},
		},
	},
})

const Quantity = styled(Text, {
	fontFamily: extendedTheme.fonts.$textFont,
	fontSize: 12,
	variants: {
		variant: {
			active: {
				color: extendedTheme.colors.$background,
			},
			inactive: {
				color: extendedTheme.colors.$title,
			},
		},
	},
})

type Props = {
	title: string
	color: string
	notifications?: string | number
}

export const BottomMenu = ({ title, color, notifications }: Props) => {
	const hasNotifications = notifications === '0'
	const variant = !hasNotifications ? 'active' : 'inactive'

	return (
		<Container>
			<Title style={{ color }}>{title}</Title>
			{notifications && (
				<Notification variant={variant}>
					<Quantity variant={variant}>{notifications}</Quantity>
				</Notification>
			)}
		</Container>
	)
}
