import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";

const STORAGE_KEY = "customers";

const getStoredCustomers = (): Customer[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
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
