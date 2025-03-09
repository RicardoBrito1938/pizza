import { ButtonBack } from "@/components/ui/button-back";
import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import { LinearGradient } from "expo-linear-gradient";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

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
  paddingTop: 48,
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

export default function Product() {
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
    </Container>
  );
}
