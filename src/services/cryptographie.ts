
import ENVIRONNEMENTS from "@/constants/environnements.constant";
import CryptoJS, { AES, enc } from "crypto-js";
// Fonctions de chiffrement/déchiffrement
const encryptData = (data: unknown, key?: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key || ENVIRONNEMENTS.ENCRYPTION_KEY!,
  ).toString();
};

const decryptData = (encryptedData: string, key?: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key || ENVIRONNEMENTS.ENCRYPTION_KEY!);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export { decryptData, encryptData };

export class AesEncryptionService {
  static encrypt(payload: unknown, otherSecretKey?: string, otherIv?: string) {
    try {
      const secretKey = otherSecretKey || ENVIRONNEMENTS.AES_SECRET_KEY!;
      const secretIv = otherIv || ENVIRONNEMENTS.AES_IV!;
      const key = enc.Utf8.parse(secretKey!);
      const iv = enc.Utf8.parse(secretIv!);
      if (!secretKey) {
        throw new Error("Clé de cryptage manquante");
      }
      const encrypted = AES.encrypt(JSON.stringify(payload), key, { iv: iv });
      return encrypted.toString();
    } catch (error) {
      console.error("Une erreur est survenue lors du cryptage", error);
    }
  }
  static decrypt(payload: string, otherSecretKey?: string, otherIv?: string) {
    try {
      const secretKey = otherSecretKey || ENVIRONNEMENTS.AES_SECRET_KEY!;
      const secretIv = otherIv || ENVIRONNEMENTS.AES_IV!;
      if (!payload || !secretKey) {
        throw new Error("Payload ou clé de cryptage manquante");
      }
      const key = enc.Utf8.parse(secretKey!);
      const iv = enc.Utf8.parse(secretIv!);
      const decrypted = AES.decrypt(payload, key, { iv: iv });
      const decryptedUtf8 = decrypted.toString(enc.Utf8);
      return decryptedUtf8;
    } catch (error) {
      console.error("Une erreur est survenue lors du décryptage", error);
    }
  }
}

export class AesEncryptionServiceAPI {
  static encrypt(payload: unknown, data?: { key?: string; iv?: string }) {
    try {
      const secretKey = data?.key || ENVIRONNEMENTS.ENCRYPTION_API_KEY! || ENVIRONNEMENTS.AES_SECRET_KEY!;
      const jsonString = JSON.stringify(payload);
      const encrypted = AES.encrypt(jsonString, secretKey!);
      return encrypted.toString();
    } catch (error) {
      console.error("Erreur lors de l'encryption:", error);
      throw new Error("Échec de l'encryption des données");
    }
  }

  static decrypt(payload: string, data?: { key?: string }) {
    try {
      const secretKey = data?.key || ENVIRONNEMENTS.ENCRYPTION_API_KEY! || ENVIRONNEMENTS.AES_SECRET_KEY!;
      if (!payload || !secretKey) {
        throw new Error("Payload ou clé manquante");
      }
      const decrypted = AES.decrypt(payload, secretKey);
      const decryptedUtf8 = decrypted.toString(enc.Utf8);
      if (!decryptedUtf8) {
        throw new Error("Décryptage a produit une chaîne vide");
      }
      const parsed = JSON.parse(decryptedUtf8);
      return parsed;
    } catch (error) {
      console.error("Erreur lors du décryptage:", error);
      throw new Error("Échec du décryptage des données");
    }
  }
}