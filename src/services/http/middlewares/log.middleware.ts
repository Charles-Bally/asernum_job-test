import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const logMiddleware = {
  onRequest: async (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug(
        "[HTTP Request]",
        config.method?.toUpperCase(),
        config.url,
        config.params || config.data,
      );
    }
    return config;
  },
  onResponse: async (response: AxiosResponse) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug(
        "[HTTP Response]",
        response.status,
        response.config.url,
        response.data,
      );
    }
    return response;
  },
  onError: async (error: AxiosError) => {
    // Ne pas logger les erreurs d'annulation (AbortError, CanceledError)
    const isCancelError =
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED" ||
      error.message === "canceled";

    if (process.env.NODE_ENV !== "production" && !isCancelError) {
      // eslint-disable-next-line no-console
      console.error(
        "[HTTP Error]",
        error.response?.status,
        error.config?.url,
        error.message,
      );
    }
    return error;
  },
};
