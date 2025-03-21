import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import {
	Image,
	Text,
	TouchableOpacity,
	type TouchableOpacityProps,
	View,
} from 'react-native'

const Container = styled(TouchableOpacity, {
	width: '50%',
	padding: 24,
	alignItems: 'center',
	borderRightColor: extendedTheme.colors.$shape,
	variants: {
		borderRight: {
			true: {
				borderRightWidth: 1,
			},
			false: {
				borderRightWidth: 0,
			},
		},
	},
})

const StyledImage = styled(Image, {
	width: 140,
	height: 140,
	borderRadius: 70,
})

const Name = styled(Text, {
	fontSize: 20,
	marginTop: 21,
	fontFamily: extendedTheme.fonts.$titleFont,
	color: extendedTheme.colors.$secondary900,
})

const Description = styled(Text, {
	fontSize: 14,
	marginTop: 11,
	fontFamily: extendedTheme.fonts.$textFont,
	color: extendedTheme.colors.$secondary400,
})

const StatusContainer = styled(View, {
	paddingVertical: 4,
	paddingHorizontal: 16,
	borderRadius: 12,
	marginTop: 16,
	alignItems: 'center',
	justifyContent: 'center',

	variants: {
		status: {
			preparing: {
				backgroundColor: extendedTheme.colors.$alert50,
				borderColor: extendedTheme.colors.$alert900,
				borderWidth: 1,
			},
			prepared: {
				backgroundColor: extendedTheme.colors.$success900,
			},
			delivered: {
				backgroundColor: extendedTheme.colors.$secondary900,
			},
		},
	},
})

const StatusLabel = styled(Text, {
	fontSize: 12,
	lineHeight: 20,
	fontFamily: extendedTheme.fonts.$textFont,
	color: extendedTheme.colors.$title,

	variants: {
		status: {
			preparing: {
				color: extendedTheme.colors.$alert900,
			},
			prepared: {
				color: extendedTheme.colors.$title,
			},
			delivered: {
				color: extendedTheme.colors.$title,
			},
		},
	},
})

type Props = TouchableOpacityProps & {
	index: number
	data: {
		pizza: string
		size: string
		quantity: number
		amount: number
		status: string
		image: string
		table_number: string
	}
}

export const OrdersCard = ({ index, data, ...rest }: Props) => {
	const hasBorderRight = index % 2 === 0 ? 'true' : 'false'

	return (
		<Container borderRight={hasBorderRight} {...rest}>
			<StyledImage source={{ uri: data.image }} />
			<Name>{data.pizza}</Name>
			<Description>
				Table {data.table_number} • Qnt: {data.quantity}
			</Description>
			<StatusContainer status={data.status}>
				<StatusLabel status={data.status}>{data.status}</StatusLabel>
			</StatusContainer>
		</Container>
	)
}
