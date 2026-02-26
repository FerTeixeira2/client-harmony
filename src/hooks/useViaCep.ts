import { useState } from "react";
import { ViaCepResponse } from "@/types/customer";

export function useViaCep() {
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (cep: string): Promise<ViaCepResponse | null> => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;
    
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await res.json();
      if (data.erro) return null;
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddress, loading };
}
