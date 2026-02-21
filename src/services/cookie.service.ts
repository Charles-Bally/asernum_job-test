import Cookies from 'js-cookie'
import { decryptData, encryptData } from './cryptographie'

export const cookieService = {
  // Cookie methods
  getJSON<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    const raw = Cookies.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  setJSON<T>(key: string, value: T, days = 90): void {
    if (typeof window === 'undefined') return
    Cookies.set(key, JSON.stringify(value), { expires: days, sameSite: 'lax' })
  },
  getEncryptedJSON<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const encrypted = Cookies.get(key)
      if (!encrypted) return null
      const decrypted = decryptData(encrypted)
      if (typeof decrypted === 'string') {
        return JSON.parse(decrypted) as T
      }
      return decrypted as T
    } catch (error) {
      console.error('Erreur lors du déchiffrement des cookies:', error)
      return null
    }
  },
  setEncryptedJSON<T>(
    key: string,
    value: T,
    options?: { expires?: number; sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean }
  ): void {
    if (typeof window === 'undefined') return
    try {
      const jsonString = JSON.stringify(value)
      const encrypted = encryptData(jsonString)
      Cookies.set(key, encrypted, {
        expires: options?.expires ?? 7,
        sameSite: options?.sameSite ?? 'strict',
        secure: options?.secure ?? false,
      })
    } catch (error) {
      console.error('Erreur lors du chiffrement des cookies:', error)
    }
  },
  removeItem(key: string, options?: { sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean }): void {
    if (typeof window === 'undefined') return
    Cookies.remove(key, {
      sameSite: options?.sameSite ?? 'lax',
      secure: options?.secure ?? false,
    })
  },

  // SessionStorage methods
  session: {
    getJSON<T>(key: string): T | null {
      if (typeof window === 'undefined') return null
      try {
        const raw = sessionStorage.getItem(key)
        if (!raw) return null
        return JSON.parse(raw) as T
      } catch (error) {
        console.error('Erreur lors de la lecture du sessionStorage:', error)
        return null
      }
    },
    setJSON<T>(key: string, value: T): void {
      if (typeof window === 'undefined') return
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Erreur lors de l\'écriture dans le sessionStorage:', error)
      }
    },
    getEncryptedJSON<T>(key: string): T | null {
      if (typeof window === 'undefined') return null
      try {
        const encrypted = sessionStorage.getItem(key)
        if (!encrypted) return null
        const decrypted = decryptData(encrypted)
        if (typeof decrypted === 'string') {
          return JSON.parse(decrypted) as T
        }
        return decrypted as T
      } catch (error) {
        console.error('Erreur lors du déchiffrement du sessionStorage:', error)
        return null
      }
    },
    setEncryptedJSON<T>(key: string, value: T): void {
      if (typeof window === 'undefined') return
      try {
        const jsonString = JSON.stringify(value)
        const encrypted = encryptData(jsonString)
        sessionStorage.setItem(key, encrypted)
      } catch (error) {
        console.error('Erreur lors du chiffrement du sessionStorage:', error)
      }
    },
    removeItem(key: string): void {
      if (typeof window === 'undefined') return
      try {
        sessionStorage.removeItem(key)
      } catch (error) {
        console.error('Erreur lors de la suppression du sessionStorage:', error)
      }
    },
  },
}


