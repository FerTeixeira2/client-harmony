import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/customer";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsCards } from "@/components/StatsCards";
import { CustomerTable } from "@/components/CustomerTable";
import { CustomerModal } from "@/components/CustomerModal";
import { CustomerView } from "@/components/CustomerView";
import { CustomerCharts } from "@/components/CustomerCharts";
import { CepSearch } from "@/components/CepSearch";
import { LayoutGrid, BarChart3, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [currentView, setCurrentView] = useState("dashboard");
  const [tab, setTab] = useState<"listagem" | "graficos">("listagem");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    if (view === "cadastrar") {
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
    if (deleteId) {
      deleteCustomer(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar onNavigate={handleNavigate} currentView={currentView} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">A</div>
              <div>
                <p className="text-xs font-medium text-foreground">Administrador</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {currentView === "pesquisar-cep" ? (
            <CepSearch />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
              <p className="text-sm text-muted-foreground mb-6">Gerencie os clientes do sistema</p>

              <StatsCards customers={customers} />

              {/* Tabs */}
              <div className="flex items-center gap-2 mt-6">
                <button
                  onClick={() => setTab("listagem")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === "listagem" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Listagem
                </button>
                <button
                  onClick={() => setTab("graficos")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === "graficos" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" /> Gráficos
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

      {/* Modals */}
      <CustomerModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCustomer(null); }}
        onSave={addCustomer}
        onUpdate={updateCustomer}
        customer={editingCustomer}
      />

      <CustomerView
        open={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
