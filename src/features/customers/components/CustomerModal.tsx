import { useState, useEffect } from "react";
import { Customer } from "@/features/customers/services/customerService";
import { useViaCep } from "@/shared/hooks/useViaCep";
import { useI18n } from "@/shared/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Customer, "id" | "dataCadastro" | "dataAtualizacao">) => void;
  onUpdate?: (id: string, data: Partial<Customer>) => void;
  customer?: Customer | null;
}

const emptyForm = {
  nome: "", email: "", telefone: "", cpf: "",
  cep: "", logradouro: "", numero: "", complemento: "",
  bairro: "", cidade: "", estado: "", imagemUrl: "",
};

export function CustomerModal({ open, onClose, onSave, onUpdate, customer }: CustomerModalProps) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const { fetchAddress, loading: cepLoading } = useViaCep();
  const isEditing = !!customer;

  useEffect(() => {
    if (customer) {
      setForm({
        nome: customer.nome, email: customer.email, telefone: customer.telefone,
        cpf: customer.cpf, cep: customer.cep, logradouro: customer.logradouro,
        numero: customer.numero, complemento: customer.complemento,
        bairro: customer.bairro, cidade: customer.cidade, estado: customer.estado,
        imagemUrl: customer.imagemUrl,
      });
    } else {
      setForm(emptyForm);
    }
  }, [customer, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepBlur = async () => {
    const result = await fetchAddress(form.cep);
    if (result) {
      setForm((prev) => ({
        ...prev,
        logradouro: result.logradouro,
        complemento: result.complemento,
        bairro: result.bairro,
        cidade: result.localidade,
        estado: result.uf,
      }));
      toast.success(t.addressFound);
    } else if (form.cep.replace(/\D/g, "").length === 8) {
      toast.error(t.cepNotFound);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleChange("imagemUrl", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!form.nome || !form.email || !form.cpf) {
      toast.error(t.requiredFields);
      return;
    }
    if (isEditing && onUpdate) {
      onUpdate(customer!.id, form);
      toast.success(t.customerUpdated);
    } else {
      onSave(form);
      toast.success(t.customerCreated);
    }
    onClose();
  };

  const mapQuery = form.logradouro && form.cidade && form.estado
    ? encodeURIComponent(`${form.logradouro}, ${form.numero}, ${form.bairro}, ${form.cidade} - ${form.estado}`)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg">
            {isEditing ? t.editCustomer : t.createCustomer}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image upload */}
          <div className="flex flex-col items-center gap-2">
            <label className="cursor-pointer flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/50 transition-colors w-full max-w-[200px]">
              {form.imagemUrl ? (
                <img src={form.imagemUrl} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-primary" />
                  <span className="text-xs text-primary">{t.selectPhoto}</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <span className="text-xs text-muted-foreground">{t.photoFormats}</span>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">{t.name} *</Label>
              <Input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}
                placeholder={t.fullName} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-foreground">{t.email} *</Label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t.emailPlaceholder} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-foreground">{t.phone}</Label>
              <Input value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder={t.phonePlaceholder} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-foreground">{t.cpf} *</Label>
              <Input value={form.cpf} onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder={t.cpfPlaceholder} className="bg-secondary border-border mt-1" />
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t.address}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-foreground">CEP</Label>
                <div className="relative">
                  <Input value={form.cep} onChange={(e) => handleChange("cep", e.target.value)}
                    onBlur={handleCepBlur} placeholder={t.cepPlaceholder} className="bg-secondary border-border mt-1" />
                  {cepLoading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-primary" />}
                </div>
              </div>
              <div className="md:col-span-2">
                <Label className="text-foreground">{t.street}</Label>
                <Input value={form.logradouro} onChange={(e) => handleChange("logradouro", e.target.value)}
                  placeholder={t.streetPlaceholder} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-foreground">{t.number}</Label>
                <Input value={form.numero} onChange={(e) => handleChange("numero", e.target.value)}
                  placeholder="Nº" className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-foreground">{t.complement}</Label>
                <Input value={form.complemento} onChange={(e) => handleChange("complemento", e.target.value)}
                  placeholder={t.complementPlaceholder} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-foreground">{t.neighborhood}</Label>
                <Input value={form.bairro} onChange={(e) => handleChange("bairro", e.target.value)}
                  placeholder={t.neighborhood} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-foreground">{t.city}</Label>
                <Input value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)}
                  placeholder={t.city} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <Label className="text-foreground">{t.state}</Label>
                <Input value={form.estado} onChange={(e) => handleChange("estado", e.target.value)}
                  placeholder="UF" className="bg-secondary border-border mt-1" maxLength={2} />
              </div>
            </div>
          </div>

          {/* Map preview */}
          {mapQuery && (
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t.location}</h3>
              <div className="rounded-lg overflow-hidden border border-border h-48">
                <iframe title="Map" width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="border-border text-foreground hover:bg-secondary">
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isEditing ? t.save : t.register}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
