import { cn } from "@sglara/cn";
import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Text } from "react-native";

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  length = 6,
  error,
  autoFocus = false,
  disabled = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    autoFocus ? 0 : null
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleTextChange = (text: string, index: number) => {
    if (disabled) return;

    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length <= 1) {
      const newValue = value.split("");
      newValue[index] = numericText;
      const updatedValue = newValue.join("");
      onChangeText(updatedValue);

      // Auto-focus next input
      if (numericText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (disabled) return;

    if (key === "Backspace" && !value[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    if (disabled) return;
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const getInputClasses = (index: number) => {
    const baseClasses =
      "w-14 h-14 border-2 rounded-xl text-center text-xl font-semibold bg-fuschia-rodeo-dust/25";
    const colorClasses = error
      ? "border-schemes-on-error-container text-schemes-error"
      : disabled
        ? "border-[#E5E5E5] bg-[#F5F5F5] text-[#999999]"
        : focusedIndex === index
          ? "border-fuschia-rodeo-dust text-[#333333]"
          : value[index]
            ? "border-fuschia-dust-storm text-[#333333]"
            : "border-fuschia-dust-storm text-[#333333]";

    return cn(baseClasses, colorClasses);
  };

  return (
    <View className="w-full">
      <View className="mb-4 w-full flex-row justify-between">
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            className={getInputClasses(index)}
            value={value[index] || ""}
            onChangeText={text => handleTextChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
            textAlign="center"
            editable={!error && !disabled}
            style={{
              elevation: 0,
              shadowOpacity: 0,
            }}
          />
        ))}
      </View>
      {error && (
        <Text className="px-4 text-center text-sm text-red-600">{error}</Text>
      )}
    </View>
  );
};
