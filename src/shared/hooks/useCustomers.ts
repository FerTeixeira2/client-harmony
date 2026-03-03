import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/features/customers/services/customerService";
import * as api from "@/api/customers";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = await api.fetchCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar clientes");
      setCustomers([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const addCustomer = useCallback(
    async (data: Omit<Customer, "id" | "dataCadastro" | "dataAtualizacao">) => {
      await api.createCustomer(data);
      await loadCustomers(true);
    },
    [loadCustomers]
  );

  const updateCustomer = useCallback(
    async (id: string, data: Partial<Customer>) => {
      await api.updateCustomer(id, data);
      await loadCustomers(true);
    },
    [loadCustomers]
  );

  const deleteCustomer = useCallback(
    async (id: string) => {
      await api.deleteCustomer(id);
      await loadCustomers(true);
    },
    [loadCustomers]
  );

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: () => loadCustomers(false),
  };
}
