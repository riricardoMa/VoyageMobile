import "../global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./services/auth/useAuth";
import { UploadProvider } from "./services/upload";
import { I18nProvider } from "./services/i18n";

// Screen imports
import { SplashScreen } from "@screens/SplashScreen";
import { EmailInputScreen, OTPVerificationScreen } from "@app/screens/auth";
import WelcomeScreen from "@screens/WelcomeScreen";
import { MediaUploadScreen } from "@screens/MediaUploadScreen";

// Navigation types
import type {
  AuthStackParamList,
  AppStackParamList,
} from "@app/types/navigation";
import { AuthWelcomeScreen } from "./screens/auth/AuthWelcomeScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const RootStack = createNativeStackNavigator();

// Auth Stack Navigator - shown when user is NOT authenticated
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        // When logging out, a pop animation feels intuitive
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
      <AuthStack.Screen
        name="EmailInput"
        component={EmailInputScreen}
        initialParams={{ isSignUp: true }}
      />
      <AuthStack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
      />
    </AuthStack.Navigator>
  );
}

// App Stack Navigator - shown when user IS authenticated
function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Welcome" component={WelcomeScreen} />
      <AppStack.Screen name="MediaUpload" component={MediaUploadScreen} />
    </AppStack.Navigator>
  );
}

// Root Navigator - implements the authentication flow
function RootNavigator() {
  const { isLoading, isSignout, isAuthenticated } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        // We haven't finished checking for the token yet
        <RootStack.Screen name="Splash" component={SplashScreen} />
      ) : isAuthenticated ? (
        // User is signed in
        <RootStack.Screen
          name="App"
          component={AppStackNavigator}
          options={{
            // When logging in, a push animation feels intuitive
            animationTypeForReplace: isSignout ? "pop" : "push",
          }}
        />
      ) : (
        // No token found, user isn't signed in
        <RootStack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{
            // When logging out, a pop animation feels intuitive
            animationTypeForReplace: isSignout ? "pop" : "push",
          }}
        />
      )}
    </RootStack.Navigator>
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
