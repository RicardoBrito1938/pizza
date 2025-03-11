import { Button } from "@/components/ui/button";
import { ButtonBack } from "@/components/ui/button-back";
import { Photo } from "@/components/ui/photo";
import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import { LinearGradient } from "expo-linear-gradient";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { InputPrice } from "@/components/ui/input-price";
import { Input } from "@/components/ui/input";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Container = styled(KeyboardAvoidingView, {
  flex: 1,
  backgroundColor: extendedTheme.colors.$background,
});

const Header = styled(LinearGradient, {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: 24,
  paddingTop: getStatusBarHeight() + 48,
});

const Title = styled(Text, {
  color: extendedTheme.colors.$title,
  fontSize: 24,
  fontFamily: extendedTheme.fonts.$titleFont,
  lineHeight: 32,
});

const DeleteLabel = styled(Text, {
  color: extendedTheme.colors.$title,
  fontSize: 14,
  fontFamily: extendedTheme.fonts.$textFont,
});

const Upload = styled(View, {
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 32,
});

const PickImageButton = styled(Button, {
  maxWidth: 90,
  marginLeft: 32,
});

const Form = styled(View, {
  padding: 24,
  width: "100%",
});

const Label = styled(Text, {
  color: extendedTheme.colors.$secondary900,
  fontFamily: extendedTheme.fonts.$textFont,
});

const InputGroup = styled(View, {
  width: "100%",
  marginBottom: 16,
});

const InputGroupHeader = styled(View, {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const MaxCharacters = styled(Text, {
  fontSize: 10,
  marginBottom: 8,
  color: extendedTheme.colors.$secondary900,
  fontFamily: extendedTheme.fonts.$textFont,
});

export default function Product() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceSizeP, setPriceSizeP] = useState<string>("");
  const [priceSizeM, setPriceSizeM] = useState<string>("");
  const [priceSizeG, setPriceSizeG] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const db = getFirestore();

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddPizza = async () => {
    if (
      !image ||
      !name.trim() ||
      !description.trim() ||
      !priceSizeP ||
      !priceSizeM ||
      !priceSizeG
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    //TODO: I am not paying for firebase storage
    // const fileName = new Date().getTime();
    // const reference = storage().ref(`pizzas/${fileName}.png`);

    // await reference.putFile(image);
    // const url = await reference.getDownloadURL();
    const url = "https://avatars.githubusercontent.com/u/51454097?v=4";
    const mockReference = {
      fullPath: "https://avatars.githubusercontent.com/u/51454097?v=4",
    };

    try {
      await addDoc(collection(db, "pizzas"), {
        image: url,
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          S: priceSizeP,
          M: priceSizeM,
          L: priceSizeG,
        },
        photo_url: url,
        photo_path: mockReference.fullPath,
      });
      alert("Pizza registered successfully!");
    } catch {
      alert("Error registering pizza");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          colors={[
            extendedTheme.tokens.$gradientStart,
            extendedTheme.tokens.$gradientEnd,
          ]}
        >
          <ButtonBack />
          <Title>Register</Title>
          <TouchableOpacity>
            <DeleteLabel>Delete</DeleteLabel>
          </TouchableOpacity>
        </Header>

        <Upload>
          <Photo uri={image} />
          <PickImageButton
            title="Pick"
            variant="primary"
            onPress={handleImagePick}
          />
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
              size="S"
              value={priceSizeP}
              onChangeText={setPriceSizeP}
            />
            <InputPrice
              size="M"
              value={priceSizeM}
              onChangeText={setPriceSizeM}
            />
            <InputPrice
              size="L"
              value={priceSizeG}
              onChangeText={setPriceSizeG}
            />
          </InputGroup>

          <Button
            title="Register pizza"
            variant="secondary"
            loading={loading}
            onPress={handleAddPizza}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
