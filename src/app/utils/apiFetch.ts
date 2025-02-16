// utils/apiFetch.ts

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    throw new Error("No autorizado: Token inválido o expirado");
  }

  return res;
}
