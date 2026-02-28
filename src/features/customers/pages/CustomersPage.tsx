import { useState } from "react";
import { useCustomers } from "@/shared/hooks/useCustomers";
import { useI18n } from "@/shared/i18n";
import { Customer } from "@/features/customers/services/customerService";
import { Sidebar } from "@/shared/components/Sidebar";
import { StatsCards } from "@/features/customers/components/StatsCards";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { CustomerModal } from "@/features/customers/components/CustomerModal";
import { CustomerView } from "@/features/customers/components/CustomerView";
import { CustomerCharts } from "@/features/customers/components/CustomerCharts";
import { CepSearch } from "@/features/customers/components/CepSearch";
import { LayoutGrid, BarChart3, LogOut, Languages } from "lucide-react";
import AgendaPage from "@/features/customers/pages/AgendaPage";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { t, lang, setLang } = useI18n();
  const [currentView, setCurrentView] = useState("dashboard");
  const [tab, setTab] = useState<"listagem" | "graficos">("listagem");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    if (view === "cadastrar") {
      setCurrentView("cadastrar");
      setEditingCustomer(null);
      setModalOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) { deleteCustomer(deleteId); setDeleteId(null); }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5">
              <Languages className="h-4 w-4" />
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">A</div>
              <div>
                <p className="text-xs font-medium text-foreground">{t.admin}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" /> {t.logout}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
  {currentView === "agenda" ? (
     <AgendaPage onBack={() => setCurrentView("dashboard")} />
  ) : currentView === "pesquisar-cep" ? (
    <CepSearch onBack={() => setCurrentView("dashboard")} />
  ) : (
    <>
      <h2 className="text-2xl font-bold text-foreground">{t.dashboard}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t.dashboardSubtitle}</p>

      <StatsCards customers={customers} />

      <div className="flex items-center gap-2 mt-6">
        <button
          onClick={() => setTab("listagem")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "listagem"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <LayoutGrid className="h-4 w-4" /> {t.list}
        </button>

        <button
          onClick={() => setTab("graficos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "graficos"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <BarChart3 className="h-4 w-4" /> {t.charts}
        </button>
      </div>

      {tab === "listagem" ? (
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
          onView={(c) => setViewingCustomer(c)}
        />
      ) : (
        <CustomerCharts customers={customers} />
      )}
    </>
  )}
</main>
      </div>

      <CustomerModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingCustomer(null);
            setCurrentView("dashboard");
          }}
          onSave={addCustomer}
          onUpdate={updateCustomer}
          customer={editingCustomer}
        />

      <CustomerView open={!!viewingCustomer} onClose={() => setViewingCustomer(null)} customer={viewingCustomer} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t.confirmDeletion}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">{t.confirmDeletionMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
