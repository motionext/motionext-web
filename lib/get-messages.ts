import { i18nConfig, type Locale } from "@/messages/i18n-config";
import type { Messages } from "@/types/messages";

/**
 * The function `getMessages` asynchronously loads messages based on the specified locale, with a
 * fallback to English if the locale is not found.
 * @param {string} locale - The `locale` parameter in the `getMessages` function is a string that
 * represents the language locale for which you want to retrieve messages. It is used to determine
 * which set of messages to load based on the specified locale.
 * @returns The `getMessages` function returns a Promise that resolves to a `Messages` object. The
 * function first checks if the provided `locale` is included in the `i18nConfig.locales` array. If it
 * is, the function uses that locale; otherwise, it falls back to the `i18nConfig.defaultLocale`.
 */
export async function getMessages(locale: string): Promise<Messages> {
  const resolvedLocale = i18nConfig.locales.includes(locale as Locale)
    ? locale
    : i18nConfig.defaultLocale;

  try {
    const messages = (await import(`@/messages/${resolvedLocale}`)).default;
    return messages;
  } catch (error) {
    console.error(
      `Failed to load messages for locale ${resolvedLocale}:`,
      error,
    );
    // Fallback to English if the locale is not found
    return (await import("@/messages/en")).default;
  }
}
