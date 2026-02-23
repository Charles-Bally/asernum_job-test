
export const QUERY_KEYS = {
  AUTH: {
    LOGIN: ["auth", "login"],
    FORGOT_PASSWORD: ["auth", "forgot-password"],
    VERIFY_OTP: ["auth", "verify-otp"],
    RESET_PASSWORD: ["auth", "reset-password"],
    PROFILE: ["auth", "profile"],
  },
  DASHBOARD: {
    BALANCE: ["dashboard", "balance"],
    TOP_STORES: ["dashboard", "top-stores"],
    STATS: ["dashboard", "stats"],
  },
  TRANSACTIONS: ["transactions"],
  TRANSACTION_DETAIL: ["transactions", "detail"],
  STORES: ["stores"],
  STORE_DETAIL: ["stores", "detail"],
  STORE_TOP_COMMUNES: ["stores", "top-communes"],
  CASHIERS: ["cashiers"],
  CASHIER_DETAIL: ["cashiers", "detail"],
  USERS: ["users"],
  USER_DETAIL: ["users", "detail"],
  ACCOUNT_EVENTS: ["account-events"],
  CLIENTS: ["clients"],
  CLIENT_DETAIL: ["clients", "detail"],
}
