const DEFAULT_BACKEND_URL = import.meta.env.VITE_BASE_API_URL; // Thay thế bằng URL mặc định của bạn

export const getBackendUrl = () => {
  const useCustomBackend = localStorage.getItem("use_custom_backend") === "true";
  if (useCustomBackend) {
    const customUrl = localStorage.getItem("custom_backend_url");
    if (customUrl) {
      return customUrl.trim();
    }
  }
  return DEFAULT_BACKEND_URL;
};

export const isUsingCustomBackend = () => {
  return localStorage.getItem("use_custom_backend") === "true";
};

export const getCustomBackendUrl = () => {
  return localStorage.getItem("custom_backend_url") || "";
};

export const setCustomBackend = (url, enabled = true) => {
  if (enabled) {
    localStorage.setItem("custom_backend_url", url.trim());
    localStorage.setItem("use_custom_backend", "true");
  } else {
    localStorage.removeItem("custom_backend_url");
    localStorage.setItem("use_custom_backend", "false");
  }
}; 