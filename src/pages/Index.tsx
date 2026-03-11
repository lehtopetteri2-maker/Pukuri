import { useState, useCallback } from "react";
import WeatherCard from "@/components/WeatherCard";
import AgeGroupToggle from "@/components/AgeGroupToggle";
import ClothingCard from "@/components/ClothingCard";
import AiAnalysis from "@/components/AiAnalysis";
import MorningSummary from "@/components/MorningSummary";
import DaycareChecklist from "@/components/DaycareChecklist";
import NightAlert from "@/components/NightAlert";
import LocationSearch from "@/components/LocationSearch";
import TomorrowForecastCard from "@/components/TomorrowForecast";
import WeeklySchedule from "@/components/WeeklySchedule";
import ScheduleReminder from "@/components/ScheduleReminder";
import AffiliateSection from "@/components/AffiliateSection";
import Footer from "@/components/Footer";
import FeedbackSection from "@/components/FeedbackSection";
import BottomNav, { TabId } from "@/components/BottomNav";
import { getMockWeather, getClothingRecommendation, getSavedCity, saveCity, AgeGroup } from "@/lib/weatherData";
import { CloudSnow, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const [city, setCity] = useState(getSavedCity);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("leikki-ikäinen");
  const [tab, setTab] = useState<TabId>("koti");
  const [tomorrowOpen, setTomorrowOpen] = useState(false);

  const weather = getMockWeather(city);
  const clothing = getClothingRecommendation(weather, ageGroup);

  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity);
    saveCity(newCity);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <CloudSnow className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-800 text-foreground leading-tight">Säävahti</h1>
            <p className="text-xs text-muted-foreground">Lasten pukeutumisavustaja</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* ─── KOTI ─── */}
        {tab === "koti" && (
          <>
            <MorningSummary weather={weather} />
            <NightAlert weather={weather} />
            <WeatherCard weather={weather} />

            {/* Collapsible tomorrow forecast */}
            <Collapsible open={tomorrowOpen} onOpenChange={setTomorrowOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between rounded-lg bg-night text-night-foreground px-5 py-3.5 shadow-sm">
                <span className="text-sm font-display font-700 uppercase tracking-wide text-night-muted">
                  🌙 Huomisen ennuste
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-night-muted transition-transform duration-200 ${
                    tomorrowOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  <TomorrowForecastCard weather={weather} ageGroup={ageGroup} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <AiAnalysis weather={weather} />

            <div className="space-y-3">
              <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
                Lapsen ikäryhmä
              </h2>
              <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
            </div>

            <ClothingCard key={`${city}-${ageGroup}`} items={clothing} />

            <p className="text-center text-xs text-muted-foreground">
              💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!
            </p>
          </>
        )}

        {/* ─── REPPU ─── */}
        {tab === "reppu" && (
          <>
            <ScheduleReminder ageGroup={ageGroup} onOpen={() => {}} />
            <WeeklySchedule ageGroup={ageGroup} />
            <DaycareChecklist ageGroup={ageGroup} />
          </>
        )}

        {/* ─── KAUPPA ─── */}
        {tab === "kauppa" && (
          <>
            <AffiliateSection />
            <FeedbackSection />
          </>
        )}

        {/* ─── ASETUKSET ─── */}
        {tab === "asetukset" && (
          <>
            <div className="space-y-3">
              <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
                Lapsen ikäryhmä
              </h2>
              <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
            </div>

            <LocationSearch currentCity={city} onSelectCity={handleCityChange} />

            <Footer />
          </>
        )}
      </main>

      <BottomNav activeTab={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
