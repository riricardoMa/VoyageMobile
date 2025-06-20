import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { cn } from "@sglara/cn";

export interface DatePickerProps {
  /** Current selected date. */
  value: Date | null;
  /** Callback executed when the user picks a new date. */
  onChange: (date: Date) => void;
  /** Minimum selectable date */
  minimumDate?: Date;
  /** Maximum selectable date */
  maximumDate?: Date;
  /** Optional label shown above the picker trigger */
  label?: string;
}

/**
 * Cross-platform date picker component.
 *
 * • iOS – shows an inline spinner (`display="spinner"`).
 * • Android – opens the native date-picker dialog when the trigger is pressed.
 *
 * The component purposely keeps dependencies minimal by leveraging
 * `@react-native-community/datetimepicker`, which ships with Expo out of the box.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  label,
}) => {
  // Make sure we always work with a Date instance (AsyncStorage persistence may hydrate as string)
  const parsedValue: Date | null =
    value instanceof Date ? value : value ? new Date(value) : null;

  // Local copy of the date while the picker is open (Android)
  const [tempDate, setTempDate] = useState<Date>(parsedValue ?? new Date());
  const [show, setShow] = useState(false);

  // -------------------------------------------------------------
  // iOS – inline spinner rendered directly in JSX
  // -------------------------------------------------------------
  if (Platform.OS === "ios") {
    return (
      <View className="w-full items-center">
        {label && <Text className="mb-2 text-base font-medium">{label}</Text>}
        <DateTimePicker
          value={parsedValue ?? new Date()}
          mode="date"
          display="spinner"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            if (selectedDate && event.type === "set") {
              onChange(selectedDate);
            }
          }}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          style={{ width: "100%" }}
        />
      </View>
    );
  }

  // -------------------------------------------------------------
  // Android – modal approach using the native date-picker dialog
  // -------------------------------------------------------------
  const openPicker = () => {
    setTempDate(parsedValue ?? new Date());
    setShow(true);
  };

  const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate && event.type === "set") {
      onChange(selectedDate);
    }
    setShow(false);
  };

  return (
    <View className="w-full items-center">
      {label && <Text className="mb-2 text-base font-medium">{label}</Text>}
      <TouchableOpacity
        className={cn(
          "h-11 w-full flex-row items-center justify-center rounded-3xl border-2 border-iris-bone bg-transparent",
          parsedValue ? "bg-iris-parchment" : ""
        )}
        activeOpacity={0.7}
        onPress={openPicker}
      >
        <Text className="text-base font-bold text-[#333333]">
          {parsedValue ? parsedValue.toDateString() : "Select date"}
        </Text>
      </TouchableOpacity>

      {show && (
        <Modal transparent animationType="fade">
          <Pressable
            className="flex-1 items-center justify-center bg-black/20"
            onPress={() => setShow(false)}
          >
            <View className="w-[320px] rounded-2xl bg-white p-4">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onPickerChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                style={{ width: "100%" }}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
