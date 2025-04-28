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

/**
 * Merges multiple class values using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the appropriate date locale object based on locale code
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

// Extended list of prohibited words across multiple languages
const PROHIBITED_WORDS = new Set([
  // System and administrative terms
  "admin", "administrator", "motionext", "support", "system", "staff",
  "moderator", "official", "supervisor", "manager", "customer", "service",
  "helpdesk", "boss", "ceo", "owner", "founder", "director", "president",
  "leadership", "employee", "dev", "developer", "programmer", "user",
  "team", "security",

  // Phishing/scam terms
  "verify", "verification", "account", "password", "login", "signin",
  "signup", "bank", "banking", "credit", "card", "creditcard", "payment",
  "billing", "invoice", "transaction", "paypal", "blockchain", "bitcoin",
  "crypto", "wallet", "nft", "gift", "prize", "winner", "won", "lottery",
  "free", "deal", "offer", "discount", "promotion", "special", "limited",
  "urgent", "click", "link", "virus", "hack", "access", "restricted", 
  "exclusive", "vip", "confidential",

  // Brand names and services
  "facebook", "instagram", "tiktok", "twitter", "google", "youtube",
  "microsoft", "amazon", "netflix", "apple", "samsung", "paypal",
  "telegram", "whatsapp", "gmail", "hotmail", "outlook", "yahoo",
  "linkedin", "snapchat", "pinterest", "tinder", "bumble",

  // Offensive terms (English)
  "asshole", "bitch", "bastard", "cock", "cunt", "dick", "douchebag",
  "fag", "faggot", "fuck", "fucker", "fucking", "motherfucker", "nigger",
  "nigga", "piss", "pussy", "retard", "shit", "slut", "twat", "whore",
  "wanker", "bullshit", "crap", "arse", "ass", "jerk", "idiot", "moron",
  "dumb", "stupid", "queer", "cocksucker", "kike", "chink", "paki", "spic",
  "wetback", "rape", "rapist", "pedophile", "pedo", "nazi", "hitler", 
  "fascist", "racist", "sexist", "homophobe", "transphobe", "suicide",
  "kill", "murder", "terrorist", "cancer", "aids", "covid", "disease",
  "virus", "hiv",

  // Offensive terms (Portuguese)
  "puta", "caralho", "merda", "corno", "viado", "buceta", "porra",
  "vadia", "filhodaputa", "bundao", "babaca", "fudido", "foder", "bicha",
  "baitola", "boiola", "arrombado", "cuzao", "pau", "xoxota", "boquete",
  "punheta", "veado", "mongol", "retardado", "macaco", "vagabundo",
  "safado", "desgraçado", "idiota", "imbecil", "estupro", "pedofilo",
  "otario", "foda", "matar", "suicidio", "assassino", "terrorista",

  // Offensive terms (Spanish)
  "pendejo", "mierda", "coño", "culo", "joder", "follar", "cabron",
  "marica", "maricon", "cojones", "verga", "polla", "concha", "chinga",
  "gilipollas", "perra", "estupido", "imbécil", "nazi", "fascista",
  "racista", "homófobo", "suicidio", "matar", "asesino", "terrorista",
  "violacion", "cancer", "sida",

  // Offensive terms (French)
  "putain", "merde", "connard", "salope", "enculé", "con", "baise",
  "bite", "couille", "foutre", "chier", "branleur", "connasse", "pute",
  "bordel", "cul", "nique", "pede", "pd", "encule", "batard", "chienne",
  "bougnoule", "negro", "bougnoul", "suicide", "tuer", "assassin",
  "terroriste", "viol", "violeur", "cancer", "sida",

  // Leet speak variations
  "a$$", "4ss", "b!tch", "b1tch", "c0ck", "d1ck", "f4g", "f4gg0t",
  "fu¢k", "fvck", "p0rn", "p0rno", "p3n1s", "pen15", "pus$y", "pu$$y",
  "s3x", "s3xy", "sh1t", "wh0re",

  // Combined variations
  "fuckyou", "fuckoff", "fucku", "fuckme", "feku", "fekoff", "fack", "facking",
]);

// Short prohibited terms (2 characters or less)
const SHORT_PROHIBITED_WORDS = new Set([
  "ku", "ss", "cp", "pd", "nf", "ky", "as", "rx", "kk", "bs", "fu", "fk", 
  "fg", "np", "nz", "ni", "hp", "vp", "cu"
]);

// Cache of prohibited words for substring matching (4+ chars only)
const PROHIBITED_WORDS_FOR_SUBSTRING = Array.from(PROHIBITED_WORDS)
  .filter(word => word.length >= 4);

// Pre-compiled regex patterns for performance optimization
const SUSPICIOUS_PATTERNS = [
  // Administrative patterns
  /\b(admin|administrator|staff|official|support|moderator|supervisor)\b/i,
  // Verification/security patterns
  /\b(verify|verification|account|security|password|login|secure|validate)\b/i,
  // Financial/payment patterns
  /\b(invoice|billing|payment|paypal|bitcoin|crypto|wallet|money|cash|credit|card)\b/i,
  // System patterns
  /\b(server|system|database|backend|frontend|config|settings)\b/i,
  // Marketing/phishing patterns
  /\b(free|deal|offer|discount|special|urgent|limited|click|link|gift|prize|won|winner)\b/i,
  // Links patterns (phishing attempts)
  /\b(https?:\/\/|www\.)\b/i,
  // Email patterns
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  // Phone patterns
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
];

// Pre-compiled common regex patterns for reuse
const WORD_BOUNDARY_REGEX = /[\s.,!?;:()"'-]+/;
const DIGIT_REGEX = /\d/g;
const REPEATED_CHARS_REGEX = /(.)\1{3,}/;
const SPECIAL_CHARS_REGEX = /[^\w\s'-]/g;

// Initialize the profanity filter once (singleton pattern)
const profanityFilter = new Filter({
  allLanguages: true,
  customWords: Array.from(PROHIBITED_WORDS),
});

// Results cache for performance optimization
const contentCheckCache = new Map<string, { 
  isValid: boolean; 
  reason?: string; 
  errorKey?: ContentFilterErrorKey 
}>();

// Cache size limit to prevent memory leaks
const MAX_CACHE_SIZE = 1000;

/**
 * Verifies if a text contains inappropriate content using multiple filtering methods
 * 
 * @param text - The text to be verified
 * @param messages - Optional messages object for translations
 * @returns Object containing the verification result, reason if invalid, and error key
 */
export function checkInappropriateContent(
  text: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  // Early return for empty strings
  if (!text || text.trim().length === 0) {
    return { isValid: true };
  }

  // Check cache first for performance optimization
  const cacheKey = text.slice(0, 100); // Limit key size
  if (contentCheckCache.has(cacheKey)) {
    return contentCheckCache.get(cacheKey)!;
  }

  // Normalize text (remove accents, convert to lowercase)
  const normalizedText = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // Store the result to return later
  let result: { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey };

  // Phase 1: External profanity filter (fastest check)
  if (profanityFilter.isProfane(normalizedText)) {
    result = {
      isValid: false,
      reason: messages?.contentFilter?.errors?.inappropriate_word_filter || 
              "The text contains inappropriate content detected by the filter",
      errorKey: "inappropriate_word_filter",
    };
  }
  // Phase 2: Check individual words against prohibited lists
  else {
    result = checkIndividualWords(normalizedText, messages);
    
    // If passed word checks, check for substring matches
    if (result.isValid) {
      result = checkEmbeddedProhibitedWords(normalizedText, messages);
      
      // If passed substring checks, check for suspicious patterns
      if (result.isValid) {
        result = checkSuspiciousPatterns(normalizedText, messages);
        
        // If passed pattern checks, perform quality checks
        if (result.isValid) {
          result = performQualityChecks(normalizedText, messages);
        }
      }
    }
  }

  // Cache the result for future use
  if (contentCheckCache.size >= MAX_CACHE_SIZE) {
    // Clear oldest 20% of entries when cache is full
    const keysToDelete = Array.from(contentCheckCache.keys())
      .slice(0, Math.floor(MAX_CACHE_SIZE * 0.2));
      
    keysToDelete.forEach(key => contentCheckCache.delete(key));
  }
  
  contentCheckCache.set(cacheKey, result);

  return result;

}

/**
 * Checks individual words against prohibited word lists
 */
function checkIndividualWords(
  normalizedText: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  const words = normalizedText.split(WORD_BOUNDARY_REGEX);
  
  for (const word of words) {
    if (!word) continue;
    
    // Check short prohibited words first (2 chars or less)
    if (word.length <= 2) {
      if (SHORT_PROHIBITED_WORDS.has(word)) {
        return {
          isValid: false,
          reason: messages?.contentFilter?.errors?.inappropriate_word_reserved || 
                  "The text contains a prohibited abbreviation or short code",
          errorKey: "inappropriate_word_reserved",
        };
      }
      continue; // Skip other checks for short words
    }
    
    // Check against main prohibited words list
    if (PROHIBITED_WORDS.has(word)) {
      return {
        isValid: false,
        reason: messages?.contentFilter?.errors?.inappropriate_word_reserved || 
                "The text contains a prohibited word or term",
        errorKey: "inappropriate_word_reserved",
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Checks for prohibited words embedded within larger words
 */
function checkEmbeddedProhibitedWords(
  normalizedText: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  // Check for prohibited words as substrings (catches attempts to hide words)
  for (const prohibitedWord of PROHIBITED_WORDS_FOR_SUBSTRING) {
    if (normalizedText.includes(prohibitedWord)) {
      return {
        isValid: false,
        reason: messages?.contentFilter?.errors?.inappropriate_word_reserved || 
                "The text contains a prohibited word or term",
        errorKey: "inappropriate_word_reserved",
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Checks for suspicious patterns that may indicate spam, phishing, etc.
 */
function checkSuspiciousPatterns(
  normalizedText: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(normalizedText)) {
      return {
        isValid: false,
        reason: messages?.contentFilter?.errors?.suspicious_pattern || 
                "The text contains a suspicious pattern or reserved term",
        errorKey: "suspicious_pattern",
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Performs additional quality checks on the text
 */
function performQualityChecks(
  normalizedText: string,
  messages?: Messages
): { isValid: boolean; reason?: string; errorKey?: ContentFilterErrorKey } {
  // Check 1: Excessive numbers (possible spam/bot content)
  const digitMatches = normalizedText.match(DIGIT_REGEX);
  if (digitMatches && digitMatches.length > 5) {
    return {
      isValid: false,
      reason: messages?.contentFilter?.errors?.too_many_numbers || 
              "The text contains too many numbers",
      errorKey: "too_many_numbers",
    };
  }

  // Check 2: Repeated characters (possible spam)
  if (REPEATED_CHARS_REGEX.test(normalizedText)) {
    return {
      isValid: false,
      reason: messages?.contentFilter?.errors?.repeated_characters || 
              "The text contains too many repeated characters",
      errorKey: "repeated_characters",
    };
  }

  // Check 3: Text length limit
  if (normalizedText.length > 50) {
    return {
      isValid: false,
      reason: messages?.contentFilter?.errors?.text_too_long || 
              "The text exceeds the maximum allowed length",
      errorKey: "text_too_long",
    };
  }

  // Check 4: Excessive special characters
  const specialCharsMatches = normalizedText.match(SPECIAL_CHARS_REGEX);
  if (specialCharsMatches && specialCharsMatches.length > 2) {
    return {
      isValid: false,
      reason: messages?.contentFilter?.errors?.too_many_special_chars || 
              "The text contains too many special characters",
      errorKey: "too_many_special_chars",
    };
  }

  // All checks passed
  return { isValid: true };
}
