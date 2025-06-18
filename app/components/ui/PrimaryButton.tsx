import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { cn } from "@sglara/cn";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  icon,
  iconSize = 24,
  iconColor = "white",
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const buttonClasses = cn(
    "flex-row items-center justify-center rounded-full bg-fuschia-rodeo-dust py-3",
    {
      "opacity-50": disabled || loading,
    },
    className
  );

  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {icon && !loading && (
        <Iconify icon={icon} size={iconSize} color={iconColor} />
      )}
      <Text className={`text-lg font-medium text-white ${icon ? "ml-2" : ""}`}>
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};
