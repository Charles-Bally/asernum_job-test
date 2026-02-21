import { webviewTokenMiddleware } from "@/webview-bridge";
import axios from "axios";
import { API_URL } from "../constants/environnements";
import { createGetRoute } from "../utils/routingObject";
import { tokenDiataMiddleware } from "./middlewares/app-diata.middleware";
import { decryptDataMiddleware } from "./middlewares/decrypt-data-middleware";
import { encryptDataMiddleware } from "./middlewares/ecrypt-data-middleware";
import { errorHandlingMiddleware } from "./middlewares/error.handling.middleware";
import { resultFilterMiddleware } from "./middlewares/filter.announcement.middleware";
import { newMediaAnnouncementMiddleware } from "./middlewares/new.media.announcement.middleware";
import { requestHeaderMiddleware } from "./middlewares/requests/request-header.middleware";
import { createRequestMiddlewareChain } from "./middlewares/services/request-middleware-chain.service";
import { createResponseMiddlewareChain } from "./middlewares/services/response-middleware-chain.service";
import { tokenMiddleware } from "./middlewares/token.manager.middleware";
import { userDataMiddleware } from "./middlewares/user-data.middleware";

export const SERVER_API = axios.create({
  baseURL: API_URL,
});
SERVER_API.interceptors.request.use(
  createRequestMiddlewareChain([
    webviewTokenMiddleware,
    encryptDataMiddleware,
    requestHeaderMiddleware,
    tokenDiataMiddleware,
  ]),
);
SERVER_API.interceptors.response.use(
  createResponseMiddlewareChain([
    decryptDataMiddleware,
    tokenMiddleware,
    userDataMiddleware,
    newMediaAnnouncementMiddleware,
    resultFilterMiddleware,
  ]),
  createResponseMiddlewareChain([errorHandlingMiddleware]),
);

type postDirectProps = {
  endpoint: string;
  data?: any;
  headers?: any;
  escapeBaseUrl?: boolean;
  baseUrl?: string;
};

export function get(options: postDirectProps) {
  const route = createGetRoute(
    options.escapeBaseUrl ? options.endpoint : API_URL + options.endpoint,
    options.data,
  );
  return SERVER_API.get(route, {
    headers: options.headers || {},
    baseURL: options.baseUrl,
  });
}

export function post(endpoint: string, data = {}, headers = {}) {
  return SERVER_API.post(endpoint, data, {
    headers: headers,
  });
}

export function remove(endpoint: string, headers = {}) {
  return SERVER_API.delete(endpoint, {
    headers: headers,
  });
}

export function put(endpoint: string, data = {}, headers = {}) {
  return SERVER_API.put(endpoint, data, {
    headers: headers,
  });
}

export function patch(endpoint: string, data = {}, headers = {}) {
  return SERVER_API.patch(endpoint, data, {
    headers: headers,
  });
}

export function patchCustom(options: postDirectProps) {
  const route = createGetRoute(
    options.escapeBaseUrl ? options.endpoint : API_URL + options.endpoint,
    options.data,
  );
  return SERVER_API.patch(route, {
    headers: options.headers || {},
    baseURL: options.baseUrl,
  });
}

export function postDirect(data: postDirectProps) {
  return SERVER_API.post(data.endpoint, data.data, {
    headers: data.headers,
    baseURL: data.baseUrl,
  });
}

export function patchDirect(data: postDirectProps) {
  return SERVER_API.patch(data.endpoint, data.data, {
    headers: data.headers,
    baseURL: data.baseUrl,
  });
}

export function removeDirect(data: postDirectProps) {
  return SERVER_API.delete(data.endpoint, {
    headers: data.headers,
    baseURL: data.baseUrl,
  });
}
