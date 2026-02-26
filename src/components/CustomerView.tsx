import { Customer } from "@/types/customer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Mail, Phone, CreditCard, Calendar } from "lucide-react";

interface CustomerViewProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerView({ open, onClose, customer }: CustomerViewProps) {
  if (!customer) return null;

  const mapQuery = customer.logradouro && customer.cidade
    ? encodeURIComponent(`${customer.logradouro}, ${customer.numero}, ${customer.bairro}, ${customer.cidade} - ${customer.estado}`)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {customer.imagemUrl ? (
              <img src={customer.imagemUrl} alt={customer.nome} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-xl text-muted-foreground font-bold">
                {customer.nome.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-foreground">{customer.nome}</h3>
              <p className="text-sm text-muted-foreground">{customer.cidade}/{customer.estado}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span className="text-foreground">{customer.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span className="text-foreground">{customer.telefone || "—"}</span></div>
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /><span className="text-foreground">{customer.cpf}</span></div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {customer.logradouro}, {customer.numero} {customer.complemento && `- ${customer.complemento}`}, {customer.bairro}, {customer.cidade}/{customer.estado} - CEP: {customer.cep}
              </span>
            </div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-muted-foreground">Cadastro: {new Date(customer.dataCadastro).toLocaleDateString("pt-BR")} | Atualização: {new Date(customer.dataAtualizacao).toLocaleDateString("pt-BR")}</span></div>
          </div>

          {mapQuery && (
            <div className="rounded-lg overflow-hidden border border-border h-40">
              <iframe title="Mapa" width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
