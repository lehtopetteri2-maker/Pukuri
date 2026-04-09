import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import WeatherCard from "@/components/WeatherCard";
import AgeGroupToggle from "@/components/AgeGroupToggle";
import DualClothingCard from "@/components/DualClothingCard";
import ShareButton from "@/components/ShareButton";
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
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { getSavedCity, saveCity, AgeGroup, WeatherData } from "@/lib/weatherData";
import { computeDualRecommendation } from "@/lib/dualRecommendation";
import { fetchWeatherData, fetchWeatherByCoords, TomorrowData } from "@/lib/weatherApi";
import { getCachedWeather, isCacheFresh, getCacheAgeMinutes, saveWeatherCache } from "@/lib/weatherCache";
import { ForecastAlerts, emptyAlerts, computeAlerts } from "@/lib/forecastAlerts";
import FeedbackSection from "@/components/FeedbackSection";
import { CloudSnow, AlertCircle } from "lucide-react";
import logoImg from "@/assets/saavahti-logo.png";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

function createPlaceholderWeather(city: string): WeatherData {
  return {
    temperature: 0,
    feelsLike: 0,
    condition: "cloudy",
    windSpeed: 0,
    humidity: 0,
    rainProbability: 0,
    afternoonRain: false,
    city,
    description: "",
  };
}

function getInitialState(city: string) {
  const cached = getCachedWeather(city);
  if (cached && Array.isArray(cached.forecastList)) {
    return {
      weather: cached.current,
      tomorrow: cached.tomorrow as TomorrowData | null,
      forecastList: cached.forecastList,
      cacheAge: getCacheAgeMinutes(cached),
      hasRealData: true,
    };
  }

  return {
    weather: createPlaceholderWeather(city),
    tomorrow: null as TomorrowData | null,
    forecastList: [] as any[],
    cacheAge: null as number | null,
    hasRealData: false,
  };
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
  const [loading, setLoading] = useState(!initial.hasRealData);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<number | null>(initial.cacheAge);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const alerts = useMemo(() => {
    if (loading && forecastList.length === 0) return emptyAlerts();
    return computeAlerts(forecastList, weather.temperature, weather.uvi);
  }, [weather, forecastList, loading]);

  const dual = useMemo(() => computeDualRecommendation(weather, ageGroup, forecastList), [weather, ageGroup, forecastList]);

  const applyResult = useCallback((data: { current: WeatherData; tomorrow: TomorrowData; forecastList: any[]; fromApi: boolean }) => {
    setWeather(data.current);
    setTomorrow(data.tomorrow);
    setForecastList(data.forecastList);
    setCity(data.current.city);
    saveCity(data.current.city);
    saveWeatherCache(data.current.city, data.current, data.tomorrow, data.forecastList, data.fromApi);
    console.log("[Säävahti] Säädata saatu:", { city: data.current.city, temp: data.current.temperature, forecastEntries: data.forecastList.length });
    setCacheAge(0);
  }, []);

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
          <img src={logoImg} alt="Pukuri" className="h-10 w-10 rounded-lg object-contain" />
          <div className="flex-1">
            <h1 className="text-xl font-display font-800 text-foreground leading-tight tracking-tight">{t("header.title")}</h1>
            <p className="text-[11px] font-medium text-muted-foreground tracking-wide">{t("header.subtitle")}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <PwaInstallBanner />
        <LocationSearch
          currentCity={city}
          onSelectCity={handleCityChange}
          onGeolocate={handleGeolocate}
          loading={loading}
        />

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <button
              onClick={handleForceRefresh}
              className="text-xs font-medium text-destructive underline underline-offset-2 hover:opacity-80 shrink-0"
            >
              {t("weather.refreshNow")}
            </button>
          </div>
        )}

        <div ref={scheduleRef}>
          <WeeklySchedule ageGroup={ageGroup} />
        </div>

        <MorningSummary alerts={alerts} ageGroup={ageGroup} />
        <ScheduleReminder ageGroup={ageGroup} onOpen={scrollToSchedule} />
        <NightAlert weather={weather} alerts={alerts} />
        <WeatherCard
          weather={weather}
          cacheAge={cacheAge}
          onRefresh={handleForceRefresh}
          loading={loading}
        />
        <TomorrowForecastCard weather={weather} ageGroup={ageGroup} tomorrow={tomorrow} forecastList={forecastList} />

        <AiAnalysis weather={weather} ageGroup={ageGroup} dual={dual} />

        <UvAlert weather={weather} />

        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("age.title")}
          </h2>
          <AgeGroupToggle selected={ageGroup} onChange={setAgeGroup} />
        </div>

        <DualClothingCard key={`${city}-${ageGroup}`} dual={dual} />
        <ShareButton dual={dual} ageGroup={ageGroup} />
        <DaycareChecklist ageGroup={ageGroup} weather={weather} />
        <AffiliateSection />

        <FeedbackSection ageGroup={ageGroup} />

        <p className="text-center text-xs text-muted-foreground">
          {t("misc.windTip")}
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
