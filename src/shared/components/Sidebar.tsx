import { Users, Search, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/shared/i18n";

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Sidebar({ onNavigate, currentView }: SidebarProps) {
  const { t } = useI18n();

  const items = [
    { title: t.registerCustomer, icon: Users, view: "cadastrar" },
    { title: t.searchCep, icon: Search, view: "pesquisar-cep" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col gap-2 p-4">
      
      <div className="flex items-center gap-3 mb-6 px-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-sm font-bold text-foreground">
            {t.sidebarTitle}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t.sidebarSubtitle}
          </p>
        </div>
      </div>
  
      {items.map((item) => {
        const isActive = currentView === item.view;
  
        const baseClass =
          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left";
  
        const activeClass = "bg-primary text-primary-foreground";
        const inactiveClass = "text-sidebar-foreground hover:bg-sidebar-accent";
  
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`${baseClass} ${
              item.view === "cadastrar" || item.view === "pesquisar-cep"
                ? activeClass
                : isActive
                ? activeClass
                : inactiveClass
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </button>
        );
      })}
    </aside>
  );
}
