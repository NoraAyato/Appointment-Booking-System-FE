const API_BASE_URL = import.meta.env.VITE_API_URL ?? window.location.origin;
const NORMALIZED_API_BASE_URL = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;

export function getAssetUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path.replace(/^\/+/, ''), NORMALIZED_API_BASE_URL).toString();
}
