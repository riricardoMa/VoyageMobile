import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const getButtonClasses = () => {
    const baseClasses = "rounded-lg flex-row items-center justify-center";

    // Size classes
    const sizeClasses = {
      sm: "px-4 py-2",
      md: "px-6 py-3",
      lg: "px-8 py-4",
    };

    // Variant classes
    const variantClasses = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      outline: "border-2 border-primary bg-transparent",
    };

    // Disabled classes
    const disabledClasses = disabled || loading ? "opacity-50" : "";

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className || ""}`.trim();
  };

  const getTextClasses = () => {
    const baseTextClasses = "font-semibold text-center";

    // Size text classes
    const sizeTextClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    // Variant text classes
    const variantTextClasses = {
      primary: "text-white",
      secondary: "text-primary",
      outline: "text-primary",
    };

    return `${baseTextClasses} ${sizeTextClasses[size]} ${variantTextClasses[variant]}`.trim();
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={getTextClasses()}>{loading ? "Loading..." : title}</Text>
    </TouchableOpacity>
  );
};
