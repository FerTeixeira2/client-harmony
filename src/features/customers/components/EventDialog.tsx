import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventColor, HOURS, eventColorClasses } from "../types";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDay: Date;
  onSelectedDayChange: (d: Date) => void;
  newEvent: { title: string; startHour: string; endHour: string; color: EventColor };
  onNewEventChange: (e: { title: string; startHour: string; endHour: string; color: EventColor }) => void;
  onSubmit: () => void;
}

const EventDialog = ({
  open,
  onOpenChange,
  selectedDay,
  onSelectedDayChange,
  newEvent,
  onNewEventChange,
  onSubmit,
}: EventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              value={newEvent.title}
              onChange={(e) => onNewEventChange({ ...newEvent, title: e.target.value })}
              placeholder="Nome do evento"
            />
          </div>
          <div>
            <Label>Data</Label>
            <Input
              type="date"
              value={format(selectedDay, "yyyy-MM-dd")}
              onChange={(e) => onSelectedDayChange(new Date(e.target.value + "T12:00:00"))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Início</Label>
              <Select value={newEvent.startHour} onValueChange={(v) => onNewEventChange({ ...newEvent, startHour: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>{String(h).padStart(2, "0")}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fim</Label>
              <Select value={newEvent.endHour} onValueChange={(v) => onNewEventChange({ ...newEvent, endHour: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>{String(h).padStart(2, "0")}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Cor</Label>
            <div className="flex gap-2 mt-1">
              {(["green", "blue", "yellow", "red"] as EventColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onNewEventChange({ ...newEvent, color: c })}
                  className={`w-6 h-6 rounded-full ${eventColorClasses[c]} ${
                    newEvent.color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSubmit}>Criar Evento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
