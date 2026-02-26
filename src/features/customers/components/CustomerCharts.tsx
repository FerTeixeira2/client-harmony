import { Customer } from "@/features/customers/services/customerService";
import { useI18n } from "@/shared/i18n";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CustomerChartsProps {
  customers: Customer[];
}

const COLORS = [
  "hsl(185, 100%, 50%)",
  "hsl(160, 70%, 45%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(30, 90%, 55%)",
];

export function CustomerCharts({ customers }: CustomerChartsProps) {
  const { t } = useI18n();

  const byState: Record<string, number> = {};
  customers.forEach((c) => { if (c.estado) byState[c.estado] = (byState[c.estado] || 0) + 1; });
  const stateData = Object.entries(byState).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  const byCity: Record<string, number> = {};
  customers.forEach((c) => { if (c.cidade) byCity[c.cidade] = (byCity[c.cidade] || 0) + 1; });
  const cityData = Object.entries(byCity).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const withEmail = customers.filter((c) => c.email).length;
  const withoutEmail = customers.length - withEmail;
  const emailData = [
    { name: t.withEmailLabel, value: withEmail },
    { name: t.withoutEmailLabel, value: withoutEmail },
  ];

  const byMonth: Record<string, number> = {};
  customers.forEach((c) => {
    const d = new Date(c.dataCadastro);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });
  const monthData = Object.entries(byMonth).map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name)).slice(-6);

  if (customers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 mt-4 text-center text-muted-foreground">
        {t.noDataCharts}
      </div>
    );
  }

  const tooltipStyle = { backgroundColor: "hsl(220, 25%, 13%)", border: "1px solid hsl(220, 20%, 20%)", borderRadius: 8, color: "hsl(200, 20%, 90%)" };
  const tickStyle = { fill: "hsl(200, 20%, 90%)", fontSize: 12 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary inline-block" />
          {t.emailStatus}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={emailData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
              {emailData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Legend formatter={(v) => <span className="text-foreground text-xs">{v}</span>} />
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary inline-block" />
          {t.customersByState}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stateData} layout="vertical">
            <XAxis type="number" tick={tickStyle} />
            <YAxis dataKey="name" type="category" tick={tickStyle} width={40} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="hsl(185, 100%, 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent inline-block" />
          {t.customersByCity}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cityData}>
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 11 }} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent inline-block" />
          {t.registrationsByMonth}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthData}>
            <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 11 }} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="hsl(160, 70%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
