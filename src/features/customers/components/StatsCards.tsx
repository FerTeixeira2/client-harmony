import { Customer } from "@/features/customers/services/customerService";
import { useI18n } from "@/shared/i18n";
import { Users, UserCheck, MapPin, Mail } from "lucide-react";

interface StatsCardsProps {
  customers: Customer[];
}

export function StatsCards({ customers }: StatsCardsProps) {
  const { t } = useI18n();
  const total = customers.length;
  const withEmail = customers.filter((c) => c.email).length;
  const states = new Set(customers.map((c) => c.estado)).size;
  const today = new Date().toDateString();
  const todayCount = customers.filter(
    (c) => new Date(c.dataCadastro).toDateString() === today
  ).length;

  const cards = [
    { label: t.totalCustomers, value: total, icon: Users, color: "text-primary" },
    { label: t.withEmail, value: withEmail, icon: Mail, color: "text-accent" },
    { label: t.states, value: states, icon: MapPin, color: "text-destructive" },
    { label: t.registeredToday, value: todayCount, icon: UserCheck, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border border-border rounded-xl p-5">
          <card.icon className={`h-8 w-8 ${card.color} mb-3`} />
          <p className="text-3xl font-bold text-foreground">{card.value}</p>
          <p className="text-sm text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
