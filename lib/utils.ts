import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale, pt, es, fr, enUS } from "date-fns/locale";

/**
 * The function `cn` in TypeScript merges multiple class values using `clsx` and `twMerge`.
 * @param {ClassValue[]} inputs - The `inputs` parameter in the `cn` function is a rest parameter that
 * allows you to pass in multiple class values as arguments. These class values can be strings, arrays
 * of strings, or objects with key-value pairs where the key represents the class name and the value
 * represents a condition to include that
 * @returns The `cn` function is returning the result of merging the class names passed as arguments
 * using the `clsx` function and then applying Tailwind CSS utility classes using the `twMerge`
 * function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The function `getDateLocale` takes a locale code as input and returns the corresponding locale
 * object.
 * @param {string} localeCode - The `localeCode` parameter is a string that represents the code for a
 * specific locale. This code is used to determine which locale object to return from the
 * `getDateLocale` function. The function uses a switch statement to check the `localeCode` and return
 * the corresponding locale object.
 * @returns The `getDateLocale` function returns a Locale object based on the provided `localeCode`. If
 * the `localeCode` is "pt", it returns the Portuguese locale object `pt`. If the `localeCode` is "es",
 * it returns the Spanish locale object `es`. If the `localeCode` is "fr", it returns the French locale
 * object `fr`. If the `localeCode
 */
export function getDateLocale(localeCode: string): Locale {
  switch (localeCode) {
    case "pt":
      return pt;
    case "es":
      return es;
    case "fr":
      return fr;
    default:
      return enUS;
  }
}
