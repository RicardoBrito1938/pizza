import { Button } from '@/components/ui/button'
import { ButtonBack } from '@/components/ui/button-back'
import { Photo } from '@/components/ui/photo'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
import * as FileSystem from 'expo-file-system'
import * as mime from 'react-native-mime-types'

import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useState } from 'react'
import { InputPrice } from '@/components/ui/input-price'
import { Input } from '@/components/ui/input'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '@/supabase/supabase'
import useSWR, { mutate } from 'swr'
import { fetchPizzaById } from '@/utils/api'

const Container = styled(KeyboardAvoidingView, {
	flex: 1,
	backgroundColor: extendedTheme.colors.$background,
})

const Header = styled(LinearGradient, {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '100%',
	padding: 24,
	paddingTop: getStatusBarHeight() + 48,
})

const Title = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 24,
	fontFamily: extendedTheme.fonts.$titleFont,
	lineHeight: 32,
})

const DeleteLabel = styled(Text, {
	color: extendedTheme.colors.$title,
	fontSize: 14,
	fontFamily: extendedTheme.fonts.$textFont,
})

const Upload = styled(View, {
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	marginVertical: 32,
})

const PickImageButton = styled(Button, {
	maxWidth: 90,
	marginLeft: 32,
})

const Form = styled(View, {
	padding: 24,
	width: '100%',
})

const Label = styled(Text, {
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

const InputGroup = styled(View, {
	width: '100%',
	marginBottom: 16,
})

const InputGroupHeader = styled(View, {
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
})

const MaxCharacters = styled(Text, {
	fontSize: 10,
	marginBottom: 8,
	color: extendedTheme.colors.$secondary900,
	fontFamily: extendedTheme.fonts.$textFont,
})

const GhostView = styled(View, {
	width: 20,
})

export default function Product() {
	const { id } = useLocalSearchParams()
	const router = useRouter()
	const pizzaId = id ? String(id) : null

	const { data: pizza } = useSWR(pizzaId ? `pizza/${pizzaId}` : null, () =>
		fetchPizzaById(pizzaId as string),
	)

	// Keep only the temporary image state for new uploads
	const [tempImage, setTempImage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	// Get the current image to display - either from the temporary upload or from the pizza data
	const currentImage = tempImage || pizza?.photo_url || null

	const handleImagePick = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'images',
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled) {
			setTempImage(result.assets[0].uri)
		}
	}

	const handleAddPizza = async () => {
		if (
			!currentImage ||
			!pizza?.name.trim() ||
			!pizza?.description.trim() ||
			!pizza?.price_size_s ||
			!pizza?.price_size_m ||
			!pizza?.price_size_l
		) {
			Alert.alert('Validation Error', 'Please fill all fields')
			return
		}

		setIsSubmitting(true)

		try {
			const fileExt = currentImage.split('.').pop()
			const fileName = `${Date.now()}-${pizza.name.replace(/\s+/g, '-')}.${fileExt}`

			const fileUri = currentImage
			const fileType = mime.lookup(fileUri) || 'image/jpeg'

			const formData = new FormData()
			formData.append('file', {
				uri: fileUri,
				name: fileName,
				type: fileType,
			} as any) // we cast to any to avoid React Native type issues

			const { data, error } = await supabase.storage
				.from('pizzas')
				.upload(fileName, formData.get('file') as File, {
					contentType: fileType,
				})

			if (error) {
				console.error('Upload error:', error)
				Alert.alert('Error', 'Image upload failed.')
				return
			}

			const { data: publicUrlData } = supabase.storage
				.from('pizzas')
				.getPublicUrl(fileName)

			const photoUrl = publicUrlData.publicUrl

			const { error: insertError } = await supabase.from('pizzas').insert({
				name: pizza.name,
				description: pizza.description,
				price_size_s: Number.parseFloat(String(pizza.price_size_s)),
				price_size_m: Number.parseFloat(String(pizza.price_size_m)),
				price_size_l: Number.parseFloat(String(pizza.price_size_l)),
				photo_url: photoUrl,
				photo_path: fileName,
			})

			if (insertError) {
				Alert.alert('Error', `Error saving pizza: ${insertError.message}`)
				return
			}

			// Invalidate the pizzas cache to refresh the list
			mutate(
				(key) => typeof key === 'string' && key.startsWith('pizzas'),
				undefined,
				{ revalidate: true },
			)
			Alert.alert('Success', 'Pizza added successfully!')
			router.back()
		} catch (error) {
			console.error('Unexpected error:', error)
			Alert.alert('Error', 'Something went wrong.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeletePizza = async () => {
		if (!id) {
			Alert.alert('Error', 'Pizza ID is missing.')
			return
		}

		setIsSubmitting(true) // Use the renamed state

		try {
			const { data: pizzaData, error: fetchError } = await supabase
				.from('pizzas')
				.select('photo_path')
				.eq('id', id)
				.single()

			if (fetchError || !pizzaData) {
				throw new Error(fetchError?.message || 'Pizza not found.')
			}

			const photoPath = pizzaData.photo_path

			if (photoPath) {
				const { error: deleteImageError } = await supabase.storage
					.from('pizzas')
					.remove([photoPath])

				if (deleteImageError) {
					console.warn('Failed to delete image (continuing):', deleteImageError)
				}
			}

			const formattedId = String(id).trim()

			const { error: deletePizzaError } = await supabase
				.from('pizzas')
				.delete()
				.eq('id', formattedId)

			if (deletePizzaError) {
				throw new Error(`Failed to delete pizza: ${deletePizzaError.message}`)
			}

			// Invalidate the pizzas cache to refresh the list
			mutate(
				(key) => typeof key === 'string' && key.startsWith('pizzas'),
				undefined,
				{ revalidate: true },
			)
			Alert.alert('Success', 'Pizza deleted successfully!')
			router.back()
		} catch (error: any) {
			console.error('Delete error:', error)
			Alert.alert('Error', error.message || 'Something went wrong.')
		} finally {
			setIsSubmitting(false) // Use the renamed state
		}
	}

	return (
		<Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Header
					colors={[
						extendedTheme.tokens.$gradientStart,
						extendedTheme.tokens.$gradientEnd,
					]}
				>
					<ButtonBack />
					<Title>Register</Title>
					{id ? (
						<TouchableOpacity onPress={handleDeletePizza}>
							<DeleteLabel>Delete</DeleteLabel>
						</TouchableOpacity>
					) : (
						<GhostView />
					)}
				</Header>

				<Upload>
					<Photo uri={currentImage} />
					{!id && (
						<PickImageButton
							title='Pick'
							variant='primary'
							onPress={handleImagePick}
						/>
					)}
				</Upload>

				<Form>
					<InputGroup>
						<Label>Name</Label>
						<Input
							value={pizza?.name || ''}
							onChangeText={(text) => {
								if (pizza)
									mutate(`pizza/${pizzaId}`, { ...pizza, name: text }, false)
							}}
						/>
					</InputGroup>

					<InputGroup>
						<InputGroupHeader>
							<Label>Description</Label>
							<MaxCharacters>0 to 60 characters</MaxCharacters>
						</InputGroupHeader>

						<Input
							multiline
							maxLength={60}
							style={{ height: 80 }}
							value={pizza?.description || ''}
							onChangeText={(text) => {
								if (pizza)
									mutate(
										`pizza/${pizzaId}`,
										{ ...pizza, description: text },
										false,
									)
							}}
						/>
					</InputGroup>

					<InputGroup>
						<Label>Sizes and prices</Label>
						<InputPrice
							size='S'
							value={pizza?.price_size_s ? String(pizza.price_size_s) : ''}
							onChangeText={(text) => {
								if (pizza)
									mutate(
										`pizza/${pizzaId}`,
										{ ...pizza, price_size_s: text },
										false,
									)
							}}
						/>
						<InputPrice
							size='M'
							value={pizza?.price_size_m ? String(pizza.price_size_m) : ''}
							onChangeText={(text) => {
								if (pizza)
									mutate(
										`pizza/${pizzaId}`,
										{ ...pizza, price_size_m: text },
										false,
									)
							}}
						/>
						<InputPrice
							size='L'
							value={pizza?.price_size_l ? String(pizza.price_size_l) : ''}
							onChangeText={(text) => {
								if (pizza)
									mutate(
										`pizza/${pizzaId}`,
										{ ...pizza, price_size_l: text },
										false,
									)
							}}
						/>
					</InputGroup>

					{!id && (
						<Button
							title='Register pizza'
							variant='secondary'
							loading={isSubmitting} // Use the renamed state
							onPress={handleAddPizza}
						/>
					)}
				</Form>
			</ScrollView>
		</Container>
	)
}
