import { apiFetch } from "./client";

export interface CepResponse {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function fetchCep(cep: string): Promise<CepResponse | null> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return null;
  try {
    const data = await apiFetch<CepResponse>(`/api/cep?cep=${encodeURIComponent(clean)}`);
    return data;
  } catch {
    return null;
  }
}
