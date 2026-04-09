import { useState } from "react";
import { Country, countryDefaults, countryNames, saveCountry, setOnboarded } from "@/lib/countryStore";
import { Language, useLanguage } from "@/lib/i18n";
import { saveCity } from "@/lib/weatherData";
import logoImg from "@/assets/saavahti-logo.png";

const countries: Country[] = ["FI", "SE", "NO", "DK"];
const languages: { value: Language; label: string; flag: string }[] = [
  { value: "fi", label: "Suomi", flag: "🇫🇮" },
  { value: "sv", label: "Svenska", flag: "🇸🇪" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

interface OnboardingProps {
  onComplete: (country: Country) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { lang, setLanguage, t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<Country>("FI");

  const handleContinue = () => {
    saveCountry(selectedCountry);
    saveCity(countryDefaults[selectedCountry].defaultCity);
    setOnboarded();
    onComplete(selectedCountry);
  };

  const getCountryName = (c: Country) => countryNames[c][lang];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo & welcome */}
        <div className="text-center space-y-3">
          <img src={logoImg} alt="Säävahti" className="h-16 w-16 rounded-xl mx-auto" />
          <h1 className="text-2xl font-display font-800 text-foreground">{t("onboarding.welcome")}</h1>
          <p className="text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>

        {/* Country selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("onboarding.selectCountry")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCountry === c
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{countryDefaults[c].flag}</span>
                <span className="text-sm font-display font-700 text-foreground">{getCountryName(c)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
            {t("onboarding.selectLanguage")}
          </h2>
          <p className="text-xs text-muted-foreground">{t("onboarding.languageHint")}</p>
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  lang === l.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="text-sm font-display font-700 text-foreground">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-700 text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          {t("onboarding.continue")}
        </button>
      </div>
    </div>
  );
}
