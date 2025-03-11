import extendedTheme from "@/styles/extendedTheme";
import { Feather } from "@expo/vector-icons";
import { styled } from "@fast-styles/react";
import type { WithStyles } from "@fast-styles/react/lib/typescript/types";
import {
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

const Container = styled(View, {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  marginTop: -30,
  paddingHorizontal: 24,
});

const InputArea = styled(View, {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 16,
  backgroundColor: extendedTheme.colors.$title,
  borderColor: extendedTheme.colors.$shape,
});

const Input = styled(TextInput, {
  flex: 1,
  height: 52,
  paddingLeft: 12,
  fontFamily: extendedTheme.fonts.$textFont,
});

const Clear = styled(TouchableOpacity, {
  marginRight: 7,
});

const Button = styled(TouchableOpacity, {
  height: 52,
  width: 52,
  borderRadius: 16,
  backgroundColor: extendedTheme.colors.$success900,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 8,
});

type Props = WithStyles<TextInputProps> & {
  onClear: () => void;
  onSearch: () => void;
};

export const Search = ({ onSearch, onClear, ...rest }: Props) => {
  return (
    <Container>
      <InputArea>
        <Input placeholder="search..." {...rest} />
        <Clear onPress={onClear}>
          <Feather name="x" size={16} />
        </Clear>
      </InputArea>
      <Button onPress={onSearch}>
        <Feather name="search" size={24} color={extendedTheme.colors.$title} />
      </Button>
    </Container>
  );
};
