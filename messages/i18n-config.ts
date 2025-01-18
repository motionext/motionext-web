export const i18nConfig = {
  defaultLocale: "en",
  locales: ["pt", "en", "es", "fr"],
} as const;

export type Locale = (typeof i18nConfig)["locales"][number];
