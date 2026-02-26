import { useState } from "react";
import { useViaCep } from "@/hooks/useViaCep";
import { ViaCepResponse } from "@/types/customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

export function CepSearch() {
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<ViaCepResponse | null>(null);
  const { fetchAddress, loading } = useViaCep();

  const handleSearch = async () => {
    const data = await fetchAddress(cep);
    if (data) {
      setResult(data);
      toast.success("CEP encontrado!");
    } else {
      setResult(null);
      toast.error("CEP inválido ou não encontrado");
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-foreground mb-2">Pesquisar CEP</h2>
      <p className="text-sm text-muted-foreground mb-6">Consulte endereços usando a API ViaCEP</p>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Label className="text-foreground">CEP</Label>
          <Input value={cep} onChange={(e) => setCep(e.target.value)}
            placeholder="00000-000" className="bg-secondary border-border mt-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        </div>
        <div className="flex items-end">
          <Button onClick={handleSearch} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Buscar
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary mb-3">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold">Endereço Encontrado</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">CEP:</span> <span className="text-foreground">{result.cep}</span></div>
            <div><span className="text-muted-foreground">UF:</span> <span className="text-foreground">{result.uf}</span></div>
            <div className="col-span-2"><span className="text-muted-foreground">Logradouro:</span> <span className="text-foreground">{result.logradouro}</span></div>
            <div><span className="text-muted-foreground">Bairro:</span> <span className="text-foreground">{result.bairro}</span></div>
            <div><span className="text-muted-foreground">Cidade:</span> <span className="text-foreground">{result.localidade}</span></div>
          </div>

          <div className="mt-4 rounded-lg overflow-hidden border border-border h-48">
            <iframe
              title="Mapa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${result.logradouro}, ${result.bairro}, ${result.localidade} - ${result.uf}`)}&output=embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
