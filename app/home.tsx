import { useAuth } from "@/hooks/auth";
import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import happyEmoji from "@/assets/images/happy.png";
import { MaterialIcons } from "@expo/vector-icons";
import { Search } from "@/components/ui/search";

const Container = styled(View, {
  flex: 1,
  backgroundColor: extendedTheme.colors.$background,
});

const Header = styled(LinearGradient, {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: getStatusBarHeight() + 33,
  paddingBottom: 58,
  paddingHorizontal: 24,
});

const Greeting = styled(View, {
  flexDirection: "row",
  alignItems: "center",
});

const GreetingEmoji = styled(Image, {
  height: 32,
  width: 32,
  marginRight: 8,
});

const GreetingText = styled(Text, {
  color: extendedTheme.colors.$title,
  fontSize: 20,
  fontFamily: extendedTheme.fonts.$titleFont,
});

export default function Home() {
  const { signOut } = useAuth();

  return (
    <Container>
      <Header
        colors={[
          extendedTheme.tokens.$gradientStart,
          extendedTheme.tokens.$gradientEnd,
        ]}
      >
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Hello, User</GreetingText>
        </Greeting>
        <Pressable
          onPress={signOut}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              padding: 8,
            },
          ]}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color={extendedTheme.colors.$title}
          />
        </Pressable>
      </Header>
      <Search onSearch={() => {}} onClear={() => {}} />
    </Container>
  );
}
