import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent, eventColorClasses } from "../types";

const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const MonthView = ({
  currentDate,
  events,
  today,
  onEventClick,
}: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weeks = Math.ceil(days.length / 7);

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(e.date, day));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="grid grid-cols-7 border-b border-border flex-shrink-0">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="text-center py-2 text-xs text-muted-foreground font-medium border-l border-border first:border-l-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* GRID DO MÊS */}
      <div
        className="flex-1 grid grid-cols-7"
        style={{ gridTemplateRows: `repeat(${weeks}, 1fr)` }}
      >
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day.toISOString()}
              className={`border-b border-l border-border p-1 overflow-hidden ${
                !isCurrentMonth ? "opacity-40" : ""
              } ${isToday ? "bg-secondary/30" : ""}`}
            >
              <p
                className={`text-xs mb-1 ${
                  isToday
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {format(day, "d")}
              </p>

              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`text-[10px] px-1 py-0.5 rounded truncate text-foreground cursor-pointer hover:opacity-90 transition-opacity ${eventColorClasses[event.color]}`}
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{dayEvents.length - 3} mais
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;