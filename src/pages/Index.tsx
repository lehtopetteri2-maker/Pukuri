import { useState, useCallback, useRef } from "react";
import WeatherCard from "@/components/WeatherCard";
import AgeGroupToggle from "@/components/AgeGroupToggle";
import ClothingCard from "@/components/ClothingCard";
import MorningSummary from "@/components/MorningSummary";
import DaycareChecklist from "@/components/DaycareChecklist";
import NightAlert from "@/components/NightAlert";
import LocationSearch from "@/components/LocationSearch";
import TomorrowForecastCard from "@/components/TomorrowForecast";
import WeeklySchedule from "@/components/WeeklySchedule";
import ScheduleReminder from "@/components/ScheduleReminder";
import { getMockWeather, getClothingRecommendation, getSavedCity, saveCity, AgeGroup } from "@/lib/weatherData";
import { CloudSnow } from "lucide-react";

const Index = () => {
  const [city, setCity] = useState(getSavedCity);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("leikki-ikäinen");
  const scheduleRef = useRef<HTMLDivElement>(null);

  const weather = getMockWeather(city);
  const clothing = getClothingRecommendation(weather, ageGroup);

  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity);
    saveCity(newCity);
  }, []);

  const scrollToSchedule = useCallback(() => {
    scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <CloudSnow className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-800 text-foreground leading-tight">Säävahti</h1>
            <p className="text-xs text-muted-foreground">Lasten pukeutumisavustaja</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <LocationSearch currentCity={city} onSelectCity={handleCityChange} />
        <MorningSummary weather={weather} />
        <ScheduleReminder ageGroup={ageGroup} onOpen={scrollToSchedule} />
        <NightAlert weather={weather} />
        <WeatherCard weather={weather} />
        <TomorrowForecastCard weather={weather} ageGroup={ageGroup} />

        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            Lapsen ikäryhmä
          </h2>
          <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
        </div>

        <ClothingCard key={`${city}-${ageGroup}`} items={clothing} />
        <DaycareChecklist ageGroup={ageGroup} />

        <div ref={scheduleRef}>
          <WeeklySchedule ageGroup={ageGroup} />
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!
        </p>
      </main>
    </div>
  );
};

export default Index;
