import { cn } from "@sglara/cn";
import React from "react";
import { TextInput, Text, View, type TextInputProps } from "react-native";
import Iconify from "react-native-iconify";

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
      "bg-iris-bone/25 h-[56px] rounded-xl p-4 text-base font-normal text-[#333333] placeholder:text-slate-500 placeholder:text-base placeholder:font-normal";
    const errorClasses = error
      ? "border border-schemes-on-error-container"
      : "";

    return cn(baseClasses, errorClasses, className);
  };

  return (
    <View>
      {label && <Text className="mb-2 text-base text-[#333333]">{label}</Text>}
      <TextInput
        className={getInputClasses()}
        placeholderTextColor="#59738C"
        autoCapitalize={variant === "email" ? "none" : "sentences"}
        keyboardType={variant === "email" ? "email-address" : "default"}
        autoComplete={variant === "email" ? "email" : "off"}
        autoCorrect={false}
        style={{
          fontSize: 16,
          fontWeight: "normal",
          lineHeight: 20,
        }}
        {...props}
      />
      {error && (
        <View className="flex-row items-center gap-1">
          <Iconify
            icon="material-symbols:error-outline"
            size={24}
            color="#852221"
          />
          <Text className="mt-1 text-sm text-schemes-on-error-container">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
