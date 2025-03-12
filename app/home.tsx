import { useAuth } from "@/hooks/auth";
import extendedTheme from "@/styles/extendedTheme";
import { styled } from "@fast-styles/react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import happyEmoji from "@/assets/images/happy.png";
import { MaterialIcons } from "@expo/vector-icons";
import { Search } from "@/components/ui/search";
import { ProductCard, type ProductProps } from "@/components/ui/product-card";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  orderBy,
  getDocs,
  startAt,
  endAt,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

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

const MenuHeader = styled(View, {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  margin: 24,
  marginBottom: 0,
  paddingBottom: 22,
  borderBottomWidth: 1,
  borderBottomColor: extendedTheme.colors.$shape,
});

const MenuItemNumber = styled(Text, {
  fontSize: 14,
  color: extendedTheme.colors.$secondary900,
  fontFamily: extendedTheme.fonts.$textFont,
});

const Title = styled(Text, {
  fontSize: 20,
  lineHeight: 24,
  color: extendedTheme.colors.$secondary900,
  fontFamily: extendedTheme.fonts.$titleFont,
});

export default function Home() {
  const { signOut } = useAuth();
  const routes = useRouter();
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchPizzas = useCallback(async (value: string) => {
    const formattedValue = value.trim().toLowerCase();

    try {
      const pizzasRef = collection(db, "pizzas");
      const q = query(
        pizzasRef,
        orderBy("name_insensitive"),
        startAt(formattedValue),
        endAt(`${formattedValue}\uf8ff`)
      );

      const querySnapshot = await getDocs(q);
      const pizzas = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      }) as ProductProps[];

      setPizzas(pizzas);
    } catch {
      Alert.alert("Error", "An error occurred while fetching pizzas");
    }
  }, []);

  const handleSearch = () => {
    fetchPizzas(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    fetchPizzas("");
  };

  const handleOpenProduct = (id: string) => {
    routes.push(`/product/${id}`);
  };

  useEffect(() => {
    fetchPizzas("");
  }, [fetchPizzas]);

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
      <Search
        onChangeText={setSearchValue}
        value={searchValue}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <MenuHeader>
        <Title>Menu</Title>
        <MenuItemNumber>3 pizzas</MenuItemNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpenProduct(item.id)} />
        )}
        contentContainerStyle={{
          marginHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 125,
        }}
      />
    </Container>
  );
}
