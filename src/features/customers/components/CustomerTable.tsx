import { useEffect, useState } from "react";
import { Customer } from "@/features/customers/services/customerService";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/shared/i18n";
import * as agendaApi from "@/api/agenda";
import { fetchCustomersPaged } from "@/api/customers";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onView: (customer: Customer) => void;
  /** Quando mudar, a tabela recarrega a página atual (ex.: após criar/editar/excluir cliente) */
  refreshTrigger?: number;
}

const PAGE_SIZE = 8;

export function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onView,
  refreshTrigger = 0,
}: CustomerTableProps) {
  const { t } = useI18n();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [agendaResumo, setAgendaResumo] = useState<Record<string, string>>({});

  const filtered = rows.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoadingPage(true);
        const result = await fetchCustomersPaged(page, PAGE_SIZE);
        setRows(result.items);
        setTotal(result.totalCount);
      } catch {
        setRows([]);
        setTotal(0);
      } finally {
        setLoadingPage(false);
      }
    };

    void loadPage();
  }, [page, refreshTrigger]);

  useEffect(() => {
    const loadAgenda = async () => {
      if (rows.length === 0) {
        setAgendaResumo({});
        return;
      }

      const hoje = new Date();
      const map: Record<string, string> = {};

      await Promise.all(
        rows.map(async (c) => {
          try {
            const agendas = await agendaApi.fetchAgendasPorPessoa(c.id);

            if (!agendas || agendas.length === 0) {
              map[c.id] = "";
              return;
            }

            const withDate = agendas.map((a) => ({
              ...a,
              data: new Date(a.dataAgenda),
            }));

            const future = withDate.filter(
              (a) => a.data >= new Date(hoje.toDateString())
            );

            const alvo =
              future.sort((a, b) => a.data.getTime() - b.data.getTime())[0] ??
              withDate.sort((a, b) => b.data.getTime() - a.data.getTime())[0];

            if (!alvo) {
              map[c.id] = "";
              return;
            }

            const dataStr = alvo.data.toLocaleDateString("pt-BR");

            const [hi] = alvo.horarioInicio.split(":");
            const [hf] = alvo.horarioFim.split(":");

            map[c.id] = `${alvo.titulo}\n${dataStr} ${hi.padStart(
              2,
              "0"
            )}:00 - ${hf.padStart(2, "0")}:00`;
          } catch {
            map[c.id] = "";
          }
        })
      );

      setAgendaResumo(map);
    };

    void loadAgenda();
  }, [rows]);

  /* =============================
     RENDER
  ============================== */

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-5 mt-4">
      {/* BUSCA */}
      <div className="flex items-center gap-3 mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-secondary border-border"
        />
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2">{t.photo}</th>
              <th className="text-left py-3 px-2">{t.name}</th>
              <th className="text-left py-3 px-2">{t.email}</th>
              <th className="text-left py-3 px-2">{t.phone}</th>
              <th className="text-left py-3 px-2">{t.cpf}</th>
              <th className="text-left py-3 px-2">{t.cityState}</th>
              <th className="text-left py-3 px-2">Agenda</th>
              <th className="text-left py-3 px-2">
                {t.registrationDate}
              </th>
              <th className="text-left py-3 px-2">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {loadingPage ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  {"Carregando..."}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t.noCustomersFound}
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  {/* FOTO */}
                  <td className="py-3 px-2">
                    {customer.imagemUrl ? (
                      <img
                        src={customer.imagemUrl}
                        alt={customer.nome}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        {customer.nome.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-2 font-medium">
                    {customer.nome}
                  </td>

                  <td className="py-3 px-2 text-muted-foreground">
                    {customer.email}
                  </td>

                  <td className="py-3 px-2 text-muted-foreground">
                    {customer.telefone}
                  </td>

                  <td className="py-3 px-2 text-muted-foreground">
                    {customer.cpf}
                  </td>

                  <td className="py-3 px-2 text-muted-foreground">
                    {customer.cidade}/{customer.estado}
                  </td>

                  {/* AGENDA */}
                  <td className="py-3 px-2 text-muted-foreground whitespace-pre-line">
                    {agendaResumo[customer.id] || "-"}
                  </td>

                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(
                      customer.dataCadastro
                    ).toLocaleDateString("pt-BR")}
                  </td>

                  {/* AÇÕES */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(customer)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onEdit(customer)}
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete(customer.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
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

      {/* PAGINAÇÃO */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <span>
          {t.showing} {filtered.length} {t.of} {total}{" "}
          {t.customers}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
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