import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Language, Country, saveCountry, setOnboarded } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n";
import logoImg from "@/assets/saavahti-logo.png";

const countries: { value: Country; label: string; flag: string }[] = [
  { value: "FI", label: "Suomi", flag: "🇫🇮" },
  { value: "SE", label: "Sverige", flag: "🇸🇪" },
  { value: "NO", label: "Norge", flag: "🇳🇴" },
  { value: "DK", label: "Danmark", flag: "🇩🇰" },
];

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "fi", label: "Suomi", flag: "🇫🇮" },
  { value: "sv", label: "Svenska", flag: "🇸🇪" },
  { value: "no", label: "Norsk", flag: "🇳🇴" },
  { value: "da", label: "Dansk", flag: "🇩🇰" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

const countryToLang: Record<Country, Language> = {
  FI: "fi",
  SE: "sv",
  NO: "no",
  DK: "da",
};

const langToCountry: Record<string, Country> = {
  fi: "FI",
  sv: "SE",
  nb: "NO",
  nn: "NO",
  no: "NO",
  da: "DK",
};

function detectFromLocale(): { country: Country; lang: Language } {
  const browserLang = navigator.language?.toLowerCase() || "";
  const primary = browserLang.split("-")[0];
  const region = browserLang.split("-")[1]?.toUpperCase();

  // Try region first (e.g. "en-NO" → NO)
  let detectedCountry: Country = "FI";
  if (region === "NO") detectedCountry = "NO";
  else if (region === "SE") detectedCountry = "SE";
  else if (region === "DK") detectedCountry = "DK";
  else if (region === "FI") detectedCountry = "FI";
  else if (langToCountry[primary]) detectedCountry = langToCountry[primary];

  const detectedLang = countryToLang[detectedCountry];

  return { country: detectedCountry, lang: detectedLang };
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setLanguage: setAppLanguage, t } = useLanguage();
  const detected = detectFromLocale();

  const [selectedCountry, setSelectedCountry] = useState<Country>(detected.country);
  const [selectedLang, setSelectedLang] = useState<Language>(detected.lang);

  // Auto-apply detected language for live translations on this page
  useEffect(() => {
    setAppLanguage(detected.lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Also update language to match country
    const newLang = countryToLang[country];
    setSelectedLang(newLang);
    setAppLanguage(newLang);
  };

  const handleLangChange = (lang: Language) => {
    setSelectedLang(lang);
    setAppLanguage(lang);
  };

  const handleContinue = () => {
    saveCountry(selectedCountry);
    setAppLanguage(selectedLang);
    setOnboarded();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo & Welcome */}
        <div className="text-center space-y-3">
          <img src={logoImg} alt="Säävahti" className="h-16 w-16 mx-auto rounded-xl object-contain" />
          <h1 className="text-2xl font-display font-800 text-foreground">{t("onboarding.welcome")}</h1>
          <p className="text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>

        {/* Country selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("onboarding.selectCountry")}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {countries.map((c) => (
              <button
                key={c.value}
                onClick={() => handleCountryChange(c.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  selectedCountry === c.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                <span className={`text-xs font-display font-700 ${
                  selectedCountry === c.value ? "text-primary" : "text-muted-foreground"
                }`}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("onboarding.selectLanguage")}
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {languages.map((l) => (
              <button
                key={l.value}
                onClick={() => handleLangChange(l.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  selectedLang === l.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{l.flag}</span>
                <span className={`text-[10px] font-display font-700 leading-tight text-center ${
                  selectedLang === l.value ? "text-primary" : "text-muted-foreground"
                }`}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-700 text-base shadow-md hover:bg-primary/90 transition-colors"
        >
          {t("onboarding.continue")}
        </button>
      </div>
    </div>
  );
}
