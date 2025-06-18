import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";

interface PetCategoryCardProps {
  title: string;
  image: any;
  selected: boolean;
  onPress: () => void;
}

export const PetCategoryCard: React.FC<PetCategoryCardProps> = ({
  title,
  image,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl p-3 ${
        selected
          ? "border-2 border-fuschia-rodeo-dust bg-iris-bone/25"
          : "border-2 border-transparent bg-iris-bone/25"
      }`}
      style={{ width: 168, height: 225 }}
      activeOpacity={0.8}
    >
      <View className="flex-1 items-center justify-center">
        <Image
          source={image}
          className="mb-2"
          style={{ width: 122, height: 114 }}
          resizeMode="contain"
        />
        <Text className="text-lg font-medium text-[#333333]">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
