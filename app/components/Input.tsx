import React from "react";
import { TextInput, View, Text } from "react-native";

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  editable?: boolean;
  error?: string;
  label?: string;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  autoCapitalize = "sentences",
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  error,
  label,
}: InputProps) {
  const inputClasses = error
    ? "border border-red-300 bg-red-50"
    : "border border-gray-300 bg-white";

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <TextInput
        className={`${inputClasses} rounded-lg p-3 text-base text-gray-900`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        placeholderTextColor="#9CA3AF"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
