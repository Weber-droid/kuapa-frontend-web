import { getRequestConfig } from "next-intl/server";

// Supported locales
export const locales = ["en", "tw"] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = "en";

// Locale names for display
export const localeNames: Record<Locale, string> = {
  en: "English",
  tw: "Twi",
};

// Load messages for a locale
export default getRequestConfig(async ({ locale }) => {
  const finalLocale = locale || defaultLocale;
  return {
    locale: finalLocale,
    messages: (await import(`@/messages/${finalLocale}.json`)).default,
  };
});

// Helper to get locale from path or default
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/");
  const potentialLocale = segments[1] as Locale;

  if (locales.includes(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}
