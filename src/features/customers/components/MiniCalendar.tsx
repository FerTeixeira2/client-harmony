import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEK_DAYS_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

interface MiniCalendarProps {
  month: Date;
  selectedDay: Date;
  onMonthChange: (d: Date) => void;
  onDaySelect: (d: Date) => void;
  today: Date;
}

const MiniCalendar = ({ month, selectedDay, onMonthChange, onDaySelect, today }: MiniCalendarProps) => {
  const { days, startPad } = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return {
      days: eachDayOfInterval({ start: monthStart, end: monthEnd }),
      startPad: getDay(monthStart),
    };
  }, [month]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">
          {format(month, "MMMM yyyy", { locale: ptBR })}
        </span>
        <div className="flex gap-1">
          <button onClick={() => onMonthChange(subMonths(month, 1))} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => onMonthChange(addMonths(month, 1))} className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center text-xs">
        {WEEK_DAYS_SHORT.map((d) => (
          <div key={d} className="py-1 text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const selected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDaySelect(day)}
              className={`py-1 text-xs rounded-full transition-colors ${
                selected
                  ? "bg-primary text-primary-foreground font-bold"
                  : isToday
                  ? "text-primary font-bold"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
