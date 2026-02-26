import { useState } from "react";
import { Customer } from "@/types/customer";
import { Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
}

const PAGE_SIZE = 8;

export function CustomerTable({ customers, onEdit, onDelete, onView }: CustomerTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = customers.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-5 mt-4">
      <div className="flex items-center gap-3 mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome ou email"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-secondary border-border"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2">Foto</th>
              <th className="text-left py-3 px-2">Nome</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">Telefone</th>
              <th className="text-left py-3 px-2">CPF</th>
              <th className="text-left py-3 px-2">Cidade/UF</th>
              <th className="text-left py-3 px-2">Cadastro</th>
              <th className="text-left py-3 px-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <tr key={customer.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2">
                    {customer.imagemUrl ? (
                      <img src={customer.imagemUrl} alt={customer.nome} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        {customer.nome.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-foreground font-medium">{customer.nome}</td>
                  <td className="py-3 px-2 text-muted-foreground">{customer.email}</td>
                  <td className="py-3 px-2 text-muted-foreground">{customer.telefone}</td>
                  <td className="py-3 px-2 text-muted-foreground">{customer.cpf}</td>
                  <td className="py-3 px-2 text-muted-foreground">{customer.cidade}/{customer.estado}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(customer.dataCadastro).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onView(customer)} className="text-primary hover:text-primary/80 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => onEdit(customer)} className="text-accent hover:text-accent/80 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(customer.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <span>Mostrando {paginated.length} de {filtered.length} clientes</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-secondary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
