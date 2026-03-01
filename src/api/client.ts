const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5175";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || "Erro na requisição");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
