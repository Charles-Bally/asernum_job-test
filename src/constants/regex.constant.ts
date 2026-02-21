export const REGEX = {
  ONLY_NUMBER: /^\d+$/,
  ONLY_LETTER: /^[a-zA-ZÀ-ÿ'\s]+$/,
  ONLY_LETTER_NUMBER: /^[a-zA-ZÀ-ÿ0-9'\s]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PASSWORD_MIN_8: /^.{8,}$/,
  HAS_UPPERCASE: /[A-Z]/,
  HAS_LOWERCASE: /[a-z]/,
  HAS_NUMBER: /[0-9]/,
  HAS_SPECIAL: /[!@#$%^&*\-_:;.,?/]/,
} as const;

export const REGEX_CLEAN = {
  ONLY_NUMBER: /[^0-9]/g,
  ONLY_LETTER: /[^a-zA-ZÀ-ÿ'\s]/g,
  ONLY_LETTER_NUMBER: /[^a-zA-ZÀ-ÿ0-9'\s]/g,
  URL: /[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=\s]/g,
} as const;
