import "../global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { AuthProvider, useAuth } from "./services/auth/useAuth";
import { UploadProvider } from "./services/upload";
import { I18nProvider } from "./services/i18n";

// Screen imports
import { SplashScreen } from "@screens/SplashScreen";
import { EmailInputScreen, OTPVerificationScreen } from "@app/screens/auth";
import WelcomeScreen from "@screens/WelcomeScreen";
import { MediaUploadScreen } from "@screens/MediaUploadScreen";
import {
  PetCategoryScreen,
  PetPhotoScreen,
  PetBasicInfoScreen,
  PetBirthdayScreen,
  PetSexScreen,
} from "@app/screens/pet";

// Navigation types
import type {
  AuthStackParamList,
  AppStackParamList,
  PetRegistrationStackParamList,
} from "@app/types/navigation";
import { AuthWelcomeScreen } from "./screens/auth/AuthWelcomeScreen";
import { ArrowLeft, Close } from "./components/svg";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const PetRegistrationStack =
  createNativeStackNavigator<PetRegistrationStackParamList>();
const RootStack = createNativeStackNavigator();

// Auth Stack Navigator - shown when user is NOT authenticated
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FAFAFA",
        },
        headerShadowVisible: false,
        headerTintColor: "#0F141A",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        // When logging out, a pop animation feels intuitive
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen
        name="AuthWelcome"
        component={AuthWelcomeScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="EmailInput"
        component={EmailInputScreen}
        initialParams={{ isSignUp: true }}
        options={({ route, navigation }) => ({
          title: route.params?.isSignUp ? "Sign up" : "Log in",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AuthWelcome")}
              className="p-2"
            >
              <Close />
            </TouchableOpacity>
          ),
        })}
      />
      <AuthStack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={({ route, navigation }) => ({
          title: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EmailInput", {
                  isSignUp: route.params?.isSignUp,
                })
              }
              className="p-2"
            >
              <ArrowLeft />
            </TouchableOpacity>
          ),
        })}
      />
    </AuthStack.Navigator>
  );
}

// Pet Registration Stack Navigator - multi-step pet registration flow
function PetRegistrationStackNavigator() {
  return (
    <PetRegistrationStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f1e5da", // iris-parchment/background
        },
        headerShadowVisible: false,
        headerTintColor: "#c3b39d", // fuschia-rodeo-dust/primary
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        animation: "slide_from_right",
      }}
    >
      <PetRegistrationStack.Screen
        name="PetCategory"
        component={PetCategoryScreen}
        options={{
          title: "Category",
          headerBackTitle: "Cancel",
        }}
      />
      <PetRegistrationStack.Screen
        name="PetPhoto"
        component={PetPhotoScreen}
        options={{
          title: "Headphoto",
        }}
      />
      <PetRegistrationStack.Screen
        name="PetBasicInfo"
        component={PetBasicInfoScreen}
        options={{
          title: "Basic Information",
        }}
      />
      <PetRegistrationStack.Screen
        name="PetBirthday"
        component={PetBirthdayScreen}
        options={{
          title: "Birthday",
        }}
      />
      <PetRegistrationStack.Screen
        name="PetSex"
        component={PetSexScreen}
        options={{
          title: "Sex",
        }}
      />
    </PetRegistrationStack.Navigator>
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
      <AppStack.Screen
        name="PetRegistration"
        component={PetRegistrationStackNavigator}
      />
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
