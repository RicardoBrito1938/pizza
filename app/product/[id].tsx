import { Button } from '@/components/ui/button'
import { ButtonBack } from '@/components/ui/button-back'
import { Photo } from '@/components/ui/photo'
import extendedTheme from '@/styles/extendedTheme'
import { styled } from '@fast-styles/react'
import { LinearGradient } from 'expo-linear-gradient'
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
import { useEffect, useState } from 'react'
import { InputPrice } from '@/components/ui/input-price'
import { Input } from '@/components/ui/input'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '@/supabase/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPizzaById } from '@/utils/api'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
	position: 'relative',
})

const PickImageButton = styled(View, {
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
	marginBottom: 8,
})

const InputGroup = styled(View, {
	width: '100%',
	marginBottom: 16,
})

const InputGroupHeader = styled(View, {
	width: '100%',
	flexDirection: 'row',
	alignItems: 'center',

	variants: {
		hasId: {
			true: {
				justifyContent: 'space-between',
			},
			false: {
				justifyContent: 'flex-end',
			},
		},
	},
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

const productSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(60, 'Description must be 60 characters or less'),
	price_size_s: z.string().min(1, 'Price for size S is required'),
	price_size_m: z.string().min(1, 'Price for size M is required'),
	price_size_l: z.string().min(1, 'Price for size L is required'),
	photo_url: z.string().optional(),
	photo_path: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function Product() {
	const { id } = useLocalSearchParams()
	const router = useRouter()
	const pizzaId = id ? String(id) : null
	const queryClient = useQueryClient()

	// State to hold the image URL to avoid reanimated warnings
	const [photoUrl, setPhotoUrl] = useState<string>('')

	const { data: pizza, isLoading } = useQuery({
		queryKey: ['pizza', pizzaId],
		queryFn: () => fetchPizzaById(pizzaId as string),
		enabled: !!pizzaId,
	})

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: '',
			description: '',
			price_size_s: '',
			price_size_m: '',
			price_size_l: '',
			photo_url: '',
			photo_path: '',
		},
	})

	// Watch for form changes
	const formPhotoUrl = watch('photo_url')

	// Update local state when form photo URL changes
	useEffect(() => {
		if (formPhotoUrl) {
			setPhotoUrl(formPhotoUrl)
		}
	}, [formPhotoUrl])

	// Update form when pizza data is loaded
	useEffect(() => {
		if (pizza && !!pizza?.photo_url) {
			reset({
				name: pizza.name,
				description: pizza.description,
				price_size_s: String(pizza.price_size_s),
				price_size_m: String(pizza.price_size_m),
				price_size_l: String(pizza.price_size_l),
				photo_url: pizza.photo_url,
				photo_path: pizza.photo_path,
			})

			// Explicitly set the photo URL to the state as well
			setPhotoUrl(pizza.photo_url)
		}
	}, [pizza, reset])

	const handleImagePick = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== 'granted') {
			Alert.alert(
				'Permission Required',
				'Sorry, we need camera roll permissions to make this work!',
			)
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const selectedImageUri = result.assets[0].uri
			setValue('photo_url', selectedImageUri)
			setPhotoUrl(selectedImageUri)
		}
	}

	const addPizzaMutation = useMutation({
		mutationFn: async (data: ProductFormData) => {
			if (!data.photo_url) {
				throw new Error('Please select an image')
			}

			const fileExt = data.photo_url.split('.').pop() || 'jpg'
			const fileName = `${Date.now()}-${data.name.replace(/\s+/g, '-')}.${fileExt}`

			const fileUri = data.photo_url
			const fileType = mime.lookup(fileUri) || 'image/jpeg'

			const formData = new FormData()
			formData.append('file', {
				uri: fileUri,
				name: fileName,
				type: fileType,
			} as any) // we cast to any to avoid React Native type issues

			const { data: uploadData, error } = await supabase.storage
				.from('pizzas')
				.upload(fileName, formData.get('file') as File, {
					contentType: fileType,
				})

			if (error) {
				throw new Error(`Image upload failed: ${error.message}`)
			}

			const { data: publicUrlData } = supabase.storage
				.from('pizzas')
				.getPublicUrl(fileName)

			const photoUrl = publicUrlData.publicUrl

			const { error: insertError } = await supabase.from('pizzas').insert({
				name: data.name,
				description: data.description,
				price_size_s: Number.parseFloat(data.price_size_s),
				price_size_m: Number.parseFloat(data.price_size_m),
				price_size_l: Number.parseFloat(data.price_size_l),
				photo_url: photoUrl,
				photo_path: fileName,
			})

			if (insertError) {
				throw new Error(`Error saving pizza: ${insertError.message}`)
			}

			return true
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pizzas'] })
			Alert.alert('Success', 'Pizza added successfully!')
			router.back()
		},
		onError: (error: Error) => {
			console.error('Unexpected error:', error)
			Alert.alert('Error', error.message || 'Something went wrong.')
		},
	})

	const deletePizzaMutation = useMutation({
		mutationFn: async (pizzaId: string) => {
			const { data: pizzaData, error: fetchError } = await supabase
				.from('pizzas')
				.select('photo_path')
				.eq('id', pizzaId)
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

			const formattedId = String(pizzaId).trim()

			const { error: deletePizzaError } = await supabase
				.from('pizzas')
				.delete()
				.eq('id', formattedId)

			if (deletePizzaError) {
				throw new Error(`Failed to delete pizza: ${deletePizzaError.message}`)
			}

			return true
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pizzas'] })
			Alert.alert('Success', 'Pizza deleted successfully!')
			router.back()
		},
		onError: (error: Error) => {
			console.error('Delete error:', error)
			Alert.alert('Error', error.message || 'Something went wrong.')
		},
	})

	const handleAddPizza = (data: ProductFormData) => {
		addPizzaMutation.mutate(data)
	}

	const handleDeletePizza = () => {
		if (!id) {
			Alert.alert('Error', 'Pizza ID is missing.')
			return
		}

		deletePizzaMutation.mutate(String(id))
	}

	if (isLoading) {
		return (
			<Container>
				<Header
					colors={[
						extendedTheme.tokens.$gradientStart,
						extendedTheme.tokens.$gradientEnd,
					]}
				>
					<ButtonBack />
					<Title>Loading...</Title>
					<GhostView />
				</Header>
			</Container>
		)
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
					<Photo uri={photoUrl} />
					{!id && (
						<PickImageButton>
							<Button
								title='Pick'
								variant='primary'
								onPress={handleImagePick}
							/>
						</PickImageButton>
					)}
				</Upload>

				<Form>
					<InputGroup>
						{id && <Label>Name</Label>}
						<Controller
							control={control}
							name='name'
							render={({ field: { onChange, value } }) => (
								<>
									<Input.Root value={value} onChangeText={onChange}>
										{!id && (
											<Input.AnimatedPlaceholder
												backgroundColor={extendedTheme.colors.$background}
												color={extendedTheme.colors.$secondary900}
											>
												Name
											</Input.AnimatedPlaceholder>
										)}
										<Input.Trigger />
									</Input.Root>
									{errors.name && (
										<MaxCharacters
											style={{ color: extendedTheme.tokens.$gradientEnd }}
										>
											{errors.name.message}
										</MaxCharacters>
									)}
								</>
							)}
						/>
					</InputGroup>

					<InputGroup>
						<InputGroupHeader hasId={id ? 'true' : 'false'}>
							{id && <Label>Description</Label>}
							<MaxCharacters>
								max of {watch('description')?.length || 0}/60 characters
							</MaxCharacters>
						</InputGroupHeader>

						<Controller
							control={control}
							name='description'
							render={({ field: { onChange, value } }) => (
								<>
									<Input.Root
										multiline
										maxLength={60}
										style={{ height: 80 }}
										value={value}
										onChangeText={onChange}
									>
										{!id && (
											<Input.AnimatedPlaceholder
												backgroundColor={extendedTheme.colors.$background}
												color={extendedTheme.colors.$secondary900}
											>
												Description
											</Input.AnimatedPlaceholder>
										)}
										<Input.Trigger />
									</Input.Root>
									{errors.description && (
										<MaxCharacters
											style={{ color: extendedTheme.tokens.$gradientEnd }}
										>
											{errors.description.message}
										</MaxCharacters>
									)}
								</>
							)}
						/>
					</InputGroup>

					<InputGroup>
						<Label>Sizes and prices</Label>
						<Controller
							control={control}
							name='price_size_s'
							render={({ field: { onChange, value } }) => (
								<>
									<InputPrice size='S' value={value} onChangeText={onChange} />
									{errors.price_size_s && (
										<MaxCharacters
											style={{ color: extendedTheme.tokens.$gradientEnd }}
										>
											{errors.price_size_s.message}
										</MaxCharacters>
									)}
								</>
							)}
						/>
						<Controller
							control={control}
							name='price_size_m'
							render={({ field: { onChange, value } }) => (
								<>
									<InputPrice size='M' value={value} onChangeText={onChange} />
									{errors.price_size_m && (
										<MaxCharacters
											style={{ color: extendedTheme.tokens.$gradientEnd }}
										>
											{errors.price_size_m.message}
										</MaxCharacters>
									)}
								</>
							)}
						/>
						<Controller
							control={control}
							name='price_size_l'
							render={({ field: { onChange, value } }) => (
								<>
									<InputPrice size='L' value={value} onChangeText={onChange} />
									{errors.price_size_l && (
										<MaxCharacters
											style={{ color: extendedTheme.tokens.$gradientEnd }}
										>
											{errors.price_size_l.message}
										</MaxCharacters>
									)}
								</>
							)}
						/>
					</InputGroup>

					{!id && (
						<Button
							title='Register pizza'
							variant='secondary'
							loading={addPizzaMutation.isPending}
							onPress={handleSubmit(handleAddPizza)}
						/>
					)}
				</Form>
			</ScrollView>
		</Container>
	)
}
