import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { Text, View } from "react-native";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign out" variant="primary" onPress={signOut} />
    </View>
  );
}
