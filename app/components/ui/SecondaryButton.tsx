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
          "text-lg font-medium text-fuschia-rodeo-dust",
          icon ? "ml-2" : "",
          disabled || loading ? "text-fuschia-rodeo-dust/40" : ""
        )}
      >
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};
