import { useState } from "react";
import { ViaCepResponse } from "@/features/customers/services/customerService";
import { fetchCep } from "@/api/cep";

export function useViaCep() {
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (cep: string): Promise<ViaCepResponse | null> => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;

    setLoading(true);
    try {
      const data = await fetchCep(cep);
      if (!data) return null;
      return {
        cep: cleanCep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
      };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddress, loading };
}
