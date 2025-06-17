import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { i18nService } from "./I18nService";
import type { I18nServiceInterface } from "./I18nService";

interface I18nContextType {
  t: I18nServiceInterface["t"];
  currentLanguage: string;
  changeLanguage: I18nServiceInterface["changeLanguage"];
  getSupportedLanguages: I18nServiceInterface["getSupportedLanguages"];
  getLanguageDisplayName: I18nServiceInterface["getLanguageDisplayName"];
  isInitialized: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await i18nService.initialize();
        setCurrentLanguage(i18nService.getCurrentLanguage());
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        setIsInitialized(true); // Still set to true to prevent infinite loading
      }
    };

    initializeI18n();
  }, []);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18nService.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Failed to change language:", error);
      throw error;
    }
  };

  const contextValue: I18nContextType = {
    t: i18nService.t.bind(i18nService),
    currentLanguage,
    changeLanguage,
    getSupportedLanguages: i18nService.getSupportedLanguages.bind(i18nService),
    getLanguageDisplayName:
      i18nService.getLanguageDisplayName.bind(i18nService),
    isInitialized,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
