// Export only what consumers need (ISP - Interface Segregation Principle)
export type { IBaseStore, StoreCreator } from "./types/StoreTypes";

// Pet Registration Types
export type {
  PetCategory,
  PetSex,
  PetRegistrationData,
  PetRegistrationState,
  PetRegistrationActions,
  IPetRegistrationStore,
} from "./types/StoreTypes";

// Pet Registration Store
export {
  usePetRegistrationStore,
  selectPetCategory,
  selectPetPhoto,
  selectPetSex,
  selectPetBirthday,
  selectPetName,
  selectPetOwnerTitle,
  selectIsComplete,
  selectCurrentStep,
  selectTotalSteps,
  selectPetData,
} from "./stores/petRegistrationStore";

// Pet Registration Hooks (Main interface for components)
export {
  usePetRegistration,
  usePetCategory,
  usePetPhoto,
  usePetSex,
  usePetBirthday,
  usePetBasicInfo,
  usePetRegistrationProgress,
  usePetData,
  usePetRegistrationValidation,
} from "./hooks/usePetRegistration";

// Future store exports will go here
// export { useExampleStore } from './hooks/useExampleStore';
