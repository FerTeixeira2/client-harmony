import { useState, useEffect } from "react";
import { Customer } from "@/features/customers/services/customerService";

const STORAGE_KEY = "customers";

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "sample-1", nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1111",
    cpf: "123.456.789-00", cep: "01001-000", logradouro: "Praça da Sé", numero: "100",
    complemento: "Sala 5", bairro: "Sé", cidade: "São Paulo", estado: "SP",
    dataCadastro: "2025-01-15T10:00:00Z", dataAtualizacao: "2025-01-15T10:00:00Z", imagemUrl: "",
  },
  {
    id: "sample-2", nome: "Maria Oliveira", email: "maria@email.com", telefone: "(21) 98888-2222",
    cpf: "987.654.321-00", cep: "20040-020", logradouro: "Av. Rio Branco", numero: "50",
    complemento: "", bairro: "Centro", cidade: "Rio de Janeiro", estado: "RJ",
    dataCadastro: "2025-02-10T14:00:00Z", dataAtualizacao: "2025-02-10T14:00:00Z", imagemUrl: "",
  },
  {
    id: "sample-3", nome: "Carlos Santos", email: "carlos@email.com", telefone: "(31) 97777-3333",
    cpf: "111.222.333-44", cep: "30130-000", logradouro: "Av. Afonso Pena", numero: "1000",
    complemento: "Apto 301", bairro: "Centro", cidade: "Belo Horizonte", estado: "MG",
    dataCadastro: "2025-01-20T09:00:00Z", dataAtualizacao: "2025-03-01T11:00:00Z", imagemUrl: "",
  },
  {
    id: "sample-4", nome: "Ana Costa", email: "", telefone: "(41) 96666-4444",
    cpf: "444.555.666-77", cep: "80010-000", logradouro: "Rua XV de Novembro", numero: "200",
    complemento: "", bairro: "Centro", cidade: "Curitiba", estado: "PR",
    dataCadastro: "2025-03-05T16:00:00Z", dataAtualizacao: "2025-03-05T16:00:00Z", imagemUrl: "",
  },
  {
    id: "sample-5", nome: "Pedro Lima", email: "pedro@email.com", telefone: "(11) 95555-5555",
    cpf: "555.666.777-88", cep: "04001-000", logradouro: "Av. Paulista", numero: "900",
    complemento: "Conj 12", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP",
    dataCadastro: "2025-02-28T08:00:00Z", dataAtualizacao: "2025-02-28T08:00:00Z", imagemUrl: "",
  },
  {
    id: "sample-6", nome: "Fernanda Rocha", email: "fernanda@email.com", telefone: "(51) 94444-6666",
    cpf: "666.777.888-99", cep: "90010-000", logradouro: "Rua dos Andradas", numero: "500",
    complemento: "", bairro: "Centro Histórico", cidade: "Porto Alegre", estado: "RS",
    dataCadastro: "2026-02-20T12:00:00Z", dataAtualizacao: "2026-02-20T12:00:00Z", imagemUrl: "",
  },
];

const getStoredCustomers = (): Customer[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.length > 0) return parsed;
  }
  return SAMPLE_CUSTOMERS;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(getStoredCustomers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customer: Omit<Customer, "id" | "dataCadastro" | "dataAtualizacao">) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      dataCadastro: now,
      dataAtualizacao: now,
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...data, dataAtualizacao: new Date().toISOString() } : c
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return { customers, addCustomer, updateCustomer, deleteCustomer };
}
