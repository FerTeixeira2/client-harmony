import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent, HOURS, eventColorClasses } from "../types";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  today: Date;
}

const DayView = ({ currentDate, events, today }: DayViewProps) => {
  const isToday = isSameDay(currentDate, today);
  const dayEvents = events.filter((e) => isSameDay(e.date, currentDate));

  const getEventsForHour = (hour: number) =>
    dayEvents.filter((e) => e.startHour === hour);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-border flex-shrink-0">
        <div className="w-14 flex-shrink-0" />
        <div className="flex-1 text-center py-2 border-l border-border">
          <p className="text-xs text-muted-foreground uppercase">
            {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
          {isToday && <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1" />}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="flex">
              <div className="w-14 flex-shrink-0 h-12 flex items-start justify-end pr-2 pt-0.5 text-xs text-muted-foreground border-b border-border">
                {String(hour).padStart(2, "0")}
              </div>
              <div className={`flex-1 h-12 border-l border-b border-border relative ${isToday ? "bg-secondary/30" : ""}`}>
                {hourEvents.map((event) => {
                  const height = (event.endHour - event.startHour) * 48;
                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 top-0 rounded px-2 py-1 text-xs text-foreground z-10 cursor-pointer ${eventColorClasses[event.color]}`}
                      style={{ height: `${height}px` }}
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-[10px] opacity-80">
                        {String(event.startHour).padStart(2, "0")}:00 - {String(event.endHour).padStart(2, "0")}:00
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
