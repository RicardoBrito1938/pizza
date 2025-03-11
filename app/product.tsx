import { Button } from "@/components/ui/button";
import { ButtonBack } from "@/components/ui/button-back";
import { Photo } from "@/components/ui/photo";
import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import { LinearGradient } from "expo-linear-gradient";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

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

export default function Product() {
  const [image, setImage] = useState<string | null>(null);
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
  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
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
    </Container>
  );
}
