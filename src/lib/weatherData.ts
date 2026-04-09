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
  uvi?: number;
}

export type AgeGroup = "vauva" | "taapero" | "leikki-ikäinen" | "koululainen";

export interface ClothingItem {
  name: string;
  emoji: string;
  description: string;
}

import { cityWeather } from "./cityWeatherData";

export const FINNISH_CITIES = Object.keys(cityWeather).sort((a, b) => a.localeCompare(b, "fi"));

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
    { name: "Kauluri", emoji: "🧣", description: "Tuubihuivi tai kypärämyssy" },
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
    { name: "Välikausihousut", emoji: "👖", description: "Joustavat välikausihousut" },
    { name: "Kuoritakki", emoji: "🧥", description: "Tuulenpitävä kuoritakki" },
    { name: "Välikausikengät", emoji: "🥾", description: "Vettähylkivät välikausikengät" },
    { name: "Välikerrasto", emoji: "👕", description: "Fleece tai villainen" },
    { name: "Ohut pipo", emoji: "🧢", description: "Ohut pipo" },
  ],
  "leikki-ikäinen": [
    { name: "Välikausihousut", emoji: "👖", description: "Joustavat välikausihousut" },
    { name: "Kuoritakki", emoji: "🧥", description: "Tuulenpitävä kuoritakki" },
    { name: "Välikausikengät", emoji: "🥾", description: "Vettähylkivät välikausikengät" },
    { name: "Välikerrasto", emoji: "👕", description: "Fleece tai villainen" },
    { name: "Ohut pipo", emoji: "🧢", description: "Ohut pipo" },
  ],
  koululainen: [
    { name: "Välikausihousut", emoji: "👖", description: "Joustavat välikausihousut" },
    { name: "Vedenpitävä kuoritakki", emoji: "🧥", description: "Vedenpitävä kuoritakki" },
    { name: "Vettä hylkivät kengät", emoji: "👟", description: "Vettä hylkivät kengät" },
    { name: "Huppari", emoji: "👕", description: "Fleece tai huppari" },
    { name: "Ohut pipo", emoji: "🧢", description: "Ohut pipo" },
  ],
};

/** +15…+18 °C — lämmin kevät / alkukesä */
const warmSpringGear: Record<AgeGroup, ClothingItem[]> = {
  vauva: [
    { name: "Puuvillabody", emoji: "👶", description: "Ohut, pitkähihainen puuvillabody" },
    { name: "Puuvillahousut", emoji: "👖", description: "Ohuet puuvillahousut" },
    { name: "Aurinkohattu", emoji: "👒", description: "Leveälierinen hattu tai aurinkohattu" },
    { name: "Ohuet sukat", emoji: "🧦", description: "Ohuet sukat" },
    { name: "Pehmeät tossut", emoji: "👟", description: "Pehmeät tossut tai kevyet kengät" },
  ],
  taapero: [
    { name: "Pitkähihainen paita", emoji: "👕", description: "Pitkähihainen ohut paita tai t-paita" },
    { name: "Neuletakki", emoji: "🧥", description: "Ohut neuletakki tai huppari" },
    { name: "Ohuet housut", emoji: "👖", description: "Ohuet housut tai leggingsit" },
    { name: "Ohut pipo", emoji: "🎿", description: "Ohut pipo tai lippis" },
    { name: "Sukat", emoji: "🧦", description: "Sukat" },
  ],
  "leikki-ikäinen": [
    { name: "T-paita", emoji: "👕", description: "T-paita" },
    { name: "Pitkähihainen paita", emoji: "👕", description: "Ohut pitkähihainen paita tai huppari" },
    { name: "Kevyet housut", emoji: "👖", description: "Kevyet housut" },
    { name: "Lippalakki", emoji: "🧢", description: "Lippis tai ohut panta" },
  ],
  koululainen: [
    { name: "T-paita", emoji: "👕", description: "T-paita" },
    { name: "Huppari", emoji: "👕", description: "Huppari tai kevyt takki" },
    { name: "Farkut", emoji: "👖", description: "Farkut tai collegehousut" },
  ],
};

/** Yli +18 °C — kesä */
const warmGear: Record<AgeGroup, ClothingItem[]> = {
  vauva: [
    { name: "Puuvillabody", emoji: "👶", description: "Ohut, pitkähihainen puuvillabody" },
    { name: "Puuvillahousut", emoji: "👖", description: "Ohuet puuvillahousut" },
    { name: "Aurinkohattu", emoji: "👒", description: "Leveälierinen hattu tai kypärämyssy" },
    { name: "Ohuet sukat", emoji: "🧦", description: "Ohuet sukat" },
  ],
  taapero: [
    { name: "T-paita", emoji: "👕", description: "Kevyt paita" },
    { name: "Shortsit", emoji: "🩳", description: "Kevyet shortsit" },
    { name: "Kevyet kengät", emoji: "👟", description: "Kevyet kengät" },
    { name: "Aurinkohattu", emoji: "👒", description: "Lippalakki tai hattu" },
  ],
  "leikki-ikäinen": [
    { name: "T-paita", emoji: "👕", description: "T-paita" },
    { name: "Shortsit", emoji: "🩳", description: "Shortsit tai hame" },
    { name: "Kevyet kengät", emoji: "👟", description: "Kevyet kengät" },
    { name: "Lippalakki", emoji: "🧢", description: "Aurinkosuoja" },
  ],
  koululainen: [
    { name: "T-paita", emoji: "👕", description: "T-paita" },
    { name: "Shortsit", emoji: "🩳", description: "Shortsit tai hame" },
    { name: "Lenkkarit", emoji: "👟", description: "Kevyet kengät" },
    { name: "Lippalakki", emoji: "🧢", description: "Aurinkosuoja" },
  ],
};

export function isSpringMonth(): boolean {
  const month = new Date().getMonth(); // 0-indexed: 2=March, 3=April
  return month === 2 || month === 3;
}

export function getClothingRecommendation(weather: WeatherData, ageGroup: AgeGroup): ClothingItem[] {
  const base: ClothingItem[] = [];
  const actualTemp = weather.temperature; // Actual measured temperature
  const spring = isSpringMonth();

  // Spring Rule: use ACTUAL temperature to decide mid-season vs winter gear
  // For non-spring logic: use feelsLike (wind chill) for threshold decisions
  const temp = spring ? actualTemp : (weather.feelsLike ?? actualTemp);

  if (temp < -10) {
    base.push({
      name: "Kerrospukeutuminen",
      emoji: "🧅",
      description: "Merinovilla, välikerros ja paksu toppapuku",
    });
    base.push(...coldSnowGear[ageGroup]);
  } else if (spring && temp >= -2 && temp <= 15) {
    // Spring Rule (March-April): temp >= -2°C → mid-season gear
    if (ageGroup === "koululainen") {
      base.push({
        name: "Tekniset kuorivaatteet",
        emoji: "🧥",
        description: "Kevätkausi — tekniset kuorivaatteet ja lämmin välikerros",
      });
    } else {
      base.push({
        name: "Välikausivaatteet",
        emoji: "🍂",
        description: "Kevätkausi — kuoritakki ja lämmin välikerros alle",
      });
    }
    base.push(...mildRainGear[ageGroup]);
    // Layering tip for spring
    base.push({
      name: "Lämmin välikerros",
      emoji: "🧶",
      description: "Lisää villa- tai fleecekerros kuoriasun alle",
    });
    if (ageGroup === "vauva" || ageGroup === "taapero") {
      base.push({
        name: "Rattaissa lisäkerros",
        emoji: "🧸",
        description: "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle",
      });
    }
  } else if (temp <= 0) {
    base.push({
      name: "Toppapuku ja villasukat",
      emoji: "🧥",
      description: "Lämpö: 0 … –1 °C — paksu toppapuku ja villasukat",
    });
    base.push(...coldSnowGear[ageGroup].filter(
      (i) => !["Toppahaalari", "Toppahousut", "Toppatakki", "Villasukat"].includes(i.name)
    ));
  } else if (temp < 1) {
    base.push(...coldSnowGear[ageGroup]);
  } else if (temp <= 15) {
    // +1…+15 °C — välikausi
    if (ageGroup === "koululainen") {
      base.push({
        name: "Tekniset kuorivaatteet",
        emoji: "🧥",
        description: "+1 … +15 °C — tekniset kuorivaatteet ja kerroksia",
      });
    } else {
      base.push({
        name: "Välikausivaatteet",
        emoji: "🍂",
        description: "+1 … +15 °C — kuoritakki ja kerroksia",
      });
    }
    base.push(...mildRainGear[ageGroup]);
    // Paikoillaan oleva pieni lapsi — lisäkerros
    if (ageGroup === "vauva" || ageGroup === "taapero") {
      base.push({
        name: "Rattaissa lisäkerros",
        emoji: "🧸",
        description: "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle",
      });
    }
    // Tuulilisä
    if (weather.windSpeed > 5) {
      base.push({ name: "Tuubihuivi", emoji: "🧣", description: "Tuuli yli 5 m/s — tuubihuivi suojaa" });
    }
  } else if (temp <= 18) {
    // +15…+18 °C — lämmin kevät / alkukesä
    base.push(...warmSpringGear[ageGroup]);
    if (ageGroup === "vauva") {
      base.push({ name: "Huomio", emoji: "☀️", description: "Suojaa vauva suoralta auringolta ja tuulelta" });
    }
  } else {
    // Yli +18 °C — kesä
    base.push(...warmGear[ageGroup]);
    if (weather.uvi !== undefined && weather.uvi >= 3) {
      base.push({ name: "Aurinkorasva", emoji: "🧴", description: "Suojaa iho UV-säteilyltä" });
    }
  }

  // Sadevarusteet (rainProbability > 40 %)
  if (weather.rainProbability > 40) {
    // Lämpötilan mukaan: alle +10°C -> + villasukat kumisaappaisiin
    const kumisaappaatWithSocks = (temp: number): ClothingItem => {
      if (temp < 10) {
        return {
          name: "Kumisaappaat + villasukat",
          emoji: "🥾🧦",
          description: "Kumisaappaat ja villasukat suojaavat kylmältä",
        };
      }
      return {
        name: "Kumisaappaat",
        emoji: "🥾",
        description: "Kumisaappaat ohuilla sukilla",
      };
    };

    // --- Lämmin sade (≥ +15 °C): korvaa perusvarusteet kokonaan ---
    if (temp >= 15) {
      if (ageGroup === "vauva") {
        base.length = 0;
        base.push(
          { name: "Ohut kuorihaalari", emoji: "🧥", description: "Ohut tekninen kuorihaalari sateen varalle" },
          { name: "Puuvillahousut", emoji: "👖", description: "Ohuet puuvillahousut" },
          { name: "Kypärämyssy", emoji: "🧢", description: "Ohut puuvillainen kypärämyssy" },
          { name: "Huomio", emoji: "🌧️", description: "Muista vaunujen sadesuoja!" },
        );
      } else if (ageGroup === "taapero" || ageGroup === "leikki-ikäinen") {
        base.length = 0;
        base.push(
          { name: "Sadeasu", emoji: "🌧️", description: "Sadeasu tai tekniset kuorivaatteet" },
          { name: "Pitkähihainen paita", emoji: "👕", description: "Pitkähihainen paita alle" },
          { name: "Ohuet housut", emoji: "👖", description: "Ohuet housut tai leggingsit" },
          { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat ohuilla sukilla" },
          { name: "Kurahanskat", emoji: "🧤", description: "Kevyet kurahanskat" },
          { name: "Sadehattu", emoji: "🧢", description: "Lippis tai sadehattu" },
        );
      } else if (ageGroup === "koululainen") {
        base.length = 0;
        base.push(
          { name: "Vedenpitävä kuoritakki", emoji: "🧥", description: "Vedenpitävä kuoritakki tai sadetakki" },
          { name: "Tekniset ulkoiluhousut", emoji: "👖", description: "Farkut tai tekniset ulkoiluhousut" },
          { name: "Vedenpitävät kengät", emoji: "👟", description: "Vedenpitävät kengät tai tennarit" },
          { name: "Huomio", emoji: "🌧️", description: "Pakkaa sateenvarjo tai sadeviitta reppuun" },
        );
      } else {
        // leikki-ikäinen fallback (shouldn't reach here)
        base.length = 0;
        base.push(
          { name: "Sadeasu", emoji: "🌧️", description: "Sadeasu tai tekniset kuorivaatteet" },
          { name: "Pitkähihainen paita", emoji: "👕", description: "Pitkähihainen paita alle" },
          { name: "Ohuet housut", emoji: "👖", description: "Ohuet housut tai leggingsit" },
          { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat ohuilla sukilla" },
          { name: "Kurahanskat", emoji: "🧤", description: "Kevyet kurahanskat" },
          { name: "Sadehattu", emoji: "🧢", description: "Lippis tai sadehattu" },
        );
      }
    } else if (ageGroup === "koululainen") {
      // Koululaisille (7–10 v): kuorivaatteet (kylmä sade)
      base.unshift(
        { name: "Vedenpitävä kuoritakki", emoji: "🧥", description: "Vedenpitävä kuoritakki sateelta suojaan" },
        { name: "Vedenpitävät ulkoiluhousut", emoji: "👖", description: "Vedenpitävät ulkoiluhousut sadesäälle" },
        { name: "Vettä hylkivät kengät", emoji: "👟", description: "Vettä hylkivät kengät pitävät jalat kuivina" },
      );
    } else if (ageGroup === "taapero" || ageGroup === "leikki-ikäinen") {
      // Taapero & leikki-ikäinen: sadehaalari / kuravarusteet (kylmä sade)
      const kumpparit = kumisaappaatWithSocks(temp);
      if (temp < 5) {
        base.unshift(
          { name: "Vuorellinen sadehaalari", emoji: "🌧️", description: "Vuorellinen sadehaalari tai kuravarusteet välikausipuvun päällä" },
          { name: "Kurahanskat", emoji: "🧤", description: "Vedenpitävät kurahanskat" },
          { name: kumpparit.name, emoji: kumpparit.emoji, description: kumpparit.description },
        );
      } else {
        base.unshift(
          { name: "Sadehaalari tai kurahousut & sadetakki", emoji: "🌧️", description: "Kestää päiväkodin hiekkalaatikkoleikkejä" },
          { name: "Kurahanskat", emoji: "🧤", description: "Vedenpitävät kurahanskat" },
          { name: kumpparit.name, emoji: kumpparit.emoji, description: kumpparit.description },
        );
      }
    } else {
      // Vauva: yksinkertaiset kuravarusteet (kylmä sade)
      const kumpparit = kumisaappaatWithSocks(temp);
      if (temp > 10) {
        base.unshift(
          { name: "Vuorettomat kurahousut", emoji: "🌧️", description: "Kevyet sadehousut ilman vuorta" },
          { name: kumpparit.name, emoji: kumpparit.emoji, description: kumpparit.description },
        );
      } else {
        const hasKura = base.some((i) => i.name.includes("Kurahousut"));
        if (!hasKura) {
          base.unshift(
            {
              name: "Kurahousut ja kurahanskat",
              emoji: "🌧️",
              description: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!",
            },
            {
              name: kumpparit.name,
              emoji: kumpparit.emoji,
              description: kumpparit.description,
            },
          );
        }
      }
    }
  }

  // UV-index add-on
  if (weather.uvi !== undefined && weather.uvi >= 3) {
    const hasHat = base.some((i) => i.name.includes("Lippalakki") || i.name.includes("Aurinkohattu") || i.name.includes("hattu"));
    if (!hasHat) {
      base.push({ name: "Lippis/Hattu", emoji: "🧢", description: "Korkea UV — suojaa pää auringolta" });
    }
    if (!base.some((i) => i.name === "Aurinkolasit")) {
      base.push({ name: "Aurinkolasit", emoji: "🕶️", description: "UV-suoja silmille" });
    }
  }

  // Dynaaminen pipo/lippis-logiikka lämpötilan mukaan
  for (let i = 0; i < base.length; i++) {
    const item = base[i];
    const isPipo = item.name === "Pipo" || item.name === "Ohut pipo" || item.name === "Lippis/Hattu";
    const isLippalakki = item.name === "Lippalakki";
    if (!isPipo && !isLippalakki) continue;

    if (temp > 12 && weather.condition === "sunny") {
      // Yli +12°C + aurinkoinen → lippis
      base[i] = { name: "Lippalakki", emoji: "🧢", description: "Aurinkoinen sää — lippis suojaa" };
    } else if (temp <= -5) {
      // Kireä pakkanen → paksu pipo
      base[i] = { name: "Pipo", emoji: "🎿", description: "Paksu pipo kovaan pakkaseen" };
    } else if (temp <= 12) {
      // Välikausi 0…+12°C tai lievä pakkanen → ohut pipo
      base[i] = { name: "Pipo", emoji: "🎿", description: "Ohut pipo viileään säähän" };
    }
  }

  // Vauva: lisää kauluri/tuubihuivi automaattisesti kun pipo on asussa ja on kylmää/tuulista
  const hasPipo = base.some((i) => i.name === "Pipo");
  if (hasPipo && ageGroup === "vauva") {
    const hasKauluri = base.some((i) => i.name === "Kauluri");
    if (!hasKauluri && (temp <= 0 || weather.windSpeed > 5)) {
      base.push({ name: "Kauluri", emoji: "🧣", description: "Tuubihuivi tai kypärämyssy" });
    }
  }
  if (hasPipo) {
    const hasGloves = base.some((i) =>
      i.name === "Hanskat" || i.name === "Lapaset" || i.name === "Rukkaset" ||
      i.name === "Sormikkaat" || i.name === "Lapaset/Rukkaset"
    );
    if (!hasGloves) {
      if (temp <= -10) {
        base.push({ name: "Lapaset", emoji: "🧤", description: "Kova pakkanen — paksut lapaset tai rukkaset" });
      } else {
        base.push({ name: "Hanskat", emoji: "🧤", description: "Viileä sää — hanskat mukaan" });
      }
    } else if (temp <= -10) {
      // Vaihda olemassa olevat hanskat lapasiksi kovalla pakkasella
      for (let i = 0; i < base.length; i++) {
        if (base[i].name === "Hanskat" || base[i].name === "Sormikkaat") {
          base[i] = { name: "Lapaset", emoji: "🧤", description: "Kova pakkanen — paksut lapaset tai rukkaset" };
        }
      }
    }
  }

  // Sort: 1) outer/base layer  2) warm mid-layer  3) beanie & gloves  4) rest  5) shoes (always last)
  const OUTER_NAMES = new Set([
    "Kerrospukeutuminen", "Toppahaalari", "Toppahousut", "Toppatakki",
    "Toppapuku ja villasukat", "Tekniset kuorivaatteet", "Välikausivaatteet",
    "Välikausihaalari", "Välikausihousut", "Kuoritakki",
    "Vedenpitävä kuoritakki", "Vedenpitävät ulkoiluhousut",
    "Vuorellinen sadehaalari", "Sadehaalari tai kurahousut & sadetakki",
    "Ohuet kuravarusteet", "Kurahousut ja kurahanskat", "Vuorettomat kurahousut",
    "Body", "Ohut haalari", "T-paita", "Collegehousut", "Farkut", "Shortsit",
    "Puuvillabody", "Puuvillahousut", "Ohuet housut", "Kevyet housut",
    "Ohut kuorihaalari", "Sadeasu", "Tekniset ulkoiluhousut",
  ]);
  const MID_NAMES = new Set([
    "Lämmin välikerros", "Villakerrastot", "Välikerrastot", "Välikerrasto",
    "Huppari", "Pitkähihainen paita", "Neuletakki",
  ]);
  const HEAD_GLOVE_NAMES = new Set([
    "Pipo", "Ohut pipo", "Lippalakki", "Lippis/Hattu", "Aurinkohattu",
    "Kauluri", "Kypärämyssy", "Sadehattu",
    "Hanskat", "Lapaset", "Rukkaset", "Sormikkaat", "Lapaset/Rukkaset",
    "Ohuet sukat", "Sukat",
  ]);
  const SHOE_NAMES = new Set([
    "Kevyet kengät", "Lenkkarit", "Kumisaappaat", "Kumisaappaat + villasukat",
    "Talvisaappaat", "Talvikengät", "Välikausikengät", "Talvitöppöset",
    "Vedenpitävät kengät", "Vettä hylkivät kengät",
  ]);

  function sortPriority(item: ClothingItem): number {
    if (SHOE_NAMES.has(item.name)) return 4;
    if (OUTER_NAMES.has(item.name)) return 0;
    if (MID_NAMES.has(item.name)) return 1;
    if (HEAD_GLOVE_NAMES.has(item.name)) return 2;
    return 3;
  }

  base.sort((a, b) => sortPriority(a) - sortPriority(b));

  // Deduplicate by name
  const seen = new Set<string>();
  const deduped = base.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  // Ensure at least one pair of shoes is always present at the end
  const hasShoes = deduped.some((i) => SHOE_NAMES.has(i.name));
  if (!hasShoes) {
    if (weather.rainProbability > 40) {
      if (ageGroup === "koululainen") {
        deduped.push({ name: "Vedenpitävät kengät", emoji: "👟", description: "Vedenpitävät kengät pitävät jalat kuivina" });
      } else {
        deduped.push(temp < 10
          ? { name: "Kumisaappaat + villasukat", emoji: "🥾🧦", description: "Kumisaappaat ja villasukat suojaavat kylmältä" }
          : { name: "Kumisaappaat", emoji: "🥾", description: "Kumisaappaat ohuilla sukilla" }
        );
      }
    } else if (temp > 15) {
      deduped.push({ name: "Kevyet kengät", emoji: "👟", description: "Kevyet kengät" });
    } else if (temp >= 5) {
      deduped.push({ name: "Välikausikengät", emoji: "🥾", description: "Vettähylkivät välikausikengät" });
    } else if (temp >= -5) {
      deduped.push({ name: "Talvikengät", emoji: "🥾", description: "Lämpimät kengät" });
    } else {
      deduped.push({ name: "Talvisaappaat", emoji: "🥾", description: "Lämpimät vedenpitävät saappaat" });
    }
  }

  return deduped;
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
