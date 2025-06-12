import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuth } from "../services/auth/useAuth";
import Button from "@components/Button";

export default function HomeScreen() {
  const { session, signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 pt-12 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Home!
        </Text>
        <Text className="text-gray-600">
          Hello, {session?.user?.email}
        </Text>
      </View>

      {/* Main Content */}
      <View className="p-6">
        {/* Quick Actions Card */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="space-y-3">
            <Button
              title="Start New Journey"
              onPress={() => {
                // TODO: Navigate to journey creation
                console.log("Start new journey");
              }}
              variant="primary"
              size="lg"
            />
            <Button
              title="View My Journeys"
              onPress={() => {
                // TODO: Navigate to journeys list
                console.log("View journeys");
              }}
              variant="secondary"
              size="lg"
            />
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Stats
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">0</Text>
              <Text className="text-sm text-gray-600">Journeys</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">0</Text>
              <Text className="text-sm text-gray-600">Miles</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">0</Text>
              <Text className="text-sm text-gray-600">Countries</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </Text>
          <View className="items-center py-8">
            <Text className="text-gray-500 text-center">
              No recent activity yet.{"\n"}Start your first journey to see updates here!
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mt-8">
          <Button
            title="Sign Out"
            onPress={signOut}
            variant="secondary"
            size="lg"
          />
        </View>
      </View>
    </ScrollView>
  );
}
