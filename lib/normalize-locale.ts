import { i18nConfig, Locale } from "@/messages/i18n-config";

/**
 * Normalizes a locale to ensure it is compatible with the available translation files.
 * Converts formats like "pt-PT" to "pt" and checks if the locale is supported.
 * 
 * @param locale - The locale to normalize, ex: "pt-PT", "en-US"
 * @returns The normalized locale, ex: "pt", "en"
 */
export function normalizeLocale(locale: string = ""): string {
  if (!locale) {
    return i18nConfig.defaultLocale;
  }
  
  // Extract the base language code (ex: "pt-PT" -> "pt")
  const baseLocale = locale.split('-')[0].toLowerCase();
  
  // Check if the normalized locale is in the supported locales list
  const supportedLocales = i18nConfig.locales;
  if (supportedLocales.includes(baseLocale as Locale)) {
    return baseLocale;
  }
  
  // Return the default locale if not supported
  return i18nConfig.defaultLocale;
} 