import { StateStorage } from 'zustand/middleware'
import { cookieService } from './cookie.service'

const REMEMBER_ME_KEY = 'auth:remember_me'

export const storageService = {
  getRememberMe(): boolean {
    return true
  },

  setRememberMe(value: boolean): void {
    cookieService.setJSON(REMEMBER_ME_KEY, value, 365)
  },

  getJSON<T>(key: string): T | null {
    const rememberMe = this.getRememberMe()
    return rememberMe ? cookieService.getJSON<T>(key) : cookieService.session.getJSON<T>(key)
  },

  setJSON<T>(key: string, value: T): void {
    const rememberMe = this.getRememberMe()
    if (rememberMe) {
      cookieService.setJSON(key, value)
    } else {
      cookieService.session.setJSON(key, value)
    }
  },

  getEncryptedJSON<T>(key: string): T | null {
    const rememberMe = this.getRememberMe()
    return rememberMe
      ? cookieService.getEncryptedJSON<T>(key)
      : cookieService.session.getEncryptedJSON<T>(key)
  },

  setEncryptedJSON<T>(key: string, value: T): void {
    const rememberMe = this.getRememberMe()
    if (rememberMe) {
      cookieService.setEncryptedJSON(key, value, {
        expires: 7,
        sameSite: 'strict',
        secure: false,
      })
    } else {
      cookieService.session.setEncryptedJSON(key, value)
    }
  },

  removeItem(key: string): void {
    cookieService.removeItem(key, { sameSite: 'strict', secure: false })
    cookieService.session.removeItem(key)
  },

  clearAuthData(): void {
    const keys = ['auth:token', 'auth:refresh_token', 'auth:app_token', 'auth-storage', 'owner-select-storage', 'estate-select-storage']
    keys.forEach((key) => this.removeItem(key))
    cookieService.removeItem(REMEMBER_ME_KEY)
  },

  createZustandStorage(): StateStorage {
    return {
      getItem: (name: string) => {
        const data = this.getEncryptedJSON<any>(name)
        return data ? JSON.stringify(data) : null
      },
      setItem: (name: string, value: string) => {
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value
          this.setEncryptedJSON(name, parsed)
        } catch {
          this.setEncryptedJSON(name, value)
        }
      },
      removeItem: (name: string) => {
        this.removeItem(name)
      },
    }
  },
}
