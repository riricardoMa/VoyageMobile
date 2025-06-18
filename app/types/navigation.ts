// Navigation parameter types for the entire app

// Auth Stack - screens shown when user is NOT authenticated
export type AuthStackParamList = {
  AuthWelcome: undefined;
  EmailInput: { isSignUp?: boolean };
  OTPVerification: { email: string; isSignUp?: boolean };
};

// Main App Stack - screens shown when user IS authenticated
export type AppStackParamList = {
  Welcome: undefined;
  MediaUpload: undefined;
  // Pet Registration Stack
  PetRegistration: undefined;
  // Add more main app screens here as you build them
};

// Pet Registration Stack - multi-step pet registration flow
export type PetRegistrationStackParamList = {
  PetCategory: undefined;
  PetPhoto: undefined;
  PetBasicInfo: undefined;
  PetBirthday: undefined;
  PetSex: undefined;
};

// Root Stack - top level navigation
export type RootStackParamList = {
  // Auth screens
  AuthStack: undefined;
  // App screens
  AppStack: undefined;
  // Loading screen
  Splash: undefined;
};
