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

	const [image, setImage] = useState<string | null>(null)
	const [imagePath, setImagePath] = useState<string | null>(null)
	const [name, setName] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [priceSizeP, setPriceSizeP] = useState<string>('')
	const [priceSizeM, setPriceSizeM] = useState<string>('')
	const [priceSizeG, setPriceSizeG] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

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
			setImage(result.assets[0].uri)
		}
	}

	const handleAddPizza = async () => {
		if (
			!image ||
			!name.trim() ||
			!description.trim() ||
			!priceSizeP ||
			!priceSizeM ||
			!priceSizeG
		) {
			Alert.alert('Validation Error', 'Please fill all fields')
			return
		}

		setLoading(true)

		try {
			const fileExt = image.split('.').pop()
			const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}.${fileExt}`

			const fileUri = image
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
				name,
				description,
				price_size_s: Number.parseFloat(priceSizeP),
				price_size_m: Number.parseFloat(priceSizeM),
				price_size_l: Number.parseFloat(priceSizeG),
				photo_url: photoUrl,
				photo_path: fileName,
			})

			if (insertError) {
				Alert.alert('Error', `Error saving pizza: ${insertError.message}`)
				return
			}

			Alert.alert('Success', 'Pizza added successfully!')
			router.back()
		} catch (error) {
			console.error('Unexpected error:', error)
			Alert.alert('Error', 'Something went wrong.')
		} finally {
			setLoading(false)
		}
	}

	const handleDeletePizza = async () => {
		if (!id) {
			Alert.alert('Error', 'Pizza ID is missing.')
			return
		}

		setLoading(true)

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

			console.log('Trying to delete pizza with id:', id, typeof id)

			const formattedId = String(id).trim()
			console.log('Formatted ID used for deletion:', formattedId)

			const {
				error: deletePizzaError,
				data,
				status,
			} = await supabase.from('pizzas').delete().eq('id', formattedId)

			console.log('Delete status:', status)
			console.log('Delete data:', data)
			console.log('Delete error:', deletePizzaError)

			if (deletePizzaError) {
				throw new Error(`Failed to delete pizza: ${deletePizzaError.message}`)
			}

			Alert.alert('Success', 'Pizza deleted successfully!')
			router.back()
		} catch (error: any) {
			console.error('Delete error:', error)
			Alert.alert('Error', error.message || 'Something went wrong.')
		} finally {
			setLoading(false)
		}
	}

	const fetchPizza = useCallback(async () => {
		if (!id) return

		try {
			const { data: pizzaData, error } = await supabase
				.from('pizzas')
				.select('*')
				.eq('id', id)
				.single()

			if (error) {
				throw new Error(error.message)
			}

			return pizzaData
		} catch (error) {
			Alert.alert('Error', `Pizza not found: ${error}`)
			return null
		}
	}, [id])

	useEffect(() => {
		if (!id) return // No ID means we're creating a new product

		fetchPizza().then((pizzaData) => {
			if (pizzaData) {
				setName(pizzaData.name)
				setDescription(pizzaData.description)
				setImage(pizzaData.photo_url)
				setImagePath(pizzaData.photo_path)
				setPriceSizeP(pizzaData.price_sizes?.S)
				setPriceSizeM(pizzaData.price_sizes?.M)
				setPriceSizeG(pizzaData.price_sizes?.L)
			}
		})
	}, [id, fetchPizza])

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
					<Photo uri={image} />
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
						<Input value={name} onChangeText={setName} />
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
							value={description}
							onChangeText={setDescription}
						/>
					</InputGroup>

					<InputGroup>
						<Label>Sizes and prices</Label>
						<InputPrice
							size='S'
							value={priceSizeP}
							onChangeText={setPriceSizeP}
						/>
						<InputPrice
							size='M'
							value={priceSizeM}
							onChangeText={setPriceSizeM}
						/>
						<InputPrice
							size='L'
							value={priceSizeG}
							onChangeText={setPriceSizeG}
						/>
					</InputGroup>

					{!id && (
						<Button
							title='Register pizza'
							variant='secondary'
							loading={loading}
							onPress={handleAddPizza}
						/>
					)}
				</Form>
			</ScrollView>
		</Container>
	)
}
