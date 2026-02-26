import { Users, UserCheck, MapPin, Mail } from "lucide-react";
import { Customer } from "@/types/customer";

interface StatsCardsProps {
  customers: Customer[];
}

export function StatsCards({ customers }: StatsCardsProps) {
  const total = customers.length;
  const withEmail = customers.filter((c) => c.email).length;
  const states = new Set(customers.map((c) => c.estado)).size;
  const today = new Date().toDateString();
  const todayCount = customers.filter(
    (c) => new Date(c.dataCadastro).toDateString() === today
  ).length;

  const cards = [
    { label: "Total de Clientes", value: total, icon: Users, color: "text-primary" },
    { label: "Com E-mail", value: withEmail, icon: Mail, color: "text-accent" },
    { label: "Estados", value: states, icon: MapPin, color: "text-destructive" },
    { label: "Cadastros Hoje", value: todayCount, icon: UserCheck, color: "text-primary" },
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
