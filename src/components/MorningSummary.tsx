import { ForecastAlerts } from "@/lib/forecastAlerts";
import { AlertTriangle, CloudRain, Thermometer, Sun, Wind, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface MorningSummaryProps {
  alerts: ForecastAlerts;
}

export default function MorningSummary({ alerts }: MorningSummaryProps) {
  const { t } = useLanguage();

  if (!alerts.loaded) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 flex items-center gap-3 animate-fade-in">
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
        <p className="text-sm text-muted-foreground">{t("morning.loading")}</p>
      </div>
    );
  }

  const messages: { icon: React.ReactNode; text: string }[] = [];

  // Precise rain warning — daycare hours get special message
  if (alerts.rainStartTime) {
    if (alerts.rainDuringDaycare) {
      messages.push({
        icon: <CloudRain className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
        text: t("morning.rainDaycare", { time: alerts.rainStartTime }),
      });
    } else {
      messages.push({
        icon: <CloudRain className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
        text: t("morning.rainStart", { time: alerts.rainStartTime }),
      });
    }
  }

  // Morning freezing
  if (alerts.morningFreezing) {
    messages.push({
      icon: <Thermometer className="h-4 w-4 text-destructive shrink-0 mt-0.5" />,
      text: t("morning.freezing"),
    });
  }

  // Wind chill warning > 5 m/s
  if (alerts.maxWindSpeed > 5) {
    messages.push({
      icon: <Wind className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />,
      text: t("morning.windChill", { speed: alerts.maxWindSpeed }),
    });
  }

  // UV >= 3
  if (alerts.uvMax >= 3) {
    messages.push({
      icon: <Sun className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />,
      text: t("morning.uvHigh"),
    });
  }

  // Default calm day message
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 flex items-start gap-3 animate-fade-in">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-display font-700 text-foreground">{t("morning.title")}</h3>
          <p className="text-sm text-foreground/80 mt-1">{t("morning.calmDay")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-secondary bg-secondary/10 p-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-secondary-foreground shrink-0" />
        <h3 className="text-sm font-display font-700 text-foreground">{t("morning.title")}</h3>
      </div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-2 pl-1">
            {m.icon}
            <p className="text-sm text-foreground/80">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
