import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
import UvAlert from "@/components/UvAlert";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getClothingRecommendation, getSavedCity, saveCity, AgeGroup, WeatherData } from "@/lib/weatherData";
import { fetchWeatherData, fetchWeatherByCoords, TomorrowData } from "@/lib/weatherApi";
import { getCachedWeather, isCacheFresh, getCacheAgeMinutes, saveWeatherCache } from "@/lib/weatherCache";
import { getMockWeather } from "@/lib/weatherData";
import { ForecastAlerts, emptyAlerts, computeAlerts } from "@/lib/forecastAlerts";
import FeedbackSection from "@/components/FeedbackSection";
import { CloudSnow, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

function getInitialState(city: string) {
  const cached = getCachedWeather(city);
  if (cached) {
    return { weather: cached.current, tomorrow: cached.tomorrow as TomorrowData | null, forecastList: cached.forecastList ?? [] as any[], cacheAge: getCacheAgeMinutes(cached) };
  }
  return { weather: getMockWeather(city), tomorrow: null as TomorrowData | null, forecastList: [] as any[], cacheAge: null as number | null };
}

const Index = () => {
  const { t } = useLanguage();
  const savedCity = getSavedCity();
  const initial = getInitialState(savedCity);

  const [city, setCity] = useState(savedCity);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("leikki-ikäinen");
  const [weather, setWeather] = useState<WeatherData>(initial.weather);
  const [tomorrow, setTomorrow] = useState<TomorrowData | null>(initial.tomorrow);
  const [forecastList, setForecastList] = useState<any[]>(initial.forecastList);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<number | null>(initial.cacheAge);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const alerts = useMemo(() => {
    if (forecastList.length === 0) return emptyAlerts();
    return computeAlerts(forecastList, weather.temperature, weather.uvi);
  }, [forecastList, weather.temperature, weather.uvi]);

  const clothing = getClothingRecommendation(weather, ageGroup);

  const applyResult = useCallback((data: { current: WeatherData; tomorrow: TomorrowData; forecastList: any[]; fromApi: boolean }) => {
    setWeather(data.current);
    setTomorrow(data.tomorrow);
    setForecastList(data.forecastList);
    setCity(data.current.city);
    saveCity(data.current.city);
    saveWeatherCache(data.current.city, data.current, data.tomorrow, data.forecastList, data.fromApi);
    console.log("[Säävahti] Säädata saatu:", { city: data.current.city, temp: data.current.temperature, forecastEntries: data.forecastList.length });
    setCacheAge(0);
    if (!data.fromApi) {
      toast.info(t("location.testData"));
    }
  }, [t]);

  const loadWeather = useCallback(async (cityName: string, force = false) => {
    if (!force) {
      const cached = getCachedWeather(cityName);
      if (cached && isCacheFresh(cached)) {
        setWeather(cached.current);
        setTomorrow(cached.tomorrow);
        setForecastList(cached.forecastList ?? []);
        setCity(cached.city);
        setCacheAge(getCacheAgeMinutes(cached));
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(cityName);
      applyResult(data);
    } catch {
      const stale = getCachedWeather(cityName);
      if (stale) {
        setWeather(stale.current);
        setTomorrow(stale.tomorrow);
        setForecastList(stale.forecastList ?? []);
        setCacheAge(getCacheAgeMinutes(stale));
        toast.warning(t("location.noConnection"));
      } else {
        setError(t("location.notFound"));
        toast.error(t("location.notFound"));
      }
    } finally {
      setLoading(false);
    }
  }, [applyResult, t]);

  const loadWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      applyResult(data);
    } catch {
      toast.error(t("location.coordsNotFound"));
    } finally {
      setLoading(false);
    }
  }, [applyResult, t]);

  useEffect(() => {
    const cached = getCachedWeather(savedCity);
    if (cached && isCacheFresh(cached)) {
      // cache fresh
    } else {
      loadWeather(savedCity, true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => {
      const cached = getCachedWeather(city);
      if (cached) setCacheAge(getCacheAgeMinutes(cached));
    }, 60000);
    return () => clearInterval(interval);
  }, [city]);

  const handleCityChange = useCallback((newCity: string) => {
    loadWeather(newCity);
  }, [loadWeather]);

  const handleForceRefresh = useCallback(() => {
    loadWeather(city, true);
  }, [loadWeather, city]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error(t("location.geoNotSupported"));
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
        toast.error(t("location.geoError"));
      }
    );
  }, [loadWeatherByCoords, t]);

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
          <div className="flex-1">
            <h1 className="text-lg font-display font-800 text-foreground leading-tight">{t("header.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("header.subtitle")}</p>
          </div>
          <LanguageSwitcher />
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

        <MorningSummary alerts={alerts} />
        <ScheduleReminder ageGroup={ageGroup} onOpen={scrollToSchedule} />
        <NightAlert weather={weather} alerts={alerts} />
        <WeatherCard
          weather={weather}
          cacheAge={cacheAge}
          onRefresh={handleForceRefresh}
          loading={loading}
        />
        <TomorrowForecastCard weather={weather} ageGroup={ageGroup} tomorrow={tomorrow} />

        <AiAnalysis weather={weather} ageGroup={ageGroup} />

        <UvAlert weather={weather} />

        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("age.title")}
          </h2>
          <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
        </div>

        <ClothingCard key={`${city}-${ageGroup}`} items={clothing} />
        <DaycareChecklist ageGroup={ageGroup} weather={weather} />
        <AffiliateSection />

        <FeedbackSection />

        <p className="text-center text-xs text-muted-foreground">
          {t("misc.windTip")}
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
