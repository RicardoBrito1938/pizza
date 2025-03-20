import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { View } from 'react-native'

export const ItemSeparator = styled(View, {
	height: 1,
	width: '100%',
	backgroundColor: extendedTheme.colors.$shape,
})
