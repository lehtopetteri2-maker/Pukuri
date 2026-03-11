export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "windy";

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  windSpeed: number;
  humidity: number;
  rainProbability: number;
  afternoonRain: boolean;
  city: string;
  description: string;
}

export type AgeGroup = "vauva" | "taapero" | "leikki-ikäinen" | "koululainen";

export interface ClothingItem {
  name: string;
  emoji: string;
  description: string;
}

const cityWeather: Record<string, WeatherData> = {
  Helsinki: {
    temperature: -3, feelsLike: -8, condition: "snowy", windSpeed: 12,
    humidity: 85, rainProbability: 65, afternoonRain: true,
    city: "Helsinki", description: "Lumisadetta, heikko tuuli",
  },
  Espoo: {
    temperature: -2, feelsLike: -7, condition: "cloudy", windSpeed: 10,
    humidity: 80, rainProbability: 45, afternoonRain: true,
    city: "Espoo", description: "Pilvistä, ajoittain lumikuuroja",
  },
  Tampere: {
    temperature: -5, feelsLike: -11, condition: "snowy", windSpeed: 14,
    humidity: 90, rainProbability: 70, afternoonRain: true,
    city: "Tampere", description: "Runsasta lumisadetta",
  },
  Turku: {
    temperature: 1, feelsLike: -3, condition: "rainy", windSpeed: 8,
    humidity: 88, rainProbability: 80, afternoonRain: true,
    city: "Turku", description: "Tihkusadetta, kosteaa",
  },
  Oulu: {
    temperature: -12, feelsLike: -20, condition: "snowy", windSpeed: 18,
    humidity: 78, rainProbability: 30, afternoonRain: false,
    city: "Oulu", description: "Kireä pakkanen, selkeää",
  },
  Rovaniemi: {
    temperature: -18, feelsLike: -26, condition: "snowy", windSpeed: 6,
    humidity: 75, rainProbability: 10, afternoonRain: false,
    city: "Rovaniemi", description: "Kova pakkanen, tyyntä",
  },
  Jyväskylä: {
    temperature: -6, feelsLike: -12, condition: "cloudy", windSpeed: 11,
    humidity: 82, rainProbability: 40, afternoonRain: false,
    city: "Jyväskylä", description: "Pilvistä, heikkoa lumisadetta",
  },
  Kuopio: {
    temperature: -8, feelsLike: -14, condition: "snowy", windSpeed: 9,
    humidity: 84, rainProbability: 55, afternoonRain: true,
    city: "Kuopio", description: "Lumisadetta iltapäivällä",
  },
  Lahti: {
    temperature: -4, feelsLike: -9, condition: "cloudy", windSpeed: 7,
    humidity: 79, rainProbability: 35, afternoonRain: false,
    city: "Lahti", description: "Puolipilvistä",
  },
  Vaasa: {
    temperature: -1, feelsLike: -6, condition: "windy", windSpeed: 20,
    humidity: 86, rainProbability: 50, afternoonRain: true,
    city: "Vaasa", description: "Tuulista, lumikuuroja",
  },
  Joensuu: {
    temperature: -10, feelsLike: -17, condition: "snowy", windSpeed: 5,
    humidity: 81, rainProbability: 25, afternoonRain: false,
    city: "Joensuu", description: "Pakkasta, selkeää",
  },
  Pori: {
    temperature: 2, feelsLike: -2, condition: "rainy", windSpeed: 15,
    humidity: 92, rainProbability: 85, afternoonRain: true,
    city: "Pori", description: "Vesisadetta, tuulista",
  },
};

export const FINNISH_CITIES = Object.keys(cityWeather);

export function getMockWeather(city?: string): WeatherData {
  const key = city && cityWeather[city] ? city : "Helsinki";
  return { ...cityWeather[key] };
}

export function searchCities(query: string): string[] {
  if (!query.trim()) return FINNISH_CITIES;
  const q = query.toLowerCase();
  return FINNISH_CITIES.filter((c) => c.toLowerCase().includes(q));
}

export function getSavedCity(): string {
  return localStorage.getItem("saavahti-city") || "Helsinki";
}

export function saveCity(city: string): void {
  localStorage.setItem("saavahti-city", city);
}

const coldSnowGear: Record<AgeGroup, ClothingItem[]> = {
  vauva: [
    { name: "Toppahaalari", emoji: "🧥", description: "Paksu talvihaalari" },
    { name: "Villakerrastot", emoji: "🧶", description: "Merinovillaiset aluskerrastot" },
    { name: "Villasukat", emoji: "🧦", description: "Paksut villasukat" },
    { name: "Talvitöppöset", emoji: "👟", description: "Lämpimät vauvan kengät" },
    { name: "Lapaset", emoji: "🧤", description: "Paksut tumput" },
    { name: "Pipo", emoji: "🎿", description: "Villapipo + kypärämyssy" },
  ],
  taapero: [
    { name: "Toppahousut", emoji: "👖", description: "Talvitoppahousut" },
    { name: "Toppatakki", emoji: "🧥", description: "Paksu talvitakki" },
    { name: "Villakerrastot", emoji: "🧶", description: "Aluskerrastot villan päälle" },
    { name: "Talvisaappaat", emoji: "🥾", description: "Lämpimät vedenpitävät saappaat" },
    { name: "Lapaset", emoji: "🧤", description: "Hanskat tai rukkaset" },
    { name: "Kauluri", emoji: "🧣", description: "Tuubihuivi tai kypärämyssy" },
    { name: "Pipo", emoji: "🎿", description: "Lämmin villapipo" },
  ],
  "leikki-ikäinen": [
    { name: "Toppahousut", emoji: "👖", description: "Talvihousut" },
    { name: "Toppatakki", emoji: "🧥", description: "Talvitakki" },
    { name: "Villakerrastot", emoji: "🧶", description: "Aluskerrastot" },
    { name: "Talvisaappaat", emoji: "🥾", description: "Lämpimät saappaat" },
    { name: "Hanskat", emoji: "🧤", description: "Sormikkaat tai lapaset" },
    { name: "Pipo", emoji: "🎿", description: "Lämpimä pipo" },
    { name: "Kauluri", emoji: "🧣", description: "Tuubihuivi" },
  ],
  koululainen: [
    { name: "Toppahousut", emoji: "👖", description: "Talvihousut" },
    { name: "Toppatakki", emoji: "🧥", description: "Talvitakki" },
    { name: "Välikerrastot", emoji: "👕", description: "Kerrostettavat alusvaatteet" },
    { name: "Talvikengät", emoji: "🥾", description: "Lämpimät kengät" },
    { name: "Hanskat", emoji: "🧤", description: "Sormikkaat tai lapaset" },
    { name: "Pipo", emoji: "🎿", description: "Pipo" },
    { name: "Kauluri", emoji: "🧣", description: "Kauluri, huivi tai kypärämyssy" },
  ],
};

const mildRainGear: Record<AgeGroup, ClothingItem[]> = {
  vauva: [
    { name: "Välikausihaalari", emoji: "🧥", description: "Kevyt haalari" },
    { name: "Sadehaalari", emoji: "🌧️", description: "Vedenpitävä haalari päälle" },
    { name: "Kumisaappaat", emoji: "🥾", description: "Pienet kumpparet" },
    { name: "Ohut pipo", emoji: "🧢", description: "Puuvillapipo" },
  ],
  taapero: [
    { name: "Kurahousut", emoji: "👖", description: "Vedenpitävät kuravaatteet" },
    { name: "Sadetakki", emoji: "🌧️", description: "Vedenpitävä takki" },
    { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat" },
    { name: "Välikerrasto", emoji: "👕", description: "Fleece tai villainen" },
    { name: "Ohut pipo", emoji: "🧢", description: "Ohut pipo tai lippalakki" },
  ],
  "leikki-ikäinen": [
    { name: "Kurahousut", emoji: "👖", description: "Sadehousut" },
    { name: "Sadetakki", emoji: "🌧️", description: "Vedenpitävä takki" },
    { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat" },
    { name: "Välikerrasto", emoji: "👕", description: "Fleece tai villainen" },
    { name: "Ohut pipo", emoji: "🧢", description: "Ohut pipo" },
  ],
  koululainen: [
    { name: "Kurahousut", emoji: "👖", description: "Sadehousut" },
    { name: "Sadetakki", emoji: "🌧️", description: "Vedenpitävä takki" },
    { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat" },
    { name: "Huppari", emoji: "👕", description: "Fleece tai huppari" },
  ],
};

const warmGear: Record<AgeGroup, ClothingItem[]> = {
  vauva: [
    { name: "Body", emoji: "👶", description: "Ohut puuvillabody" },
    { name: "Aurinkohattu", emoji: "👒", description: "Leveälierinen hattu" },
    { name: "Ohut haalari", emoji: "👕", description: "Kevyt ulkohaalari" },
  ],
  taapero: [
    { name: "T-paita", emoji: "👕", description: "Kevyt paita" },
    { name: "Shortsit", emoji: "🩳", description: "Kevyet shortsit" },
    { name: "Sandaalit", emoji: "👡", description: "Avoimet kengät" },
    { name: "Aurinkohattu", emoji: "👒", description: "Lippalakki tai hattu" },
  ],
  koululainen: [
    { name: "T-paita", emoji: "👕", description: "T-paita" },
    { name: "Shortsit", emoji: "🩳", description: "Shortsit" },
    { name: "Lenkkarit", emoji: "👟", description: "Kevyet kengät" },
    { name: "Lippalakki", emoji: "🧢", description: "Aurinkosuoja" },
  ],
};

export function getClothingRecommendation(weather: WeatherData, ageGroup: AgeGroup): ClothingItem[] {
  const base: ClothingItem[] = [];
  const temp = weather.temperature;

  // Temperature-based logic
  if (temp < -10) {
    base.push({
      name: "Kerrospukeutuminen",
      emoji: "🧅",
      description: "Merinovilla, välikerros ja paksu toppapuku",
    });
    base.push(...coldSnowGear[ageGroup]);
  } else if (temp >= 0 && temp <= -0.001) {
    // exactly 0 handled below
    base.push(...coldSnowGear[ageGroup]);
  } else if (temp <= 0) {
    base.push({
      name: "Toppapuku ja villasukat",
      emoji: "🧥",
      description: "Lämpö: 0 … –10 °C — paksu toppapuku ja villasukat",
    });
    base.push(...coldSnowGear[ageGroup].filter(
      (i) => !["Toppahaalari", "Toppahousut", "Toppatakki", "Villasukat"].includes(i.name)
    ));
  } else if (temp >= 5 && temp <= 10) {
    base.push({
      name: "Välikausivaatteet",
      emoji: "🍂",
      description: "+5 … +10 °C — kevyt takki ja kerroksia",
    });
    base.push(...mildRainGear[ageGroup]);
  } else if (temp < 5) {
    base.push(...coldSnowGear[ageGroup]);
  } else if (temp <= 12) {
    base.push(...mildRainGear[ageGroup]);
  } else {
    base.push(...warmGear[ageGroup]);
  }

  // Rain probability add-on
  if (weather.rainProbability > 40) {
    const hasKura = base.some((i) => i.name.includes("Kurahousut"));
    if (!hasKura) {
      base.unshift({
        name: "Kurahousut ja kurahanskat",
        emoji: "🌧️",
        description: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!",
      });
    }
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return base.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

export function getMorningSummary(weather: WeatherData): string | null {
  if (weather.afternoonRain) {
    return "Tänään klo 14 sataa, muista kurahousut päiväkotiin!";
  }
  return null;
}

export function getWeatherIcon(condition: WeatherCondition): string {
  const icons: Record<WeatherCondition, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    snowy: "❄️",
    windy: "💨",
  };
  return icons[condition];
}

export function getTemperatureColor(temp: number): string {
  if (temp <= -10) return "text-blue-600";
  if (temp <= 0) return "text-secondary";
  if (temp <= 15) return "text-primary";
  return "text-orange-500";
}
