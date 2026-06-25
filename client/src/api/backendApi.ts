import axios from "axios";

// Parse the environment variable if it's a comma-separated list
const envBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const apiUrls = envBaseUrl.split(",");

// If multiple URLs exist, use the first for dev and the second for production
let baseURL = apiUrls[0];
if (apiUrls.length > 1 && !import.meta.env.DEV) {
  baseURL = apiUrls[1];
}

const backendApi = axios.create({
  baseURL,
  withCredentials: true,
});

/**
 * Attach Clerk session token to every outgoing request.
 * The token getter is set once via setTokenGetter() from main.tsx.
 */
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

backendApi.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default backendApi;
