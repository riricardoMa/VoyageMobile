import React from "react";
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { cn } from "@sglara/cn";

interface TertiaryButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  loading?: boolean;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  title,
  icon,
  iconSize = 24,
  iconColor = "#c3b39d", // fuschia-rodeo-dust color
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const buttonClasses = cn(
    "flex-row items-center justify-center rounded-full border-2 border-fuschia-rodeo-dust bg-transparent py-3",
    {
      "border-fuschia-rodeo-dust/40": disabled || loading,
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
      <Text
        className={cn(
          "text-lg font-medium text-[#333333]",
          icon ? "ml-2" : "",
          disabled || loading ? "text-[#333333]/40" : ""
        )}
      >
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};
