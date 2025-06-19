// Base store interface for consistency (LSP - Liskov Substitution Principle)
export interface IBaseStore<T> {
  state: T;
  actions: Record<string, (...args: unknown[]) => void>;
}

// Store creation helper type
export type StoreCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => T & Record<string, unknown>;

// Pet Registration Types
export type PetCategory = "dog" | "cat" | null;

export type PetSex = "boy" | "girl" | null;

export interface PetRegistrationData {
  category: PetCategory;
  photoUploadResult:
    | import("@app/services/upload/types/UploadTypes").UploadResult
    | null;
  sex: PetSex;
  birthday: Date | null;
  name: string;
  ownerTitle: string;
}

export interface PetRegistrationState {
  petData: PetRegistrationData;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface PetRegistrationActions {
  setPetCategory: (category: PetCategory) => void;
  setPetPhoto: (
    uploadResult: import("@app/services/upload/types/UploadTypes").UploadResult
  ) => void;
  setPetSex: (sex: PetSex) => void;
  setPetBirthday: (birthday: Date) => void;
  setPetName: (name: string) => void;
  setPetOwnerTitle: (ownerTitle: string) => void;
  setCurrentStep: (step: number) => void;
  resetPetRegistration: () => void;
  clearPetPhoto: () => void;
}

export interface IPetRegistrationStore {
  state: PetRegistrationState;
  actions: PetRegistrationActions;
}
