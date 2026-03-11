import { WeatherData } from "@/lib/weatherData";
import { Thermometer } from "lucide-react";

interface NightAlertProps {
  weather: WeatherData;
}

export function getNightAlert(weather: WeatherData): string | null {
  // Mock: tonight's low is significantly colder than current temp
  const tonightLow = weather.temperature - 7;
  if (weather.temperature > 0 && tonightLow < 0) {
    return `Huomiseksi pakastuu (${weather.temperature > 0 ? "+" : ""}${weather.temperature}° → ${tonightLow}°), etsi toppahousut valmiiksi!`;
  }
  if (tonightLow < -15) {
    return `Yöllä kireä pakkanen (${tonightLow}°), jätä vaatteet eteiseen valmiiksi!`;
  }
  return null;
}

export default function NightAlert({ weather }: NightAlertProps) {
  const message = getNightAlert(weather);
  if (!message) return null;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 animate-fade-in">
      <Thermometer className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-display font-700 text-foreground">🌙 Ilta-muistutus</h3>
        <p className="text-sm text-foreground/80 mt-1">{message}</p>
      </div>
    </div>
  );
}
