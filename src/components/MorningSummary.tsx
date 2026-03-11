import { WeatherData, getMorningSummary } from "@/lib/weatherData";
import { AlertTriangle } from "lucide-react";

interface MorningSummaryProps {
  weather: WeatherData;
}

export default function MorningSummary({ weather }: MorningSummaryProps) {
  const message = getMorningSummary(weather);
  if (!message) return null;

  return (
    <div className="rounded-lg border border-secondary bg-sky-light p-4 flex items-start gap-3 animate-fade-in">
      <AlertTriangle className="h-5 w-5 text-secondary-foreground mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-display font-700 text-foreground">☀️ Aamuyhteenveto</h3>
        <p className="text-sm text-foreground/80 mt-1">{message}</p>
      </div>
    </div>
  );
}
