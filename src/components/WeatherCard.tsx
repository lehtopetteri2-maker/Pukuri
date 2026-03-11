import { WeatherData, getWeatherIcon } from "@/lib/weatherData";
import { Droplets, Wind, MapPin, CloudRain } from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium">{weather.city}, Suomi</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl font-display font-800 tracking-tight text-foreground">
            {weather.temperature}°
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tuntuu kuin {weather.feelsLike}°
          </p>
          <p className="text-sm text-foreground/80 mt-2 capitalize">{weather.description}</p>
        </div>
        <div className="text-7xl">{getWeatherIcon(weather.condition)}</div>
      </div>

      <div className="flex gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="h-4 w-4" />
          <span>{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Droplets className="h-4 w-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CloudRain className="h-4 w-4" />
          <span>Sade {weather.rainProbability}%</span>
        </div>
      </div>
    </div>
  );
}
