import { useState } from "react";
import { useViaCep } from "@/shared/hooks/useViaCep";
import { useI18n } from "@/shared/i18n";
import { ViaCepResponse } from "@/features/customers/services/customerService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Loader2, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface CepSearchProps {
  onBack: () => void;
}

export function CepSearch({ onBack }: CepSearchProps) {
  const { t } = useI18n();
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<ViaCepResponse | null>(null);
  const { fetchAddress, loading } = useViaCep();

  const handleSearch = async () => {
    const data = await fetchAddress(cep);
    if (data) {
      setResult(data);
      toast.success(t.cepFound);
    } else {
      setResult(null);
      toast.error(t.cepInvalid);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
  
        {/* Voltar */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToDashboard}
        </button>
  
        {/* Card Principal */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
  
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {t.searchCepTitle}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t.searchCepSubtitle}
            </p>
          </div>
  
          <div className="flex flex-col md:flex-row items-end gap-4 mb-8">
            <div className="flex-1 w-full">
              <Label className="text-foreground text-base mb-2 block">
                CEP
              </Label>
              <Input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder={t.cepPlaceholder}
                className="bg-secondary border-border h-12 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              {t.search}
            </Button>
          </div>

            {result && (
            <div className="bg-secondary border border-border rounded-xl p-6 space-y-6 animate-in fade-in">
  
              <div className="flex items-center justify-center gap-2 text-primary text-lg font-semibold">
                <MapPin className="h-6 w-6" />
                {t.addressFoundTitle}
              </div>
  
              <div className="grid md:grid-cols-2 gap-y-3 gap-x-8 text-base">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">CEP:</span>
                  <span className="font-medium">{result.cep}</span>
                </div>

                <div className="flex items-center gap-2 justify-start md:justify-start">
                  <span className="text-muted-foreground">UF:</span>
                  <span className="font-medium">{result.uf}</span>
                </div>

                {/* Linha 2 */}
                <div>
                  <span className="text-muted-foreground">{t.street}:</span>
                  <div className="font-medium">{result.logradouro}</div>
                </div>

                <div className="flex items-center gap-2 justify-start md:justify-start">
                  <span className="text-muted-foreground">{t.city}:</span>
                  <div className="font-medium">{result.localidade}</div>
                </div>

                {/* Linha 3 */}
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">{t.neighborhood}:</span>
                  <div className="font-medium">{result.bairro}</div>
                </div>
              </div>
  
              <div className="rounded-xl overflow-hidden border border-border h-72">
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${result.logradouro}, ${result.bairro}, ${result.localidade} - ${result.uf}`
                  )}&output=embed`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
