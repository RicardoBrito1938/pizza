import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
} from "react-native";

const Container = styled(Pressable, {
  width: "100%",
  padding: 16,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",

  variants: {
    variant: {
      primary: {
        backgroundColor: extendedTheme.colors.$primary900,
      },
      secondary: {
        backgroundColor: extendedTheme.colors.$success900,
      },
    },
  },
});

const Title = styled(Text, {
  color: extendedTheme.colors.$title,
  fontSize: 14,
  fontFamily: extendedTheme.fonts.$textFont,
});

const Loading = styled(ActivityIndicator, {
  color: extendedTheme.colors.$title,
});

export type ButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
};

export const Button = ({
  title,
  variant = "primary",
  loading = false,
  ...rest
}: ButtonProps) => {
  return (
    <Container variant={variant} disabled={loading} {...rest}>
      {loading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
};
