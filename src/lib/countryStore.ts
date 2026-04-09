export type Country = "FI" | "SE" | "NO" | "DK";

const COUNTRY_KEY = "saavahti-country";
const ONBOARDED_KEY = "saavahti-onboarded";

export function getSavedCountry(): Country {
  const saved = localStorage.getItem(COUNTRY_KEY);
  if (saved === "SE" || saved === "NO" || saved === "DK") return saved;
  return "FI";
}

export function saveCountry(country: Country) {
  localStorage.setItem(COUNTRY_KEY, country);
}

export function isOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function setOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, "true");
}

export const countryDefaults: Record<Country, { defaultCity: string; flag: string }> = {
  FI: { defaultCity: "Helsinki", flag: "🇫🇮" },
  SE: { defaultCity: "Stockholm", flag: "🇸🇪" },
  NO: { defaultCity: "Oslo", flag: "🇳🇴" },
  DK: { defaultCity: "København", flag: "🇩🇰" },
};

export const countryNames: Record<Country, { fi: string; sv: string; en: string }> = {
  FI: { fi: "Suomi", sv: "Finland", en: "Finland" },
  SE: { fi: "Ruotsi", sv: "Sverige", en: "Sweden" },
  NO: { fi: "Norja", sv: "Norge", en: "Norway" },
  DK: { fi: "Tanska", sv: "Danmark", en: "Denmark" },
};
