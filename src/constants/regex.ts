export enum regexType {
  ONLY_NUMBER = "ONLY_NUMBER",
  ONLY_LETTER = "ONLY_LETTER",
  ONLY_LETTER_NUMBER = "ONLY_LETTER_NUMBER",
  EMAIL = "EMAIL",
  URL = "URL",
}

export enum regexActionFunc {
  TEST = "TEST",
  RETURN_NEW_STRING = "RETURN_NEW_STRING",
}
const regexPatterns = {
  // Pour les tests (vérifie si la chaîne entière correspond)
  test: {
    ONLY_NUMBER: /^\d+$/,
    ONLY_LETTER: /^[a-zA-ZÀ-ÿ'\s]+$/,
    ONLY_LETTER_NUMBER: /^[a-zA-ZÀ-ÿ0-9'\s]+$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
  // Pour le nettoyage (garde uniquement les caractères souhaités)
  clean: {
    ONLY_NUMBER: /[^0-9]/g,
    ONLY_LETTER: /[^a-zA-ZÀ-ÿ'\s]/g,
    ONLY_LETTER_NUMBER: /[^a-zA-ZÀ-ÿ0-9'\s]/g,
    URL: /[^a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=\s]/g,
  },
};

export const regexFunc = (
  data: string,
  action: regexActionFunc,
  type: regexType,
): string | boolean => {
  if (!data) return "";

  if (action === regexActionFunc.TEST) {
    return regexPatterns.test[type].test(data);
  } else if (action === regexActionFunc.RETURN_NEW_STRING) {
    if (type === regexType.EMAIL) {
      return data; // Pour les emails, on retourne la chaîne telle quelle
    }
    // Pour les autres types, on nettoie la chaîne en gardant uniquement les caractères souhaités
    return data.replace(regexPatterns.clean[type], "");
  }

  return false;
};
