import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useAuth } from "../services/auth/useAuth";
import { Button, LoadingSpinner } from "@app/components/ui";

export default function WelcomeScreen() {
  const { session, signOut, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8 items-center">
          <Text className="mb-4 text-4xl font-bold text-primary">
            Welcome to Voyage!
          </Text>
          <Text className="mb-2 text-center text-lg text-gray-600">
            You're successfully signed in
          </Text>
          <Text className="text-center text-base font-medium text-primary">
            {session?.user?.email}
          </Text>
        </View>

        <View className="w-full">
          <Button
            title="Sign Out"
            onPress={signOut}
            disabled={loading}
            loading={loading}
            variant="outline"
            className="mb-4"
          />

          <Button
            title="Upload Media"
            onPress={() => {
              // This will be handled by navigation in the future
              console.log("Navigate to media upload");
            }}
            className="mb-4"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
