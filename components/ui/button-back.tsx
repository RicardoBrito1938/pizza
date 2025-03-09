import extendedTheme from "@/styles/extendedTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { styled } from "@fast-styles/react";
import { Pressable, type PressableProps } from "react-native";

const Container = styled(Pressable, {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: extendedTheme.colors.$primary100,
});

export const ButtonBack = ({ ...rest }: PressableProps) => {
  return (
    <Container>
      <MaterialIcons
        name="chevron-left"
        size={18}
        color={extendedTheme.colors.$title}
      />
    </Container>
  );
};
