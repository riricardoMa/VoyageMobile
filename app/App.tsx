import "../global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./services/auth/useAuth";
import { UploadProvider } from "./services/upload";
import { I18nProvider } from "./services/i18n";
import SignInScreenProofOfConcept from "@screens/SignInScreen";
import WelcomeScreen from "@screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreenProofOfConcept} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const bucketName = process.env.EXPO_PUBLIC_SUPABASE_BUCKET_NAME || "media";

  return (
    <I18nProvider>
      <AuthProvider>
        <UploadProvider bucketName={bucketName}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </UploadProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
