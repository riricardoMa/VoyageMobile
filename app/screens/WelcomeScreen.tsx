import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../services/auth/useAuth";
import Button from "@components/Button";

export default function WelcomeScreen() {
  const { session, signOut, loading } = useAuth();
  if (loading) return <ActivityIndicator className="flex-1" />;
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-4 text-gray-900">Welcome!</Text>
      <Text className="text-lg mb-8 text-gray-600 text-center">
        {session?.user?.email}
      </Text>
      <Button
        title="Sign Out"
        onPress={signOut}
        variant="secondary"
        size="lg"
      />
    </View>
  );
}
