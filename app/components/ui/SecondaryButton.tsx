import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { cn } from "@sglara/cn";

interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  loading?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  icon,
  iconSize = 24,
  iconColor = "#333333",
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const buttonClasses = cn(
    "flex-row items-center justify-center rounded-full bg-iris-parchment px-5 py-3 h-12",
    {
      "bg-iris-parchment/50": disabled || loading,
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
        <Iconify
          icon={icon}
          size={iconSize}
          color={disabled || loading ? "#333333/40" : iconColor}
        />
      )}
      <Text
        className={cn(
          "text-base font-bold text-[#333333]",
          icon ? "ml-2" : "",
          disabled || loading ? "text-[#333333]/40" : ""
        )}
      >
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};
