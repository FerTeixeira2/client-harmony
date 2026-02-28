import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
  } from "date-fns";
  import { ptBR } from "date-fns/locale";
  import {
    CalendarEvent,
    HOURS,
    eventColorClasses,
  } from "../types";
  
  interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    today: Date;
    onEventClick: (event: CalendarEvent) => void;
  }
  
  const WeekView = ({
    currentDate,
    events,
    today,
    onEventClick,
  }: WeekViewProps) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      addDays(weekStart, i)
    );
  
    const getEventsForDayAndHour = (day: Date, hour: number) =>
      events.filter(
        (e) => isSameDay(e.date, day) && e.startHour === hour
      );
  
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER DA SEMANA */}
        <div className="flex border-b border-border flex-shrink-0">
          <div className="w-14 flex-shrink-0" />
  
          {weekDays.map((day) => {
            const isToday = isSameDay(day, today);
  
            return (
              <div
                key={day.toISOString()}
                className="flex-1 text-center py-2 border-l border-border"
              >
                <p className="text-xs text-muted-foreground uppercase">
                  {format(day, "EEEE", { locale: ptBR })}.{" "}
                  {format(day, "dd/MM")}
                </p>
  
                {isToday && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1" />
                )}
              </div>
            );
          })}
        </div>
  
        {/* GRADE DE HORÁRIOS */}
        <div className="flex-1 overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="flex">
              {/* COLUNA DA HORA */}
              <div className="w-14 flex-shrink-0 h-12 flex items-start justify-end pr-2 pt-0.5 text-xs text-muted-foreground border-b border-border">
                {String(hour).padStart(2, "0")}
              </div>
  
              {/* COLUNAS DOS DIAS */}
              {weekDays.map((day) => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                const isToday = isSameDay(day, today);
  
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={`flex-1 h-12 border-l border-b border-border relative ${
                      isToday ? "bg-secondary/30" : ""
                    }`}
                  >
                    {dayEvents.map((event) => {
                      const height =
                        (event.endHour - event.startHour) * 48;
  
                      return (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`absolute inset-x-0.5 top-0 rounded px-1.5 py-0.5 text-xs text-foreground z-10 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${eventColorClasses[event.color]}`}
                          style={{ height: `${height}px` }}
                        >
                          <p className="font-medium truncate">
                            {event.title}
                          </p>
  
                          <p className="text-[10px] opacity-80">
                            {String(event.startHour).padStart(
                              2,
                              "0"
                            )}
                            :00 -{" "}
                            {String(event.endHour).padStart(
                              2,
                              "0"
                            )}
                            :00
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WeekView;