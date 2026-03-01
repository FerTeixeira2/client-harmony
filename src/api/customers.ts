import { apiFetch } from "./client";
import type { Customer } from "@/features/customers/services/customerService";

const BASE = "/api/pessoas";

export async function fetchCustomers(): Promise<Customer[]> {
  const list = await apiFetch<Customer[]>(BASE);
  return list.map((c) => ({
    ...c,
    complemento: c.complemento ?? "",
    dataCadastro: c.dataCadastro ?? "",
    dataAtualizacao: c.dataAtualizacao ?? "",
    imagemUrl: c.imagemUrl ?? "",
  }));
}

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    return await apiFetch<Customer>(`${BASE}/${id}`);
  } catch {
    return null;
  }
}

export async function createCustomer(
  data: Omit<Customer, "id" | "dataCadastro" | "dataAtualizacao">
): Promise<Customer> {
  return apiFetch<Customer>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  return apiFetch<Customer>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}
