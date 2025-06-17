import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Text } from "react-native";

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  error?: string;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  length = 6,
  error,
  autoFocus = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    autoFocus ? 0 : null
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleTextChange = (text: string, index: number) => {
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
    if (key === "Backspace" && !value[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const getInputClasses = (index: number) => {
    const baseClasses =
      "w-12 h-12 border rounded-lg text-center text-lg font-semibold";
    const colorClasses = error
      ? "border-red-500 bg-red-50"
      : focusedIndex === index
        ? "border-primary bg-background"
        : "border-accent bg-background";

    return `${baseClasses} ${colorClasses}`.trim();
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-center space-x-3">
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
          />
        ))}
      </View>
      {error && (
        <Text className="mt-2 text-center text-sm text-red-600">{error}</Text>
      )}
    </View>
  );
};
