export type EventColor = "green" | "blue" | "yellow" | "red";

export interface CalendarEvent {
  id: string;
  title: string;
  pessoaId: string;
  clientName?: string;
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