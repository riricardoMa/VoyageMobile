import React, { useEffect } from "react";
import { View, Animated } from "react-native";

interface UploadProgressBarProps {
  progress: number;
}

export const UploadProgressBar = ({ progress }: UploadProgressBarProps) => {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View className="h-2 w-full rounded-full bg-gray-200">
      <Animated.View
        style={[{ width }]}
        className="bg-primary h-full rounded-full"
      />
    </View>
  );
};
