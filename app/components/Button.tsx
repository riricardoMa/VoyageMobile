import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const baseClasses = "rounded-lg flex-row justify-center items-center";
  
  const variantClasses = {
    primary: disabled 
      ? "bg-gray-300" 
      : "bg-blue-500 active:bg-blue-600",
    secondary: disabled 
      ? "bg-gray-100 border border-gray-300" 
      : "bg-white border border-gray-300 active:bg-gray-50",
  };

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textVariantClasses = {
    primary: disabled ? "text-gray-500" : "text-white",
    secondary: disabled ? "text-gray-400" : "text-gray-700",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "primary" ? "white" : "#374151"} 
        />
      ) : (
        <Text 
          className={`font-medium ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
