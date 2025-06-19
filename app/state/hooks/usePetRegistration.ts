import { useCallback } from "react";
import {
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
} from "@app/state/stores/petRegistrationStore";

// Main hook for pet registration management
export const usePetRegistration = () => {
  const store = usePetRegistrationStore();

  return {
    // State
    petData: store.petData,
    isComplete: store.isComplete,
    currentStep: store.currentStep,
    totalSteps: store.totalSteps,

    // Actions
    setPetCategory: store.setPetCategory,
    setPetPhoto: store.setPetPhoto,
    setPetSex: store.setPetSex,
    setPetBirthday: store.setPetBirthday,
    setPetName: store.setPetName,
    setPetOwnerTitle: store.setPetOwnerTitle,
    setCurrentStep: store.setCurrentStep,
    clearPetPhoto: store.clearPetPhoto,
    resetPetRegistration: store.resetPetRegistration,
  };
};

// Focused hooks for specific data (Interface Segregation Principle)
export const usePetCategory = () => {
  const category = usePetRegistrationStore(selectPetCategory);
  const setPetCategory = usePetRegistrationStore(state => state.setPetCategory);

  return {
    category,
    setPetCategory,
  };
};

export const usePetPhoto = () => {
  const photoUploadResult = usePetRegistrationStore(selectPetPhoto);
  const setPetPhoto = usePetRegistrationStore(state => state.setPetPhoto);
  const clearPetPhoto = usePetRegistrationStore(state => state.clearPetPhoto);

  return {
    photoUploadResult,
    setPetPhoto,
    clearPetPhoto,
    hasPhoto: photoUploadResult !== null,
  };
};

export const usePetSex = () => {
  const sex = usePetRegistrationStore(selectPetSex);
  const setPetSex = usePetRegistrationStore(state => state.setPetSex);

  return {
    sex,
    setPetSex,
  };
};

export const usePetBirthday = () => {
  const birthday = usePetRegistrationStore(selectPetBirthday);
  const setPetBirthday = usePetRegistrationStore(state => state.setPetBirthday);

  const age = useCallback(() => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months, totalDays: diffDays };
  }, [birthday]);

  return {
    birthday,
    setPetBirthday,
    age: age(),
  };
};

export const usePetBasicInfo = () => {
  const name = usePetRegistrationStore(selectPetName);
  const ownerTitle = usePetRegistrationStore(selectPetOwnerTitle);
  const setPetName = usePetRegistrationStore(state => state.setPetName);
  const setPetOwnerTitle = usePetRegistrationStore(
    state => state.setPetOwnerTitle
  );

  return {
    name,
    ownerTitle,
    setPetName,
    setPetOwnerTitle,
  };
};

export const usePetRegistrationProgress = () => {
  const currentStep = usePetRegistrationStore(selectCurrentStep);
  const totalSteps = usePetRegistrationStore(selectTotalSteps);
  const isComplete = usePetRegistrationStore(selectIsComplete);
  const setCurrentStep = usePetRegistrationStore(state => state.setCurrentStep);

  const progress = currentStep / totalSteps;
  const progressPercentage = Math.round(progress * 100);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, setCurrentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  return {
    currentStep,
    totalSteps,
    isComplete,
    progress,
    progressPercentage,
    canGoNext: currentStep < totalSteps,
    canGoPrevious: currentStep > 1,
    nextStep,
    previousStep,
    goToStep,
  };
};

// Hook for complete pet data (read-only)
export const usePetData = () => {
  return usePetRegistrationStore(selectPetData);
};

// Hook for validation states
export const usePetRegistrationValidation = () => {
  const petData = usePetRegistrationStore(selectPetData);

  const validations = {
    category: petData.category !== null,
    photo: petData.photoUploadResult !== null,
    sex: petData.sex !== null,
    birthday: petData.birthday !== null,
    name: petData.name.trim() !== "",
    ownerTitle: petData.ownerTitle.trim() !== "",
  };

  const getStepValidation = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return validations.category;
        case 2:
          return validations.photo;
        case 3:
          return validations.sex;
        case 4:
          return validations.birthday;
        case 5:
          return validations.name;
        case 6:
          return validations.ownerTitle;
        default:
          return false;
      }
    },
    [validations]
  );

  return {
    validations,
    getStepValidation,
    isCurrentStepValid: (currentStep: number) => getStepValidation(currentStep),
  };
};
