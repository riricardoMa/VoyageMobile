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
    <View className="h-4 w-full overflow-hidden rounded-[5px] bg-[#CFCFCF]">
      <Animated.View
        style={[{ width }]}
        className="bg-iris-blue h-full rounded-[5px]"
      />
    </View>
  );
};
