import { Calendar as CalendarIcon } from "lucide-react";
import MiniCalendar from "./MiniCalendar";

interface AgendaSidebarProps {
  miniCalendarMonth: Date;
  selectedDay: Date;
  today: Date;
  onMonthChange: (d: Date) => void;
  onDaySelect: (d: Date) => void;
  onConnectGoogle: () => void;
}

const AgendaSidebar = ({
  miniCalendarMonth,
  selectedDay,
  today,
  onMonthChange,
  onDaySelect,
  onConnectGoogle,
}: AgendaSidebarProps) => {
  return (
    <div className="w-44 flex-shrink-0 border-r border-border p-4 overflow-hidden">
      <MiniCalendar
        month={miniCalendarMonth}
        selectedDay={selectedDay}
        today={today}
        onMonthChange={onMonthChange}
        onDaySelect={onDaySelect}
      />

      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Minhas Agendas</p>
        <div className="flex items-center gap-1 mb-1">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Você</span>
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar;
