import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  PetRegistrationState,
  PetRegistrationActions,
  PetRegistrationData,
  PetCategory,
  PetSex,
} from "@app/state/types/StoreTypes";
import type { UploadResult } from "@app/services/upload/types/UploadTypes";

// AsyncStorage interface for Zustand persist middleware
const asyncStorage = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn("Failed to get item from AsyncStorage:", error);
      return null;
    }
  },
  setItem: async (name: string, value: unknown): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to save to AsyncStorage:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn("Failed to remove from AsyncStorage:", error);
    }
  },
};

// Initial pet data state
const initialPetData: PetRegistrationData = {
  category: null,
  photoUploadResult: null,
  sex: null,
  birthday: null,
  name: "",
  ownerTitle: "",
};

// Initial state
const initialState: PetRegistrationState = {
  petData: initialPetData,
  isComplete: false,
  currentStep: 1,
  totalSteps: 5, // category, photo, sex, birthday, name
};

// Store type combining state and actions
type PetRegistrationStore = PetRegistrationState & PetRegistrationActions;

// Create the store with Zustand
export const usePetRegistrationStore = create<PetRegistrationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        ...initialState,

        // Actions following Single Responsibility Principle
        setPetCategory: (category: PetCategory) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                category,
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                category,
              }),
            }),
            false,
            "setPetCategory"
          );
        },

        setPetPhoto: (uploadResult: UploadResult) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                photoUploadResult: uploadResult,
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                photoUploadResult: uploadResult,
              }),
            }),
            false,
            "setPetPhoto"
          );
        },

        setPetSex: (sex: PetSex) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                sex,
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                sex,
              }),
            }),
            false,
            "setPetSex"
          );
        },

        setPetBirthday: (birthday: Date) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                birthday,
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                birthday,
              }),
            }),
            false,
            "setPetBirthday"
          );
        },

        setPetName: (name: string) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                name: name.trim(),
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                name: name.trim(),
              }),
            }),
            false,
            "setPetName"
          );
        },

        setPetOwnerTitle: (ownerTitle: string) => {
          set(
            state => ({
              petData: {
                ...state.petData,
                ownerTitle: ownerTitle.trim(),
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                ownerTitle: ownerTitle.trim(),
              }),
            }),
            false,
            "setPetOwnerTitle"
          );
        },

        setCurrentStep: (step: number) => {
          const { totalSteps } = get();
          const validStep = Math.max(1, Math.min(step, totalSteps));
          set({ currentStep: validStep }, false, "setCurrentStep");
        },

        clearPetPhoto: () => {
          set(
            state => ({
              petData: {
                ...state.petData,
                photoUploadResult: null,
              },
              isComplete: checkRegistrationComplete({
                ...state.petData,
                photoUploadResult: null,
              }),
            }),
            false,
            "clearPetPhoto"
          );
        },

        resetPetRegistration: () => {
          set(initialState, false, "resetPetRegistration");
        },
      }),
      {
        name: "pet-registration-store",
        storage: asyncStorage,
        // Only persist essential data, not UI state
        partialize: state => ({
          petData: state.petData,
          isComplete: state.isComplete,
          currentStep: 1, // Reset to first step on reload
          totalSteps: state.totalSteps,
        }),
      }
    ),
    {
      name: "PetRegistrationStore",
    }
  )
);

// Helper function to check if registration is complete
// Following Single Responsibility Principle
function checkRegistrationComplete(petData: PetRegistrationData): boolean {
  return (
    petData.category !== null &&
    petData.photoUploadResult !== null &&
    petData.sex !== null &&
    petData.birthday !== null &&
    petData.name.trim() !== "" &&
    petData.ownerTitle.trim() !== ""
  );
}

// Selector functions for better performance (Interface Segregation Principle)
export const selectPetCategory = (state: PetRegistrationStore) =>
  state.petData.category;
export const selectPetPhoto = (state: PetRegistrationStore) =>
  state.petData.photoUploadResult;
export const selectPetSex = (state: PetRegistrationStore) => state.petData.sex;
export const selectPetBirthday = (state: PetRegistrationStore) =>
  state.petData.birthday;
export const selectPetName = (state: PetRegistrationStore) =>
  state.petData.name;
export const selectPetOwnerTitle = (state: PetRegistrationStore) =>
  state.petData.ownerTitle;
export const selectIsComplete = (state: PetRegistrationStore) =>
  state.isComplete;
export const selectCurrentStep = (state: PetRegistrationStore) =>
  state.currentStep;
export const selectTotalSteps = (state: PetRegistrationStore) =>
  state.totalSteps;
export const selectPetData = (state: PetRegistrationStore) => state.petData;
