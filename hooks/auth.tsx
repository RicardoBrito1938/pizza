import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SplashScreen, useRouter } from "expo-router";

type User = {
  id: string;
  email: string | null;
  isAdmin: boolean;
};

type AuthContextData = {
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  isLogging: boolean;
  user: User | null;
  isLoadingUser: boolean; // Add this to indicate the initial loading state
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              isAdmin: !!userData?.isAdmin,
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              isAdmin: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }

      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert("Login Error", "Email and password are required");
      return;
    }

    try {
      setIsLogging(true);

      await signInWithEmailAndPassword(auth, email, password);
      // No need to manually set user here as the onAuthStateChanged listener will handle it
    } catch (error: any) {
      const errorMessage = error.message || "Authentication failed";
      Alert.alert("Login Error", errorMessage);
    } finally {
      setIsLogging(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (error: any) {
      const errorMessage = error.message || "Sign out failed";
      Alert.alert("Sign Out Error", errorMessage);
    }
  };

  useEffect(() => {
    if (user && !isLoadingUser) {
      router.replace("/home");
      SplashScreen.hideAsync();
    }

    if (!user && !isLoadingUser) {
      router.replace("/");
      SplashScreen.hideAsync();
    }
  }, [user, router, isLoadingUser]);

  return (
    <AuthContext.Provider
      value={{
        signOut,
        signIn,
        isLogging,
        user,
        isLoadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
