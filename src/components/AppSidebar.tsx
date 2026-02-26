import { Users, Search, LayoutDashboard } from "lucide-react";

interface AppSidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function AppSidebar({ onNavigate, currentView }: AppSidebarProps) {
  const items = [
    { title: "Cadastrar Cliente", icon: Users, view: "cadastrar" },
    { title: "Pesquisar CEP", icon: Search, view: "pesquisar-cep" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col gap-2 p-4">
      <div className="flex items-center gap-3 mb-6 px-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-sm font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-xs text-muted-foreground">Sistema de Cadastro</p>
        </div>
      </div>

      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
            currentView === item.view
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </button>
      ))}
    </aside>
  );
}
