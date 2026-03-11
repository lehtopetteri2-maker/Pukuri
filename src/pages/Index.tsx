import { useState, useCallback, useRef, useEffect } from "react";
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
import { getClothingRecommendation, getSavedCity, saveCity, AgeGroup, WeatherData } from "@/lib/weatherData";
import { fetchWeatherData, fetchWeatherByCoords, TomorrowData } from "@/lib/weatherApi";
import { getMockWeather } from "@/lib/weatherData";
import FeedbackSection from "@/components/FeedbackSection";
import { CloudSnow, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [city, setCity] = useState(getSavedCity);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("leikki-ikäinen");
  const [weather, setWeather] = useState<WeatherData>(getMockWeather(city));
  const [tomorrow, setTomorrow] = useState<TomorrowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const clothing = getClothingRecommendation(weather, ageGroup);

  const loadWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(cityName);
      setWeather(data.current);
      setTomorrow(data.tomorrow);
      setCity(data.current.city);
      saveCity(data.current.city);
      if (!data.fromApi) {
        toast.info("API ei ole vielä käytettävissä — näytetään testisäätiedot.");
      }
    } catch {
      setError("Hups! Säätietoja ei löytynyt. Tarkista kirjoitusasu.");
      toast.error("Säätietoja ei löytynyt. Tarkista kirjoitusasu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeather(data.current);
      setTomorrow(data.tomorrow);
      setCity(data.current.city);
      saveCity(data.current.city);
    } catch {
      setError("Sijaintiin perustuvia säätietoja ei löytynyt.");
      toast.error("Sijaintiin perustuvia säätietoja ei löytynyt.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load weather on mount
  useEffect(() => {
    loadWeather(city);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCityChange = useCallback((newCity: string) => {
    loadWeather(newCity);
  }, [loadWeather]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Selaimesi ei tue paikannusta.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
        toast.error("Paikannus epäonnistui. Tarkista selaimen asetukset.");
      }
    );
  }, [loadWeatherByCoords]);

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
        <LocationSearch
          currentCity={city}
          onSelectCity={handleCityChange}
          onGeolocate={handleGeolocate}
          loading={loading}
        />

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div ref={scheduleRef}>
          <WeeklySchedule ageGroup={ageGroup} />
        </div>

        <MorningSummary weather={weather} />
        <ScheduleReminder ageGroup={ageGroup} onOpen={scrollToSchedule} />
        <NightAlert weather={weather} />
        <WeatherCard weather={weather} />
        <TomorrowForecastCard weather={weather} ageGroup={ageGroup} tomorrow={tomorrow} />

        <AiAnalysis weather={weather} ageGroup={ageGroup} />

        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            Lapsen ikäryhmä
          </h2>
          <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
        </div>

        <ClothingCard key={`${city}-${ageGroup}`} items={clothing} />
        <DaycareChecklist ageGroup={ageGroup} />
        <AffiliateSection />

        <FeedbackSection />

        <p className="text-center text-xs text-muted-foreground">
          💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
