import { useState } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addDays,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AgendaSidebar from "../components/AgendaSidebar";
import WeekView from "../components/WeekView";
import MonthView from "../components/MonthView";
import DayView from "../components/DayView";
import EventDialog from "../components/EventDialog";
import {
  ViewMode,
  CalendarEvent,
  EventColor,
  initialEvents,
} from "../types";

const TODAY = new Date(2026, 1, 27);

const defaultEventState = {
  title: "",
  client: "",
  description: "",
  startHour: "9",
  endHour: "10",
  color: "green" as EventColor,
};

const AgendaPage = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(TODAY);
  const [viewMode, setViewMode] = useState<ViewMode>("Semana");
  const [events, setEvents] =
    useState<CalendarEvent[]>(initialEvents);

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    new Date(2026, 1, 1)
  );

  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  const [newEvent, setNewEvent] = useState(defaultEventState);

  /* ================= NAVIGATION ================= */

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

  /* ================= CREATE / EDIT ================= */

  const handleOpenNewEvent = () => {
    setSelectedEvent(null);
    setNewEvent(defaultEventState);
    setShowEventDialog(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDay(event.date);

    setNewEvent({
      title: event.title,
      client: event.client || "",
      description: event.description || "",
      startHour: String(event.startHour),
      endHour: String(event.endHour),
      color: event.color,
    });

    setShowEventDialog(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title.trim()) return;

    if (selectedEvent) {
      // EDITAR
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                ...newEvent,
                date: selectedDay,
                startHour: parseInt(newEvent.startHour),
                endHour: parseInt(newEvent.endHour),
              }
            : e
        )
      );
    } else {
      // CRIAR
      const event: CalendarEvent = {
        id: crypto.randomUUID(),
        title: newEvent.title,
        client: newEvent.client,
        description: newEvent.description,
        date: selectedDay,
        startHour: parseInt(newEvent.startHour),
        endHour: parseInt(newEvent.endHour),
        color: newEvent.color,
      };

      setEvents((prev) => [...prev, event]);
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setShowEventDialog(false);
    setSelectedEvent(null);
    setNewEvent(defaultEventState);
  };

  /* ================= DELETE (PREPARADO PARA FUTURO) ================= */

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    setEvents((prev) =>
      prev.filter((e) => e.id !== selectedEvent.id)
    );

    handleCloseDialog();
  };

  return (
    <div className="flex h-full overflow-hidden">

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleToday}>
              Hoje
            </Button>

            <button onClick={handlePrev}>
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button onClick={handleNext}>
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="text-sm font-medium ml-2">
              {format(currentDate, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>

            {(["Mês", "Semana", "Dia", "Lista"] as ViewMode[]).map(
              (mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </Button>
              )
            )}

            <Button size="sm" onClick={handleOpenNewEvent} className="gap-1">
              <Plus className="h-4 w-4" /> Novo Evento
            </Button>
          </div>
        </div>

        {/* VIEWS */}
        {viewMode === "Semana" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            today={TODAY}
            onEventClick={handleEventClick}
          />
        )}

        {viewMode === "Mês" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            today={TODAY}
            onEventClick={handleEventClick}
          />
        )}

        {viewMode === "Dia" && (
          <DayView
            currentDate={currentDate}
            events={events}
            today={TODAY}
            onEventClick={handleEventClick}
          />
        )}

        {viewMode === "Lista" && (
          <div className="flex-1 p-6 space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="cursor-pointer p-3 rounded-lg bg-card border border-border hover:bg-accent"
              >
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(event.date, "dd/MM/yyyy", { locale: ptBR })} ·{" "}
                  {String(event.startHour).padStart(2, "0")}:00 -
                  {String(event.endHour).padStart(2, "0")}:00
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventDialog
        open={showEventDialog}
        onOpenChange={(open) =>
          open ? setShowEventDialog(true) : handleCloseDialog()
        }
        selectedDay={selectedDay}
        onSelectedDayChange={setSelectedDay}
        newEvent={newEvent}
        onNewEventChange={setNewEvent}
        onSubmit={handleSaveEvent}
      />
    </div>
  );
};

export default AgendaPage;