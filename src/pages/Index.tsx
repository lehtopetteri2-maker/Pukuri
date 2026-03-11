import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import AgeGroupToggle from "@/components/AgeGroupToggle";
import ClothingCard from "@/components/ClothingCard";
import MorningSummary from "@/components/MorningSummary";
import DaycareChecklist from "@/components/DaycareChecklist";
import NightAlert from "@/components/NightAlert";
import { getMockWeather, getClothingRecommendation, AgeGroup } from "@/lib/weatherData";
import { CloudSnow } from "lucide-react";

const weather = getMockWeather();

const Index = () => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("taapero");
  const clothing = getClothingRecommendation(weather, ageGroup);

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
        <MorningSummary weather={weather} />
        <NightAlert weather={weather} />
        <WeatherCard weather={weather} />

        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            Lapsen ikäryhmä
          </h2>
          <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
        </div>

        <ClothingCard key={ageGroup} items={clothing} />
        <DaycareChecklist ageGroup={ageGroup} />

        <p className="text-center text-xs text-muted-foreground pb-4">
          💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!
        </p>
      </main>
    </div>
  );
};

export default Index;
