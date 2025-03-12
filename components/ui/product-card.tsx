import extendedTheme from "@/styles/extendedTheme";
import { Feather } from "@expo/vector-icons";
import { styled } from "@fast-styles/react";
import type { WithStyles } from "@fast-styles/react/lib/typescript/types";
import {
  Image as RNImage,
  Pressable,
  View,
  Text,
  type PressableProps,
} from "react-native";

const Container = styled(View, {
  width: "100%",
});

const Content = styled(Pressable, {
  flexDirection: "row",
  alignItems: "center",
});

const Image = styled(RNImage, {
  width: 104,
  height: 104,
  borderRadius: 52,
  marginRight: 20,
});

const Details = styled(View, {
  flex: 1,
});

const Name = styled(Text, {
  flex: 1,
  fontSize: 20,
  fontFamily: extendedTheme.fonts.$titleFont,
  color: extendedTheme.colors.$secondary900,
  marginBottom: 8,
});

const Identification = styled(View, {
  flexDirection: "row",
  alignItems: "center",
});

const Description = styled(Text, {
  fontSize: 12,
  lineHeight: 20,
  marginRight: 20,
  fontFamily: extendedTheme.fonts.$textFont,
  color: extendedTheme.colors.$secondary400,
  marginBottom: 8,
});

const Line = styled(View, {
  width: "100%",
  height: 1,
  backgroundColor: extendedTheme.colors.$shape,
  marginVertical: 12,
  marginLeft: 124,
});

export type ProductProps = {
  id: string;
  photo_url: string;
  name: string;
  description: string;
};

type Props = WithStyles<PressableProps> & {
  data: ProductProps;
};

export const ProductCard = ({ data, ...rest }: Props) => {
  return (
    <Container>
      <Content {...rest}>
        <Image source={{ uri: data.photo_url }} />
        <Details>
          <Identification>
            <Name>{data.name}</Name>
            <Feather
              name="chevron-right"
              size={18}
              color={extendedTheme.colors.$shape}
            />
          </Identification>
          <Description>{data.description}</Description>
        </Details>
      </Content>
      <Line />
    </Container>
  );
};
