import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AgendaSidebar from "../components/AgendaSidebar";
import WeekView from "../components/WeekView";
import MonthView from "../components/MonthView";
import DayView from "../components/DayView";
import EventDialog from "../components/EventDialog";
import { ViewMode, CalendarEvent, EventColor, initialEvents } from "../types";

const TODAY = new Date(2026, 1, 27);

const AgendaPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(TODAY);
  const [viewMode, setViewMode] = useState<ViewMode>("Semana");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(new Date(2026, 1, 1));
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", startHour: "9", endHour: "10", color: "green" as EventColor });
  const [selectedDay, setSelectedDay] = useState(TODAY);

  const handlePrev = () => {
    if (viewMode === "Semana") setCurrentDate(subWeeks(currentDate, 1));
    else if (viewMode === "Mês") setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === "Dia") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "Semana") setCurrentDate(addWeeks(currentDate, 1));
    else if (viewMode === "Mês") setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === "Dia") setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(TODAY);
    setSelectedDay(TODAY);
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    setCurrentDate(day);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDay,
      startHour: parseInt(newEvent.startHour),
      endHour: parseInt(newEvent.endHour),
      color: newEvent.color,
    };
    setEvents([...events, event]);
    setNewEvent({ title: "", startHour: "9", endHour: "10", color: "green" });
    setShowNewEvent(false);
  };

  const handleConnectGoogle = () => {
    toast.info("Para integrar com o Google Calendar, é necessário ativar o Lovable Cloud para configurar OAuth e sincronização.");
  };

  return (
    <div className="flex h-full overflow-hidden">
      <AgendaSidebar
        miniCalendarMonth={miniCalendarMonth}
        selectedDay={selectedDay}
        today={TODAY}
        onMonthChange={setMiniCalendarMonth}
        onDaySelect={handleDaySelect}
        onConnectGoogle={handleConnectGoogle}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleToday}>Hoje</Button>
            <button onClick={handlePrev} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={handleNext} className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-foreground ml-2">
              {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
            {(["Mês", "Semana", "Dia", "Lista"] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </Button>
            ))}
            <Button size="sm" onClick={() => setShowNewEvent(true)} className="gap-1">
              <Plus className="h-4 w-4" /> Novo Evento
            </Button>
          </div>
        </div>

        {/* View */}
        {viewMode === "Semana" && <WeekView currentDate={currentDate} events={events} today={TODAY} />}
        {viewMode === "Mês" && <MonthView currentDate={currentDate} events={events} today={TODAY} />}
        {viewMode === "Dia" && <DayView currentDate={currentDate} events={events} today={TODAY} />}
        {viewMode === "Lista" && (
          <div className="flex-1 p-6">
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <div className={`w-3 h-3 rounded-full ${
                    event.color === "green" ? "bg-event-green" :
                    event.color === "blue" ? "bg-event-blue" :
                    event.color === "yellow" ? "bg-event-yellow" : "bg-event-red"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, "dd/MM/yyyy", { locale: ptBR })} · {String(event.startHour).padStart(2, "0")}:00 - {String(event.endHour).padStart(2, "0")}:00
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EventDialog
        open={showNewEvent}
        onOpenChange={setShowNewEvent}
        selectedDay={selectedDay}
        onSelectedDayChange={setSelectedDay}
        newEvent={newEvent}
        onNewEventChange={setNewEvent}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

export default AgendaPage;
