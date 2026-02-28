export type EventColor = "green" | "blue" | "yellow" | "red";

export interface CalendarEvent {
  id: string;
  title: string;
  client?: string;
  description?: string;
  date: Date;
  startHour: number;
  endHour: number;
  color: EventColor;
}

export type ViewMode = "Mês" | "Semana" | "Dia" | "Lista";

export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const eventColorClasses: Record<EventColor, string> = {
  green: "bg-event-green",
  blue: "bg-event-blue",
  yellow: "bg-event-yellow",
  red: "bg-event-red",
};

export const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunião de equipe",
    client: "Equipe Interna",
    description: "Alinhamento semanal do time",
    date: new Date(2026, 1, 27),
    startHour: 9,
    endHour: 10,
    color: "green",
  },
  {
    id: "2",
    title: "Almoço com cliente",
    client: "Empresa XPTO",
    description: "Discussão sobre novo contrato",
    date: new Date(2026, 1, 27),
    startHour: 12,
    endHour: 13,
    color: "blue",
  },
  {
    id: "3",
    title: "Apresentação do projeto",
    client: "Cliente ABC",
    description: "Apresentação da versão final do sistema",
    date: new Date(2026, 1, 25),
    startHour: 14,
    endHour: 16,
    color: "yellow",
  },
  {
    id: "4",
    title: "Call de follow-up",
    client: "Startup Beta",
    description: "Revisão pós-entrega",
    date: new Date(2026, 1, 24),
    startHour: 10,
    endHour: 11,
    color: "green",
  },
];