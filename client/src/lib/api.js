const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase}${p}` : p;
}

export async function fetchJson(path, options = {}) {
  const url = apiUrl(path);
  const headers = { "Content-Type": "application/json", ...options.headers };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = data?.message || (typeof data === "string" ? data : res.statusText);
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data;
}
