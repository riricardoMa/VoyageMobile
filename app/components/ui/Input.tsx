import { cn } from "@sglara/cn";
import React from "react";
import { TextInput, Text, View, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: "default" | "email";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = "default",
  className,
  ...props
}) => {
  const getInputClasses = () => {
    const baseClasses =
      "bg-fuschia-rodeo-dust/25 rounded-lg px-4 py-3 text-base";
    const errorClasses = error ? "border-[#852221]" : "";

    return cn(baseClasses, errorClasses, className);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-base font-medium text-[#333333]">
          {label}
        </Text>
      )}
      <TextInput
        className={getInputClasses()}
        placeholderTextColor="#59738C"
        autoCapitalize={variant === "email" ? "none" : "sentences"}
        keyboardType={variant === "email" ? "email-address" : "default"}
        autoComplete={variant === "email" ? "email" : "off"}
        autoCorrect={false}
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-600">{error}</Text>}
    </View>
  );
};
