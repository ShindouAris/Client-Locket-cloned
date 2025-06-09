const DEFAULT_BACKEND_NODES = [import.meta.env.VITE_BASE_API_URL]; // Default backend URL
const ADMIN_BACKEND_NODES = import.meta.env.VITE_ADMIN_API_URLS ? 
  JSON.parse(import.meta.env.VITE_ADMIN_API_URLS) : 
  [import.meta.env.VITE_BASE_API_URL];

export const getBackendNodes = () => {
  // Only admin/owner nodes are used for load balancing
  return ADMIN_BACKEND_NODES;
};

export const getBackendUrl = async () => {
  const useCustomBackend = localStorage.getItem("use_custom_backend") === "true";
  if (useCustomBackend) {
    const customUrl = localStorage.getItem("custom_backend_url");
    if (customUrl) {
      return customUrl.trim();
    }
  }
  
  // Import dynamically to avoid circular dependency
  const loadBalancer = (await import('./loadBalancer')).default;
  return await loadBalancer.getHealthyNode();
};

export const isUsingCustomBackend = () => {
  return localStorage.getItem("use_custom_backend") === "true";
};

export const getCustomBackendUrl = () => {
  return localStorage.getItem("custom_backend_url") || "";
};

export const setCustomBackend = (url, enabled = true) => {
  if (enabled && url) {
    localStorage.setItem("custom_backend_url", url.trim());
    localStorage.setItem("use_custom_backend", "true");
  } else {
    localStorage.removeItem("custom_backend_url");
    localStorage.setItem("use_custom_backend", "false");
  }
}; 