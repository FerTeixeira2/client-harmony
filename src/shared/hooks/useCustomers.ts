import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/features/customers/services/customerService";
import * as api from "@/api/customers";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar clientes");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const addCustomer = useCallback(
    async (data: Omit<Customer, "id" | "dataCadastro" | "dataAtualizacao">) => {
      const created = await api.createCustomer(data);
      setCustomers((prev) => [...prev, created]);
    },
    []
  );

  const updateCustomer = useCallback(async (id: string, data: Partial<Customer>) => {
    const updated = await api.updateCustomer(id, data);
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    await api.deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: loadCustomers,
  };
}
