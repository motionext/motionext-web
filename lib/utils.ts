import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale, pt, es, fr, enUS } from "date-fns/locale";
import { Filter } from "glin-profanity";
import type { Messages } from "@/types/messages";

// List of error keys for the content filter
export type ContentFilterErrorKey =
  | "inappropriate_word_filter"
  | "inappropriate_word_reserved"
  | "suspicious_pattern"
  | "too_many_numbers"
  | "repeated_characters"
  | "text_too_long"
  | "too_many_special_chars";

// Extended list of reserved and prohibited words in multiple languages
const PROHIBITED_WORDS = [
  // System and administrative terms
  "admin",
  "administrator",
  "motionext",
  "support",
  "system",
  "staff",
  "moderator",
  "official",
  "supervisor",
  "manager",
  "customer",
  "service",
  "helpdesk",
  "boss",
  "ceo",
  "owner",
  "founder",
  "director",
  "president",
  "supervisor",
  "leadership",
  "employee",
  "dev",
  "developer",
  "programmer",
  "user",
  "team",
  "security",

  // Phishing/scam terms
  "verify",
  "verification",
  "account",
  "password",
  "login",
  "signin",
  "signup",
  "bank",
  "banking",
  "credit",
  "card",
  "creditcard",
  "payment",
  "billing",
  "invoice",
  "transaction",
  "paypal",
  "blockchain",
  "bitcoin",
  "crypto",
  "wallet",
  "nft",
  "gift",
  "prize",
  "winner",
  "won",
  "lottery",
  "free",
  "deal",
  "offer",
  "discount",
  "promotion",
  "special",
  "limited",
  "urgent",
  "click",
  "link",
  "virus",
  "hack",
  "access",
  "restricted",
  "exclusive",
  "vip",
  "restricted",
  "confidential",

  // Brand names and services
  "facebook",
  "instagram",
  "tiktok",
  "twitter",
  "google",
  "youtube",
  "microsoft",
  "amazon",
  "netflix",
  "apple",
  "samsung",
  "paypal",
  "telegram",
  "whatsapp",
  "gmail",
  "hotmail",
  "outlook",
  "yahoo",
  "linkedin",
  "snapchat",
  "pinterest",
  "tinder",
  "bumble",

  // Insults and offensive terms (adding much more)
  // English
  "asshole",
  "bitch",
  "bastard",
  "cock",
  "cunt",
  "dick",
  "douchebag",
  "fag",
  "faggot",
  "fuck",
  "fucker",
  "fucking",
  "motherfucker",
  "nigger",
  "nigga",
  "piss",
  "pussy",
  "retard",
  "shit",
  "slut",
  "twat",
  "whore",
  "wanker",
  "bullshit",
  "crap",
  "arse",
  "ass",
  "jerk",
  "idiot",
  "moron",
  "dumb",
  "stupid",
  "queer",
  "cocksucker",
  "kike",
  "chink",
  "paki",
  "spic",
  "wetback",
  "rape",
  "rapist",
  "pedophile",
  "pedo",
  "nazi",
  "hitler",
  "fascist",
  "racist",
  "sexist",
  "homophobe",
  "transphobe",
  "suicide",
  "kill",
  "murder",
  "terrorist",
  "cancer",
  "aids",
  "covid",
  "disease",
  "virus",
  "hiv",

  // Portuguese
  "puta",
  "caralho",
  "merda",
  "corno",
  "viado",
  "buceta",
  "porra",
  "vadia",
  "filhodaputa",
  "bundao",
  "babaca",
  "fudido",
  "foder",
  "bicha",
  "baitola",
  "boiola",
  "arrombado",
  "cuzao",
  "pau",
  "xoxota",
  "boquete",
  "punheta",
  "veado",
  "mongol",
  "retardado",
  "macaco",
  "vagabundo",
  "safado",
  "desgraçado",
  "idiota",
  "imbecil",
  "estupro",
  "pedofilo",
  "otario",
  "foda",
  "matar",
  "suicidio",
  "assassino",
  "terrorista",

  // Spanish
  "puta",
  "pendejo",
  "mierda",
  "coño",
  "culo",
  "joder",
  "follar",
  "cabron",
  "marica",
  "maricon",
  "cojones",
  "verga",
  "polla",
  "concha",
  "chinga",
  "gilipollas",
  "perra",
  "idiota",
  "estupido",
  "imbécil",
  "nazi",
  "fascista",
  "racista",
  "homófobo",
  "suicidio",
  "matar",
  "asesino",
  "terrorista",
  "violacion",
  "cancer",
  "sida",

  // French
  "putain",
  "merde",
  "connard",
  "salope",
  "enculé",
  "con",
  "baise",
  "bite",
  "couille",
  "foutre",
  "chier",
  "branleur",
  "connasse",
  "pute",
  "bordel",
  "cul",
  "nique",
  "pede",
  "pd",
  "encule",
  "batard",
  "chienne",
  "bougnoule",
  "negro",
  "bougnoul",
  "suicide",
  "tuer",
  "assassin",
  "terroriste",
  "viol",
  "violeur",
  "cancer",
  "sida",

  // Variations of leet speak (changes with numbers)
  "a$$",
  "4ss",
  "b!tch",
  "b1tch",
  "c0ck",
  "d1ck",
  "f4g",
  "f4gg0t",
  "fu¢k",
  "fvck",
  "p0rn",
  "p0rno",
  "p3n1s",
  "pen15",
  "pus$y",
  "pu$$y",
  "s3x",
  "s3xy",
  "sh1t",
  "wh0re",

  // Combinations and variations
  "fuckyou",
  "fuckoff",
  "fucku",
  "fuckme",
  "feku",
  "fekoff",
  "fack",
  "facking",
];

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

// More extensive suspicious patterns
const SUSPICIOUS_PATTERNS = [
  // Administrative patterns
  /\b(admin|administrator|staff|official|support|moderator|supervisor)\b/i,

  // Verification/security patterns
  /\b(verify|verification|account|security|password|login|secure|validate)\b/i,

  // Financial/payment patterns
  /\b(invoice|billing|payment|paypal|bitcoin|crypto|wallet|money|cash|credit|card)\b/i,

  // System patterns
  /\b(server|system|database|backend|frontend|config|settings)\b/i,

  // Marketing and phishing patterns
  /\b(free|deal|offer|discount|special|urgent|limited|click|link|gift|prize|won|winner)\b/i,

  // Links patterns (possible phishing attempts)
  /\b(https?:\/\/|www\.)\b/i,

  // Email patterns
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,

  // Phone patterns
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
];

/**
 * Verifies if a text contains inappropriate words or suspicious patterns using multiple methods
 * @param text The text to be verified
 * @param messages Optional messages object for translations
 * @returns Object containing the verification result and the reason, if failed
 */
export function checkInappropriateContent(
  text: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  // Configuration of the filtering libraries
  const profanityFilter = new Filter({
    allLanguages: true,
    customWords: PROHIBITED_WORDS,
  });

  if (!text || text.trim().length === 0) {
    return { isValid: true };
  }

  // Normalize the text (remove accents, convert to lowercase)
  const normalizedText = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // Method 1: Verification with external libraries
  // Check using glin-profanity
  if (profanityFilter.isProfane(normalizedText)) {
    const errorKey = "inappropriate_word_filter" as ContentFilterErrorKey;
    return {
      isValid: false,
      reason:
        messages?.contentFilter?.errors?.[errorKey] ||
        `The text contains an inappropriate word detected by the content filter`,
      errorKey,
    };
  }

  // Method 2: Verification against our own list
  // Check isolated words
  const words = normalizedText.split(/[\s.,!?;:()"'-]+/);
  for (const word of words) {
    if (word && PROHIBITED_WORDS.includes(word.toLowerCase())) {
      const errorKey = "inappropriate_word_reserved" as ContentFilterErrorKey;
      return {
        isValid: false,
        reason:
          messages?.contentFilter?.errors?.[errorKey] ||
          `The text contains an inappropriate word or reserved term`,
        errorKey,
      };
    }
  }

  // Method 3: Verification with regular expressions
  // Check against our own list (words contained in the text)
  for (const word of PROHIBITED_WORDS) {
    // Check full words only
    const wordRegex = new RegExp(`\\b${word}\\b`, "i");
    if (wordRegex.test(normalizedText)) {
      const errorKey = "inappropriate_word_reserved" as ContentFilterErrorKey;
      return {
        isValid: false,
        reason:
          messages?.contentFilter?.errors?.[errorKey] ||
          `The text contains an inappropriate word or reserved term`,
        errorKey,
      };
    }
  }

  // Check suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(normalizedText)) {
      const errorKey = "suspicious_pattern" as ContentFilterErrorKey;
      return {
        isValid: false,
        reason:
          messages?.contentFilter?.errors?.[errorKey] ||
          `The text contains a suspicious pattern or reserved term`,
        errorKey,
      };
    }
  }

  // Additional quality checks

  // Check excessive numbers (possible spam)
  if ((normalizedText.match(/\d/g) || []).length > 5) {
    const errorKey = "too_many_numbers" as ContentFilterErrorKey;
    return {
      isValid: false,
      reason:
        messages?.contentFilter?.errors?.[errorKey] ||
        `The text contains too many numbers`,
      errorKey,
    };
  }

  // Check repeated characters (possible spam)
  if (/(.)\1{3,}/.test(normalizedText)) {
    const errorKey = "repeated_characters" as ContentFilterErrorKey;
    return {
      isValid: false,
      reason:
        messages?.contentFilter?.errors?.[errorKey] ||
        `The text contains too many repeated characters`,
      errorKey,
    };
  }

  // Check excessively long text
  if (normalizedText.length > 50) {
    const errorKey = "text_too_long" as ContentFilterErrorKey;
    return {
      isValid: false,
      reason:
        messages?.contentFilter?.errors?.[errorKey] ||
        `The text is too long for a name`,
      errorKey,
    };
  }

  // Check excessive special characters
  const specialCharsCount = (normalizedText.match(/[^\w\s'-]/g) || []).length;
  if (specialCharsCount > 2) {
    const errorKey = "too_many_special_chars" as ContentFilterErrorKey;
    return {
      isValid: false,
      reason:
        messages?.contentFilter?.errors?.[errorKey] ||
        `The text contains too many special characters`,
      errorKey,
    };
  }

  // If passed all checks
  return { isValid: true };
}
