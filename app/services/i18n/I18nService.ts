import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translation files
import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

export interface I18nServiceInterface {
  initialize(): Promise<void>;
  t(key: string, options?: Record<string, any>): string;
  getCurrentLanguage(): string;
  getSupportedLanguages(): string[];
  changeLanguage(languageCode: string): Promise<void>;
  getLanguageDisplayName(languageCode: string): string;
}

export class I18nService implements I18nServiceInterface {
  private static instance: I18nService;
  private readonly STORAGE_KEY = "voyagemobile_language";

  // Supported languages with their display names
  private readonly supportedLanguages = {
    en: "English",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
  };

  private constructor() {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        "zh-CN": { translation: zhCN },
        "zh-TW": { translation: zhTW },
      },
      lng: "en",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  }

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Check for saved language preference
      const savedLanguage = await AsyncStorage.getItem(this.STORAGE_KEY);

      if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
        await i18n.changeLanguage(savedLanguage);
      } else {
        // Use device locale as fallback
        const deviceLocale = this.getDeviceLanguage();
        await i18n.changeLanguage(deviceLocale);
      }
    } catch (error) {
      console.warn("Failed to initialize i18n, using default language:", error);
      await i18n.changeLanguage("en");
    }
  }

  public t(key: string, options: Record<string, any> = {}): string {
    return i18n.t(key, options) as string;
  }

  public getCurrentLanguage(): string {
    return i18n.language;
  }

  public getSupportedLanguages(): string[] {
    return Object.keys(this.supportedLanguages);
  }

  public getLanguageDisplayName(languageCode: string): string {
    return (
      this.supportedLanguages[
        languageCode as keyof typeof this.supportedLanguages
      ] || languageCode
    );
  }

  public async changeLanguage(languageCode: string): Promise<void> {
    if (!this.isLanguageSupported(languageCode)) {
      throw new Error(`Unsupported language: ${languageCode}`);
    }

    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(this.STORAGE_KEY, languageCode);
    } catch (error) {
      console.error("Failed to save language preference:", error);
      // Still change the language even if saving fails
      await i18n.changeLanguage(languageCode);
    }
  }

  private getDeviceLanguage(): string {
    try {
      const locales = Localization.getLocales();
      const primaryLocale = locales[0];

      if (primaryLocale?.languageCode) {
        const languageCode = primaryLocale.languageCode;
        const region = primaryLocale.regionCode;

        // Handle Chinese variants
        if (languageCode === "zh") {
          if (region === "CN" || region === "SG") {
            return "zh-CN";
          } else if (region === "TW" || region === "HK" || region === "MO") {
            return "zh-TW";
          }
          // Default to Simplified Chinese
          return "zh-CN";
        }

        return this.isLanguageSupported(languageCode) ? languageCode : "en";
      }
    } catch (error) {
      console.warn("Failed to get device language:", error);
    }

    return "en";
  }

  private isLanguageSupported(languageCode: string): boolean {
    return Object.keys(this.supportedLanguages).includes(languageCode);
  }
}

// Export singleton instance
export const i18nService = I18nService.getInstance();
