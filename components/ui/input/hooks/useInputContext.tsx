import { useContext } from 'react'
import { InputContext } from '../root'

export const useInputContext = () => {
	const context = useContext(InputContext)
	if (!context) {
		throw new Error('Input.Control must be used within Input.Root')
	}
	return context
}
