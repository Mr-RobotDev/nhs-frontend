import axios from "axios";
import Cookies from "js-cookie";
import { IncomingMessage } from "http";
import cookie from "cookie";

const axiosInstance = axios.create({
  baseURL: "https://api.nhs.originsmartcontrols.com/v1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("nhs_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTokenFromServerCookie = (req: IncomingMessage) => {
  if (!req.headers.cookie) return null;
  const parsedCookies = cookie.parse(req.headers.cookie);
  return parsedCookies.token || null;
};

export default axiosInstance;
