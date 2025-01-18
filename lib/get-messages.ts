import { i18nConfig, type Locale } from "@/messages/i18n-config";
import type { Messages } from "@/types/messages";

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
      error
    );
    // Fallback to English if the locale is not found
    return (await import("@/messages/en")).default;
  }
}
