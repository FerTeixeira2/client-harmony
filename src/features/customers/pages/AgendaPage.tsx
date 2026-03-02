import { useEffect, useMemo, useState } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
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
import { ViewMode, CalendarEvent, EventColor } from "../types";
import type { AgendaDto } from "@/api/agenda";
import * as agendaApi from "@/api/agenda";
import * as customersApi from "@/api/customers";
import type { Customer } from "@/features/customers/services/customerService";

const TODAY = new Date();

const defaultEventState = {
  title: "",
  clientId: "",
  description: "",
  startHour: "9",
  endHour: "10",
  color: "green" as EventColor,
};

const AgendaPage = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(TODAY);
  const [viewMode, setViewMode] = useState<ViewMode>("Semana");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Customer[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
  );

  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState(defaultEventState);

  const clientesOptions = useMemo(
    () => clientes.map((c) => ({ id: c.id, nome: c.nome })),
    [clientes]
  );

  const mapAgendaToCalendarEvent = (a: AgendaDto): CalendarEvent => {
    const date = new Date(a.dataAgenda);
    const [startHourStr] = a.horarioInicio.split(":");
    const [endHourStr] = a.horarioFim.split(":");
    const clienteNome = clientes.find((c) => c.id === a.pessoaId)?.nome;

    return {
      id: a.id,
      title: a.titulo,
      pessoaId: a.pessoaId,
      clientName: clienteNome ?? "",
      description: a.descricao ?? "",
      date,
      startHour: Number(startHourStr),
      endHour: Number(endHourStr),
      color: "green",
    };
  };

  const getPeriodo = (mode: ViewMode, date: Date) => {
    if (mode === "Dia") {
      return { inicio: date, fim: date };
    }
    if (mode === "Semana") {
      return {
        inicio: startOfWeek(date, { weekStartsOn: 0 }),
        fim: endOfWeek(date, { weekStartsOn: 0 }),
      };
    }
    // Mês e Lista: usa o grid inteiro do mês (com bordas de semana)
    const mesInicio = startOfMonth(date);
    const mesFim = endOfMonth(date);
    return {
      inicio: startOfWeek(mesInicio, { weekStartsOn: 0 }),
      fim: endOfWeek(mesFim, { weekStartsOn: 0 }),
    };
  };

  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const data = await customersApi.fetchCustomers();
      setClientes(data);
    } catch {
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  const loadEventsForView = async (mode: ViewMode, date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const { inicio, fim } = getPeriodo(mode, date);
      const data = await agendaApi.fetchAgendasPorPeriodo(
        format(inicio, "yyyy-MM-dd"),
        format(fim, "yyyy-MM-dd")
      );
      setEvents(data.map(mapAgendaToCalendarEvent));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar eventos da agenda"
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClientes();
  }, []);

  useEffect(() => {
    void loadEventsForView(viewMode, currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDate, clientes.length]);

  /* ================= NAVIGATION ================= */

  const handlePrev = () => {
    if (viewMode === "Semana") setCurrentDate(subWeeks(currentDate, 1));
    else if (viewMode === "Mês" || viewMode === "Lista")
      setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === "Dia") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === "Semana") setCurrentDate(addWeeks(currentDate, 1));
    else if (viewMode === "Mês" || viewMode === "Lista")
      setCurrentDate(addMonths(currentDate, 1));
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
      clientId: event.pessoaId,
      description: event.description || "",
      startHour: String(event.startHour),
      endHour: String(event.endHour),
      color: event.color,
    });

    setShowEventDialog(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) return;
    if (!newEvent.clientId) {
      alert("Selecione um cliente antes de criar o evento.");
      return;
    }

    const dataAgenda = format(selectedDay, "yyyy-MM-dd");
    const startHour = parseInt(newEvent.startHour);
    const endHour = parseInt(newEvent.endHour);

    try {
      if (selectedEvent) {
        const updated = await agendaApi.updateAgenda(selectedEvent.id, {
          titulo: newEvent.title,
          descricao: newEvent.description,
          dataAgenda,
          horarioInicio: `${String(startHour).padStart(2, "0")}:00:00`,
          horarioFim: `${String(endHour).padStart(2, "0")}:00:00`,
        });

        // usa a cor escolhida no modal
        const date = new Date(updated.dataAgenda);
        const [startHourStr] = updated.horarioInicio.split(":");
        const [endHourStr] = updated.horarioFim.split(":");
        const clienteNome = clientes.find((c) => c.id === updated.pessoaId)?.nome;

        const mapped: CalendarEvent = {
          id: updated.id,
          title: updated.titulo,
          pessoaId: updated.pessoaId,
          clientName: clienteNome ?? "",
          description: updated.descricao ?? "",
          date,
          startHour: Number(startHourStr),
          endHour: Number(endHourStr),
          color: newEvent.color,
        };

        setEvents((prev) =>
          prev.map((e) => (e.id === mapped.id ? mapped : e))
        );
      } else {
        const created = await agendaApi.createAgenda({
          pessoaId: newEvent.clientId,
          titulo: newEvent.title,
          descricao: newEvent.description,
          dataAgenda,
          horarioInicio: `${String(startHour).padStart(2, "0")}:00:00`,
          horarioFim: `${String(endHour).padStart(2, "0")}:00:00`,
        });

        const date = new Date(created.dataAgenda);
        const [startHourStr] = created.horarioInicio.split(":");
        const [endHourStr] = created.horarioFim.split(":");
        const clienteNome = clientes.find((c) => c.id === created.pessoaId)?.nome;

        const mapped: CalendarEvent = {
          id: created.id,
          title: created.titulo,
          pessoaId: created.pessoaId,
          clientName: clienteNome ?? "",
          description: created.descricao ?? "",
          date,
          startHour: Number(startHourStr),
          endHour: Number(endHourStr),
          color: newEvent.color,
        };

        setEvents((prev) => [...prev, mapped]);
      }

      handleCloseDialog();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Erro ao salvar evento. Verifique o backend."
      );
    }
  };

  const handleCloseDialog = () => {
    setShowEventDialog(false);
    setSelectedEvent(null);
    setNewEvent(defaultEventState);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    await agendaApi.deleteAgenda(selectedEvent.id);
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    handleCloseDialog();
  };

  return (
    <div className="flex h-full overflow-hidden">
      <AgendaSidebar
        miniCalendarMonth={miniCalendarMonth}
        selectedDay={selectedDay}
        today={TODAY}
        onMonthChange={setMiniCalendarMonth}
        onDaySelect={handleDaySelect}
        onConnectGoogle={() => {}}
      />

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
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Carregando agenda...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
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
              <div className="flex-1 p-6 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                      <th className="text-left py-2 px-2">Título</th>
                      <th className="text-left py-2 px-2">Dia</th>
                      <th className="text-left py-2 px-2">Horário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="border-b border-border cursor-pointer hover:bg-accent"
                      >
                        <td className="py-2 px-2">{event.title}</td>
                        <td className="py-2 px-2">
                          {format(event.date, "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="py-2 px-2">
                          {String(event.startHour).padStart(2, "0")}:00 -{" "}
                          {String(event.endHour).padStart(2, "0")}:00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <EventDialog
        open={showEventDialog}
        onOpenChange={(open) =>
          open ? setShowEventDialog(true) : handleCloseDialog()
        }
        selectedDay={selectedDay}
        onSelectedDayChange={setSelectedDay}
        clientes={clientesOptions}
        isEditing={!!selectedEvent}
        newEvent={newEvent}
        onNewEventChange={setNewEvent}
        onSubmit={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
      />
    </div>
  );
};

export default AgendaPage;