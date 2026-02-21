import environnements from "@/constants/environnements.constant";
import { createHttpClient } from "./axios.client";
import { authMiddleware } from "./middlewares/auth.middleware";
import { defaultMiddleware } from "./middlewares/default.middleware";
import { logMiddleware } from "./middlewares/log.middleware";

export const http = createHttpClient(environnements.API_URL, [
  authMiddleware,
  logMiddleware,
  defaultMiddleware,
]);

export const httpLocal = createHttpClient(environnements.API_URL, [
  authMiddleware,
  logMiddleware,
]);

// Export createHttpClient pour utilisation dans d'autres services
export { createHttpClient } from "./axios.client";
