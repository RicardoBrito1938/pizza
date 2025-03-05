import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../firebaseConfig";

type AuthContextData = {
  signIn: (email: string, password: string) => void;
  isLogging: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLogging, setIsLogging] = useState(false);

  const signIn = (email: string, password: string) => {
    if (!email || !password) {
      return Alert.alert("Email and password are required");
    }
    setIsLogging(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((account) => {
        console.log(account);
      })
      .catch((error) => {
        const { code, message } = error;
        Alert.alert(message);
      })
      .finally(() => {
        setIsLogging(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isLogging,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
