/**
 * Pukuri – Älykäs apu aamun varustevalintoihin
 * React Native Single File Component (App.js)
 * 
 * Kielet: FI, SV, EN, ET, AR
 * Komponentit: react-native + lucide-react-native
 */

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, Share, Platform, I18nManager, Linking,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
  MapPin, Search, RefreshCw, Wind, Droplets, CloudRain, AlertTriangle,
  Thermometer, Sun, ChevronDown, ChevronUp, Share2, Moon, Sunrise,
  CheckCircle2, Loader2, Sparkles,
} from 'lucide-react-native';

// ========== CONSTANTS ==========
const API_KEY = '247aa2ee8cccf0e1e53ea7ab0aeb4e7d';
const BASE = 'https://api.openweathermap.org/data/2.5';
const CACHE_TTL = 20 * 60 * 1000;
const COLORS = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  primary: '#16a34a',
  primaryFg: '#ffffff',
  muted: '#94a3b8',
  foreground: '#1e293b',
  destructive: '#ef4444',
  accent: '#f0fdf4',
  night: '#1e293b',
  nightFg: '#e2e8f0',
  nightMuted: '#94a3b8',
};

// ========== i18n ==========
const translations = {
  'header.title': { fi: 'Pukuri', sv: 'Pukuri', en: 'Pukuri', et: 'Pukuri', ar: 'Pukuri' },
  'header.subtitle': { fi: 'Älykäs apu aamun varustevalintoihin', sv: 'Intelligent hjälp för morgonens utrustningsval', en: 'Smart assistance for morning gear choices', et: 'Nutikas abi hommikusteks varustuse valikuteks', ar: 'مساعدة ذكية لاختيار معدات الصباح' },
  'location.weatherNow': { fi: 'Sää nyt', sv: 'Väder nu', en: 'Weather now', et: 'Ilm praegu', ar: 'الطقس الآن' },
  'location.useCurrentLocation': { fi: 'Käytä sijaintia', sv: 'Använd plats', en: 'Use location', et: 'Kasuta asukohta', ar: 'استخدم الموقع' },
  'location.searchPlaceholder': { fi: 'Etsi paikkakuntaa...', sv: 'Sök ort...', en: 'Search city...', et: 'Otsi linna...', ar: 'ابحث عن مدينة...' },
  'location.updating': { fi: 'Päivitetään...', sv: 'Uppdaterar...', en: 'Updating...', et: 'Uuendamine...', ar: 'جارٍ التحديث...' },
  'location.notFound': { fi: 'Säätietoja ei löytynyt.', sv: 'Väderdata hittades inte.', en: 'Weather data not found.', et: 'Ilmaandmeid ei leitud.', ar: 'لم يتم العثور على بيانات الطقس.' },
  'location.geoError': { fi: 'Paikannus epäonnistui.', sv: 'Positionering misslyckades.', en: 'Geolocation failed.', et: 'Asukoha tuvastamine ebaõnnestus.', ar: 'فشل تحديد الموقع.' },
  'weather.feelsLike': { fi: 'Tuntuu kuin', sv: 'Känns som', en: 'Feels like', et: 'Tundub nagu', ar: 'يبدو كأنه' },
  'weather.justUpdated': { fi: 'Juuri päivitetty', sv: 'Nyss uppdaterad', en: 'Just updated', et: 'Just uuendatud', ar: 'تم التحديث للتو' },
  'weather.updatedAgo': { fi: 'Päivitetty {min} min sitten', sv: 'Uppdaterad {min} min sedan', en: 'Updated {min} min ago', et: 'Uuendatud {min} min tagasi', ar: 'تم التحديث قبل {min} دقيقة' },
  'weather.refreshNow': { fi: 'Päivitä', sv: 'Uppdatera', en: 'Refresh', et: 'Uuenda', ar: 'حدّث' },
  'weather.rain': { fi: 'Sade', sv: 'Regn', en: 'Rain', et: 'Vihm', ar: 'مطر' },
  'weather.today': { fi: 'Tänään', sv: 'Idag', en: 'Today', et: 'Täna', ar: 'اليوم' },
  'weekday.0': { fi: 'Su', sv: 'Sön', en: 'Sun', et: 'P', ar: 'أحد' },
  'weekday.1': { fi: 'Ma', sv: 'Mån', en: 'Mon', et: 'E', ar: 'إثن' },
  'weekday.2': { fi: 'Ti', sv: 'Tis', en: 'Tue', et: 'T', ar: 'ثلا' },
  'weekday.3': { fi: 'Ke', sv: 'Ons', en: 'Wed', et: 'K', ar: 'أرب' },
  'weekday.4': { fi: 'To', sv: 'Tor', en: 'Thu', et: 'N', ar: 'خمي' },
  'weekday.5': { fi: 'Pe', sv: 'Fre', en: 'Fri', et: 'R', ar: 'جمع' },
  'weekday.6': { fi: 'La', sv: 'Lör', en: 'Sat', et: 'L', ar: 'سبت' },
  'morning.title': { fi: '☀️ Vinkki aamuun', sv: '☀️ Morgontips', en: '☀️ Morning tip', et: '☀️ Hommikune nõuanne', ar: '☀️ نصيحة الصباح' },
  'morning.loading': { fi: 'Haetaan suosituksia...', sv: 'Hämtar rekommendationer...', en: 'Fetching recommendations...', et: 'Soovituste laadimine...', ar: 'جارٍ جلب التوصيات...' },
  'morning.rainStart': { fi: 'Sade alkaa klo {time}. Muista kuravarusteet!', sv: 'Regn börjar kl {time}. Kom ihåg regnkläder!', en: 'Rain starts at {time}. Remember rain gear!', et: 'Vihm algab kell {time}. Ära unusta vihmariideid!', ar: 'المطر يبدأ الساعة {time}. لا تنسَ ملابس المطر!' },
  'morning.freezing': { fi: 'Tie on liukas, valitse lämpimät kengät.', sv: 'Vägen är hal, välj varma skor.', en: 'Roads are slippery, choose warm shoes.', et: 'Tee on libe, vali soojad jalatsid.', ar: 'الطرق زلقة، اختر أحذية دافئة.' },
  'morning.uvHigh': { fi: 'UV-indeksi yli 3. Muista aurinkorasva!', sv: 'UV-index över 3. Kom ihåg solskyddskräm!', en: 'UV index above 3. Remember sunscreen!', et: 'UV-indeks üle 3. Ära unusta päikesekaitsekreemi!', ar: 'مؤشر UV فوق 3. تذكر واقي الشمس!' },
  'morning.windChill': { fi: 'Kova tuuli ({speed} m/s), suosi tuulenpitävää.', sv: 'Stark vind ({speed} m/s), välj vindtäta kläder.', en: 'Strong wind ({speed} m/s), choose windproof.', et: 'Tugev tuul ({speed} m/s), eelista tuulekindlaid.', ar: 'رياح قوية ({speed} م/ث)، اختر ملابس مقاومة للرياح.' },
  'morning.calmDay': { fi: 'Sää on vakaa, nauti päivästä! 🌤️', sv: 'Vädret är stabilt, njut av dagen! 🌤️', en: 'Weather is stable, enjoy the day! 🌤️', et: 'Ilm on stabiilne, naudi päeva! 🌤️', ar: 'الطقس مستقر، استمتع باليوم! 🌤️' },
  'night.title': { fi: '🌙 Ilta-muistutus', sv: '🌙 Kvällspåminnelse', en: '🌙 Evening reminder', et: '🌙 Õhtune meeldetuletus', ar: '🌙 تذكير المساء' },
  'night.tomorrowColder': { fi: 'Huomenna kylmempi ({today}° → {tomorrow}°).', sv: 'Kallare i morgon ({today}° → {tomorrow}°).', en: 'Colder tomorrow ({today}° → {tomorrow}°).', et: 'Homme külmem ({today}° → {tomorrow}°).', ar: 'أبرد غداً ({today}° → {tomorrow}°).' },
  'night.tomorrowWarmer': { fi: 'Huomenna lämpimämpi ({today}° → {tomorrow}°).', sv: 'Varmare i morgon ({today}° → {tomorrow}°).', en: 'Warmer tomorrow ({today}° → {tomorrow}°).', et: 'Homme soojem ({today}° → {tomorrow}°).', ar: 'أدفأ غداً ({today}° → {tomorrow}°).' },
  'night.tomorrowRain': { fi: 'Huomenna tarvitaan kuravarusteita.', sv: 'I morgon behövs regnutrustning.', en: 'Rain gear needed tomorrow.', et: 'Homme on vaja vihmariideid.', ar: 'ملابس المطر مطلوبة غداً.' },
  'night.dryGear': { fi: 'Muista kuivata märät varusteet! 👟', sv: 'Kom ihåg att torka blöta kläder! 👟', en: 'Remember to dry wet gear! 👟', et: 'Ära unusta märgi riideid kuivama! 👟', ar: 'تذكر تجفيف الملابس المبللة! 👟' },
  'age.title': { fi: 'Lapsen ikäryhmä', sv: 'Barnets åldersgrupp', en: "Child's age group", et: 'Lapse vanuserühm', ar: 'الفئة العمرية للطفل' },
  'age.vauva': { fi: 'Vauva', sv: 'Baby', en: 'Baby', et: 'Beebi', ar: 'رضيع' },
  'age.taapero': { fi: 'Taapero', sv: 'Småbarn', en: 'Toddler', et: 'Väikelaps', ar: 'طفل صغير' },
  'age.leikki-ikäinen': { fi: 'Leikki-ikäinen', sv: 'Förskoleålder', en: 'Preschooler', et: 'Eelkooliealine', ar: 'ما قبل المدرسة' },
  'age.koululainen': { fi: 'Koululainen', sv: 'Skolbarn', en: 'School age', et: 'Koolilaps', ar: 'سن المدرسة' },
  'age.vauva.ages': { fi: '0–1 v', sv: '0–1 år', en: '0–1 yr', et: '0–1 a', ar: '0–1 سنة' },
  'age.taapero.ages': { fi: '1–3 v', sv: '1–3 år', en: '1–3 yr', et: '1–3 a', ar: '1–3 سنة' },
  'age.leikki-ikäinen.ages': { fi: '3–6 v', sv: '3–6 år', en: '3–6 yr', et: '3–6 a', ar: '3–6 سنة' },
  'age.koululainen.ages': { fi: '7–10 v', sv: '7–10 år', en: '7–10 yr', et: '7–10 a', ar: '7–10 سنة' },
  'clothing.title': { fi: '🧥 Pukeutumissuositus', sv: '🧥 Klädrekommendation', en: '🧥 Clothing recommendation', et: '🧥 Riietussoovitus', ar: '🧥 توصية الملابس' },
  'tomorrow.title': { fi: 'Huomisen sää', sv: 'Morgondagens väder', en: "Tomorrow's weather", et: 'Homse ilm', ar: 'طقس الغد' },
  'tomorrow.rainProb': { fi: 'Sateen todennäköisyys', sv: 'Regnchans', en: 'Rain probability', et: 'Vihma tõenäosus', ar: 'احتمال المطر' },
  'tomorrow.prepTitle': { fi: 'Valmistele huomiseksi:', sv: 'Förbered till i morgon:', en: 'Prepare for tomorrow:', et: 'Valmista homme jaoks:', ar: 'استعد للغد:' },
  'dual.morning': { fi: 'Aamun varustus', sv: 'Morgonens utrustning', en: 'Morning outfit', et: 'Hommikune varustus', ar: 'ملابس الصباح' },
  'dual.afternoon': { fi: 'Iltapäivän varustus', sv: 'Eftermiddagens utrustning', en: 'Afternoon outfit', et: 'Pärastlõunane varustus', ar: 'ملابس بعد الظهر' },
  'dual.windWarning': { fi: 'Kova tuuli ({speed} m/s) — tuulenpitävä kuorikerros.', sv: 'Stark vind ({speed} m/s) — vindtätt skalplagg.', en: 'Strong wind ({speed} m/s) — windproof shell.', et: 'Tugev tuul ({speed} m/s) — tuulekindel kiht.', ar: 'رياح قوية ({speed} م/ث) — طبقة مقاومة للرياح.' },
  'dual.mudWarning': { fi: 'Maa on vielä märkä.', sv: 'Marken är fortfarande blöt.', en: 'Ground is still wet.', et: 'Maapind on veel märg.', ar: 'الأرض لا تزال مبللة.' },
  'dual.gapInfo': { fi: 'Lämpötila muuttuu: {morning}°C → {afternoon}°C', sv: 'Temperaturen ändras: {morning}°C → {afternoon}°C', en: 'Temperature changes: {morning}°C → {afternoon}°C', et: 'Temperatuur muutub: {morning}°C → {afternoon}°C', ar: 'الحرارة تتغير: {morning}°م → {afternoon}°م' },
  'share.button': { fi: 'Jaa puolison kanssa', sv: 'Dela med partner', en: 'Share with partner', et: 'Jaga partneriga', ar: 'شارك مع الشريك' },
  'share.messageIntro': { fi: 'Pukuri-muistutus!', sv: 'Pukuri-påminnelse!', en: 'Pukuri reminder!', et: 'Pukuri meeldetuletus!', ar: 'تذكير من Pukuri!' },
  'lang.label': { fi: 'Kieli', sv: 'Språk', en: 'Language', et: 'Keel', ar: 'اللغة' },
  'uv.high': { fi: 'Korkea UV ({uvi})', sv: 'Högt UV ({uvi})', en: 'High UV ({uvi})', et: 'Kõrge UV ({uvi})', ar: 'UV مرتفع ({uvi})' },
  'uv.description': { fi: 'Muista aurinkorasva ja hattu!', sv: 'Kom ihåg solskyddskräm och hatt!', en: 'Remember sunscreen and hat!', et: 'Ära unusta päikesekaitsekreemi ja kübarat!', ar: 'تذكر واقي الشمس والقبعة!' },
  'footer.copyright': { fi: '© 2024 Pukuri', sv: '© 2024 Pukuri', en: '© 2024 Pukuri', et: '© 2024 Pukuri', ar: '© 2024 Pukuri' },
  'footer.contact': { fi: 'pukuri@outlook.com', sv: 'pukuri@outlook.com', en: 'pukuri@outlook.com', et: 'pukuri@outlook.com', ar: 'pukuri@outlook.com' },
};

// ========== i18n Context ==========
const LangContext = createContext({ lang: 'fi', setLang: () => {}, t: (k) => k });

function useLang() { return useContext(LangContext); }

function t(lang, key, params) {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[lang] || entry.fi || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)); });
  }
  return text;
}

// ========== Weather Logic ==========
function mapCondition(id) {
  if (id >= 200 && id < 600) return 'rainy';
  if (id >= 600 && id < 700) return 'snowy';
  if (id >= 700 && id < 800) return 'windy';
  if (id === 800) return 'sunny';
  return 'cloudy';
}

function getWeatherIcon(condition) {
  const icons = { sunny: '☀️', cloudy: '☁️', rainy: '🌧️', snowy: '❄️', windy: '💨' };
  return icons[condition] || '☁️';
}

function isSpringMonth() {
  const m = new Date().getMonth();
  return m === 2 || m === 3;
}

async function fetchWeather(city) {
  const [wRes, fRes] = await Promise.all([
    fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fi`),
    fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fi`),
  ]);
  if (!wRes.ok || !fRes.ok) throw new Error('API error');
  const [w, f] = await Promise.all([wRes.json(), fRes.json()]);
  return { weather: w, forecast: f };
}

async function fetchWeatherByCoords(lat, lon) {
  const [wRes, fRes] = await Promise.all([
    fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=fi`),
    fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=fi`),
  ]);
  if (!wRes.ok || !fRes.ok) throw new Error('API error');
  const [w, f] = await Promise.all([wRes.json(), fRes.json()]);
  return { weather: w, forecast: f };
}

function parseWeatherData(w) {
  return {
    temperature: Math.round(w.main.temp),
    feelsLike: Math.round(w.main.feels_like),
    condition: mapCondition(w.weather[0].id),
    windSpeed: Math.round(w.wind.speed),
    humidity: w.main.humidity,
    rainProbability: w.clouds?.all ?? 0,
    afternoonRain: false,
    city: w.name,
    description: w.weather[0].description,
    uvi: w.uvi,
  };
}

function parseTomorrow(forecastList) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const tKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
  const entries = forecastList.filter(e => {
    const d = new Date(e.dt * 1000);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` === tKey;
  });
  if (!entries.length) return null;
  const temps = entries.map(e => e.main.temp);
  const winds = entries.map(e => e.wind.speed);
  const pops = entries.map(e => (e.pop ?? 0) * 100);
  const mid = entries[Math.floor(entries.length / 2)];
  return {
    tempMin: Math.round(Math.min(...temps)),
    tempMax: Math.round(Math.max(...temps)),
    condition: mapCondition(mid.weather[0].id),
    rainProbability: Math.round(Math.max(...pops)),
    avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
    avgWind: Math.round(winds.reduce((a, b) => a + b, 0) / winds.length),
    description: mid.weather[0].description,
  };
}

// ========== Alerts ==========
function computeAlerts(forecastList, currentTemp, uvi) {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const tomorrowD = new Date(now.getTime() + 86400000);
  const tomorrowKey = `${tomorrowD.getFullYear()}-${tomorrowD.getMonth() + 1}-${tomorrowD.getDate()}`;

  let rainStartTime = null, morningFreezing = false, maxWind = 0, todayMax = null, todayHadRain = false;
  let tomorrowMorning = null, tomorrowMax = null, tomorrowRain = false;

  for (const e of forecastList) {
    const d = new Date(e.dt * 1000);
    const eKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const h = d.getHours();
    if (eKey === todayKey) {
      if (h >= 6 && h <= 9 && e.main.temp < 0) morningFreezing = true;
      if ((e.wind?.speed ?? 0) > maxWind) maxWind = e.wind?.speed ?? 0;
      if (todayMax === null || e.main.temp > todayMax) todayMax = Math.round(e.main.temp);
      const rain = (e.rain?.['3h'] ?? 0) + (e.snow?.['3h'] ?? 0);
      if (rain > 0.1) { todayHadRain = true; if (!rainStartTime) rainStartTime = `${String(h).padStart(2,'0')}:00`; }
      if ((e.pop ?? 0) > 0.5 && !rainStartTime) rainStartTime = `${String(h).padStart(2,'0')}:00`;
    }
    if (eKey === tomorrowKey) {
      if (h >= 6 && h <= 9 && tomorrowMorning === null) tomorrowMorning = Math.round(e.main.temp);
      if (tomorrowMax === null || e.main.temp > tomorrowMax) tomorrowMax = Math.round(e.main.temp);
      if ((e.pop ?? 0) > 0.4) tomorrowRain = true;
    }
  }

  const todayRef = todayMax ?? currentTemp;
  return {
    rainStartTime, morningFreezing, maxWindSpeed: Math.round(maxWind), uvMax: uvi ?? 0,
    todayMaxTemp: todayMax, tomorrowMorningTemp: tomorrowMorning, tomorrowMaxTemp: tomorrowMax,
    tomorrowColder: tomorrowMax !== null && todayRef - tomorrowMax > 5,
    tomorrowWarmer: tomorrowMax !== null && tomorrowMax - todayRef > 5,
    tomorrowRain, todayHadRain, loaded: true,
  };
}

// ========== Clothing Recommendation ==========
const coldGear = {
  vauva: [
    { name: 'Toppahaalari', emoji: '🧥', desc: 'Paksu talvihaalari' },
    { name: 'Villakerrastot', emoji: '🧶', desc: 'Merinovillaiset' },
    { name: 'Villasukat', emoji: '🧦', desc: 'Paksut villasukat' },
    { name: 'Talvitöppöset', emoji: '👟', desc: 'Lämpimät kengät' },
    { name: 'Lapaset', emoji: '🧤', desc: 'Paksut tumput' },
    { name: 'Pipo', emoji: '🎿', desc: 'Villapipo' },
    { name: 'Kauluri', emoji: '🧣', desc: 'Tuubihuivi' },
  ],
  taapero: [
    { name: 'Toppahousut', emoji: '👖', desc: 'Talvitoppahousut' },
    { name: 'Toppatakki', emoji: '🧥', desc: 'Paksu talvitakki' },
    { name: 'Villakerrastot', emoji: '🧶', desc: 'Aluskerrastot' },
    { name: 'Talvisaappaat', emoji: '🥾', desc: 'Vedenpitävät saappaat' },
    { name: 'Lapaset', emoji: '🧤', desc: 'Hanskat tai rukkaset' },
    { name: 'Kauluri', emoji: '🧣', desc: 'Tuubihuivi' },
    { name: 'Pipo', emoji: '🎿', desc: 'Lämmin pipo' },
  ],
  'leikki-ikäinen': [
    { name: 'Toppahousut', emoji: '👖', desc: 'Talvihousut' },
    { name: 'Toppatakki', emoji: '🧥', desc: 'Talvitakki' },
    { name: 'Villakerrastot', emoji: '🧶', desc: 'Aluskerrastot' },
    { name: 'Talvisaappaat', emoji: '🥾', desc: 'Lämpimät saappaat' },
    { name: 'Hanskat', emoji: '🧤', desc: 'Sormikkaat tai lapaset' },
    { name: 'Pipo', emoji: '🎿', desc: 'Lämmin pipo' },
    { name: 'Kauluri', emoji: '🧣', desc: 'Tuubihuivi' },
  ],
  koululainen: [
    { name: 'Toppahousut', emoji: '👖', desc: 'Talvihousut' },
    { name: 'Toppatakki', emoji: '🧥', desc: 'Talvitakki' },
    { name: 'Välikerrastot', emoji: '👕', desc: 'Alusvaatteet' },
    { name: 'Talvikengät', emoji: '🥾', desc: 'Lämpimät kengät' },
    { name: 'Hanskat', emoji: '🧤', desc: 'Sormikkaat' },
    { name: 'Pipo', emoji: '🎿', desc: 'Pipo' },
    { name: 'Kauluri', emoji: '🧣', desc: 'Kauluri' },
  ],
};

const mildGear = {
  vauva: [
    { name: 'Välikausihaalari', emoji: '🧥', desc: 'Kevyt haalari' },
    { name: 'Ohut pipo', emoji: '🧢', desc: 'Puuvillapipo' },
  ],
  taapero: [
    { name: 'Välikausihousut', emoji: '👖', desc: 'Joustavat housut' },
    { name: 'Kuoritakki', emoji: '🧥', desc: 'Tuulenpitävä takki' },
    { name: 'Välikausikengät', emoji: '🥾', desc: 'Vettähylkivät' },
    { name: 'Välikerrasto', emoji: '👕', desc: 'Fleece tai villa' },
    { name: 'Ohut pipo', emoji: '🧢', desc: 'Ohut pipo' },
  ],
  'leikki-ikäinen': [
    { name: 'Välikausihousut', emoji: '👖', desc: 'Joustavat housut' },
    { name: 'Kuoritakki', emoji: '🧥', desc: 'Tuulenpitävä takki' },
    { name: 'Välikausikengät', emoji: '🥾', desc: 'Vettähylkivät' },
    { name: 'Välikerrasto', emoji: '👕', desc: 'Fleece tai villa' },
    { name: 'Ohut pipo', emoji: '🧢', desc: 'Ohut pipo' },
  ],
  koululainen: [
    { name: 'Välikausihousut', emoji: '👖', desc: 'Joustavat housut' },
    { name: 'Kuoritakki', emoji: '🧥', desc: 'Tuulenpitävä takki' },
    { name: 'Välikausikengät', emoji: '🥾', desc: 'Vettähylkivät' },
    { name: 'Huppari', emoji: '👕', desc: 'Fleece tai huppari' },
    { name: 'Ohut pipo', emoji: '🧢', desc: 'Ohut pipo' },
  ],
};

const warmGear = {
  vauva: [
    { name: 'Puuvillabody', emoji: '👶', desc: 'Ohut body' },
    { name: 'Puuvillahousut', emoji: '👖', desc: 'Ohuet housut' },
    { name: 'Aurinkohattu', emoji: '👒', desc: 'Aurinkosuoja' },
    { name: 'Pehmeät tossut', emoji: '👟', desc: 'Kevyet kengät' },
  ],
  taapero: [
    { name: 'T-paita', emoji: '👕', desc: 'Kevyt paita' },
    { name: 'Shortsit', emoji: '🩳', desc: 'Kevyet shortsit' },
    { name: 'Kevyet kengät', emoji: '👟', desc: 'Kevyet kengät' },
    { name: 'Aurinkohattu', emoji: '👒', desc: 'Hattu' },
  ],
  'leikki-ikäinen': [
    { name: 'T-paita', emoji: '👕', desc: 'T-paita' },
    { name: 'Shortsit', emoji: '🩳', desc: 'Shortsit' },
    { name: 'Kevyet kengät', emoji: '👟', desc: 'Kevyet kengät' },
    { name: 'Lippalakki', emoji: '🧢', desc: 'Aurinkosuoja' },
  ],
  koululainen: [
    { name: 'T-paita', emoji: '👕', desc: 'T-paita' },
    { name: 'Shortsit', emoji: '🩳', desc: 'Shortsit' },
    { name: 'Lenkkarit', emoji: '👟', desc: 'Kevyet kengät' },
    { name: 'Lippalakki', emoji: '🧢', desc: 'Aurinkosuoja' },
  ],
};

function getClothingRecommendation(weather, ageGroup) {
  const base = [];
  const spring = isSpringMonth();
  const temp = spring ? weather.temperature : (weather.feelsLike ?? weather.temperature);

  if (temp < -10) {
    base.push({ name: 'Kerrospukeutuminen', emoji: '🧅', desc: 'Merinovilla + paksu toppapuku' });
    base.push(...coldGear[ageGroup]);
  } else if (spring && temp >= -2 && temp <= 15) {
    base.push({ name: 'Välikausivaatteet', emoji: '🍂', desc: 'Kuoritakki + lämmin välikerros' });
    base.push(...mildGear[ageGroup]);
    base.push({ name: 'Lämmin välikerros', emoji: '🧶', desc: 'Villa/fleece kuoriasun alle' });
  } else if (temp <= 0) {
    base.push(...coldGear[ageGroup]);
  } else if (temp <= 15) {
    base.push({ name: 'Välikausivaatteet', emoji: '🍂', desc: 'Kuoritakki + kerroksia' });
    base.push(...mildGear[ageGroup]);
    if (weather.windSpeed > 5) {
      base.push({ name: 'Tuubihuivi', emoji: '🧣', desc: 'Tuuli yli 5 m/s' });
    }
  } else if (temp <= 18) {
    base.push(...warmGear[ageGroup]);
  } else {
    base.push(...warmGear[ageGroup]);
    if (weather.uvi && weather.uvi >= 3) {
      base.push({ name: 'Aurinkorasva', emoji: '🧴', desc: 'UV-suoja' });
    }
  }

  // Rain gear
  if (weather.rainProbability > 30 || weather.condition === 'rainy') {
    if (temp >= 15) {
      if (ageGroup === 'koululainen') {
        base.unshift({ name: 'Sadetakki', emoji: '🧥', desc: 'Vedenpitävä kuoritakki' });
      } else {
        base.unshift({ name: 'Sadeasu', emoji: '🌧️', desc: 'Kuravarusteet' });
        base.unshift({ name: 'Kumisaappaat', emoji: '🥾', desc: 'Kumisaappaat' });
      }
    } else {
      base.unshift({ name: 'Kurahousut', emoji: '🌧️', desc: 'Vedenpitävät varusteet' });
      base.unshift(temp < 10
        ? { name: 'Kumisaappaat + villasukat', emoji: '🥾🧦', desc: 'Lämpimät kumisaappaat' }
        : { name: 'Kumisaappaat', emoji: '🥾', desc: 'Kumisaappaat' }
      );
    }
  }

  // Deduplicate
  const seen = new Set();
  return base.filter(i => { if (seen.has(i.name)) return false; seen.add(i.name); return true; });
}

// ========== Dual Recommendation ==========
function computeDual(weather, ageGroup, forecastList) {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let mEntry = null, aEntry = null, recentRain = 0;

  for (const e of forecastList) {
    const d = new Date(e.dt * 1000);
    const eKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const h = d.getHours();
    const hoursAgo = (now.getTime() - d.getTime()) / 3600000;
    if (hoursAgo >= 0 && hoursAgo <= 12) recentRain += (e.rain?.['3h'] ?? 0);
    if (eKey !== todayKey) continue;
    if (h >= 6 && h <= 9 && !mEntry) mEntry = e;
    if (h >= 12 && h <= 15 && !aEntry) aEntry = e;
  }

  const mT = mEntry ? Math.round(mEntry.main.temp) : weather.temperature;
  const aT = aEntry ? Math.round(aEntry.main.temp) : weather.temperature;
  const mFL = mEntry ? Math.round(mEntry.main.feels_like) : weather.feelsLike;
  const aFL = aEntry ? Math.round(aEntry.main.feels_like) : weather.feelsLike;
  const gap = Math.abs(aT - mT);
  const isDual = gap > 7;
  const ws = Math.max(mEntry?.wind?.speed ?? 0, aEntry?.wind?.speed ?? 0, weather.windSpeed);

  const mW = { ...weather, temperature: mT, feelsLike: mFL, condition: mEntry ? mapCondition(mEntry.weather[0].id) : weather.condition, windSpeed: mEntry?.wind?.speed ?? weather.windSpeed, rainProbability: mEntry ? Math.round((mEntry.pop ?? 0) * 100) : weather.rainProbability };
  const aW = { ...weather, temperature: aT, feelsLike: aFL, condition: aEntry ? mapCondition(aEntry.weather[0].id) : weather.condition, windSpeed: aEntry?.wind?.speed ?? weather.windSpeed, rainProbability: aEntry ? Math.round((aEntry.pop ?? 0) * 100) : weather.rainProbability };

  return {
    isDual,
    morningClothing: getClothingRecommendation(mW, ageGroup),
    afternoonClothing: getClothingRecommendation(aW, ageGroup),
    morningTemp: mT, afternoonTemp: aT,
    morningFeelsLike: mFL, afternoonFeelsLike: aFL,
    windWarning: ws > 6, windSpeed: Math.round(ws),
    mudFactor: recentRain > 1, recentRainMm: Math.round(recentRain * 10) / 10,
  };
}

// ========== Clothing name translations ==========
const clothingNames = {
  'Kerrospukeutuminen': { sv: 'Lagerklädsel', en: 'Layering', et: 'Kihiline riietus', ar: 'ارتداء طبقات' },
  'Välikausivaatteet': { sv: 'Övergångskläder', en: 'Mid-season', et: 'Vahehooajariided', ar: 'ملابس الموسم المتوسط' },
  'Toppahaalari': { sv: 'Täckoverall', en: 'Snow overall', et: 'Talvekombinesoon', ar: 'بذلة ثلج' },
  'Villakerrastot': { sv: 'Ullunderställ', en: 'Wool base layers', et: 'Villased alusriided', ar: 'طبقات صوف' },
  'Villasukat': { sv: 'Ullstrumpor', en: 'Wool socks', et: 'Villasokid', ar: 'جوارب صوف' },
  'Talvitöppöset': { sv: 'Vinterskor', en: 'Winter booties', et: 'Talvejalanõud', ar: 'أحذية شتوية' },
  'Lapaset': { sv: 'Vantar', en: 'Mittens', et: 'Labakindad', ar: 'قفازات' },
  'Pipo': { sv: 'Mössa', en: 'Beanie', et: 'Müts', ar: 'قبعة صوف' },
  'Kauluri': { sv: 'Halskrage', en: 'Neck warmer', et: 'Kaelasall', ar: 'واقي الرقبة' },
  'Toppahousut': { sv: 'Täckbyxor', en: 'Snow trousers', et: 'Talvepüksid', ar: 'بنطلون ثلج' },
  'Toppatakki': { sv: 'Täckjacka', en: 'Winter jacket', et: 'Talvejope', ar: 'جاكيت شتوي' },
  'Talvisaappaat': { sv: 'Vinterstövlar', en: 'Winter boots', et: 'Talvesaapad', ar: 'أحذية شتوية' },
  'Hanskat': { sv: 'Handskar', en: 'Gloves', et: 'Kindad', ar: 'قفازات' },
  'Välikerrastot': { sv: 'Mellanunderställ', en: 'Mid layers', et: 'Soojuskiht', ar: 'طبقة وسطى' },
  'Talvikengät': { sv: 'Vinterskor', en: 'Winter shoes', et: 'Talvejalanõud', ar: 'أحذية شتوية' },
  'Välikausihaalari': { sv: 'Skaloverall', en: 'Mid-season overall', et: 'Vahehooaja kombinesoon', ar: 'بذلة الموسم' },
  'Ohut pipo': { sv: 'Tunn mössa', en: 'Thin beanie', et: 'Õhuke müts', ar: 'قبعة رقيقة' },
  'Välikausihousut': { sv: 'Övergångsbyxor', en: 'Mid-season trousers', et: 'Vahehooaja püksid', ar: 'بنطلون الموسم' },
  'Kuoritakki': { sv: 'Skaljacka', en: 'Shell jacket', et: 'Koorikjope', ar: 'جاكيت واقٍ' },
  'Välikausikengät': { sv: 'Övergångsskor', en: 'Mid-season shoes', et: 'Vahehooaja jalanõud', ar: 'أحذية الموسم' },
  'Välikerrasto': { sv: 'Mellanskikt', en: 'Mid layer', et: 'Soojuskiht', ar: 'طبقة وسطى' },
  'Huppari': { sv: 'Hoodie', en: 'Hoodie', et: 'Dressipluus', ar: 'هودي' },
  'Lämmin välikerros': { sv: 'Varmt mellanskikt', en: 'Warm mid layer', et: 'Soe soojuskiht', ar: 'طبقة وسطى دافئة' },
  'Tuubihuivi': { sv: 'Tubhalsduk', en: 'Neck gaiter', et: 'Torukaelasall', ar: 'واقي الرقبة' },
  'Puuvillabody': { sv: 'Bomullsbody', en: 'Cotton bodysuit', et: 'Puuvillane bodüsuits', ar: 'بذلة قطنية' },
  'Puuvillahousut': { sv: 'Bomullsbyxor', en: 'Cotton trousers', et: 'Puuvillapüksid', ar: 'بنطلون قطني' },
  'Aurinkohattu': { sv: 'Solhatt', en: 'Sun hat', et: 'Päikesekübar', ar: 'قبعة شمسية' },
  'Pehmeät tossut': { sv: 'Mjuka tossor', en: 'Soft booties', et: 'Pehmed tossud', ar: 'أحذية ناعمة' },
  'T-paita': { sv: 'T-shirt', en: 'T-shirt', et: 'T-särk', ar: 'تي شيرت' },
  'Shortsit': { sv: 'Shorts', en: 'Shorts', et: 'Lühikesed püksid', ar: 'شورت' },
  'Kevyet kengät': { sv: 'Lätta skor', en: 'Light shoes', et: 'Kerged jalanõud', ar: 'أحذية خفيفة' },
  'Lippalakki': { sv: 'Keps', en: 'Cap', et: 'Nokamüts', ar: 'قبعة' },
  'Lenkkarit': { sv: 'Sneakers', en: 'Sneakers', et: 'Tossud', ar: 'أحذية رياضية' },
  'Aurinkorasva': { sv: 'Solskyddskräm', en: 'Sunscreen', et: 'Päikesekaitsekreem', ar: 'واقي شمس' },
  'Sadeasu': { sv: 'Regnställ', en: 'Rain suit', et: 'Vihmakomplekt', ar: 'بدلة مطر' },
  'Sadetakki': { sv: 'Regnjacka', en: 'Rain jacket', et: 'Vihmajope', ar: 'جاكيت مطر' },
  'Kurahousut': { sv: 'Regnbyxor', en: 'Rain trousers', et: 'Vihmapüksid', ar: 'بنطلون مطر' },
  'Kumisaappaat': { sv: 'Gummistövlar', en: 'Rubber boots', et: 'Kummikud', ar: 'أحذية مطاطية' },
  'Kumisaappaat + villasukat': { sv: 'Gummistövlar + ullstrumpor', en: 'Rubber boots + wool socks', et: 'Kummikud + villasokid', ar: 'أحذية مطاطية + جوارب صوف' },
};

function translateName(name, lang) {
  if (lang === 'fi') return name;
  return clothingNames[name]?.[lang] || name;
}

// ========== COMPONENTS ==========

function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const langs = [
    { code: 'fi', flag: '🇫🇮', label: 'FI' },
    { code: 'sv', flag: '🇸🇪', label: 'SV' },
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'et', flag: '🇪🇪', label: 'ET' },
    { code: 'ar', flag: '🇸🇦', label: 'AR' },
  ];
  return (
    <View style={s.langRow}>
      {langs.map(l => (
        <TouchableOpacity key={l.code} style={[s.langBtn, lang === l.code && s.langBtnActive]} onPress={() => setLang(l.code)}>
          <Text style={s.langFlag}>{l.flag}</Text>
          <Text style={[s.langLabel, lang === l.code && s.langLabelActive]}>{l.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function WeatherCardView({ weather, cacheAge, onRefresh, loading }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);
  const cacheLabel = cacheAge === null ? null : cacheAge < 1 ? T('weather.justUpdated') : T('weather.updatedAgo', { min: cacheAge });
  return (
    <View style={s.card}>
      <View style={s.row}>
        <View style={[s.row, { flex: 1 }]}>
          <MapPin size={14} color={COLORS.primary} />
          <Text style={s.cityText}>{weather.city}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>{T('weather.today')} · {T(`weekday.${new Date().getDay()}`)}</Text>
          </View>
        </View>
        {cacheLabel && <Text style={s.mutedSmall}>{cacheLabel}</Text>}
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} disabled={loading} style={{ marginLeft: 6 }}>
            <RefreshCw size={16} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[s.row, { justifyContent: 'space-between', marginTop: 12 }]}>
        <View>
          <Text style={s.bigTemp}>{weather.temperature}°</Text>
          <Text style={s.mutedSmall}>{T('weather.feelsLike')} {weather.feelsLike}°</Text>
          <Text style={[s.mutedSmall, { marginTop: 4, textTransform: 'capitalize' }]}>{weather.description}</Text>
        </View>
        <Text style={{ fontSize: 56 }}>{getWeatherIcon(weather.condition)}</Text>
      </View>
      <View style={[s.row, { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 20 }]}>
        <View style={s.row}><Wind size={14} color={COLORS.muted} /><Text style={s.mutedSmall}> {weather.windSpeed} m/s</Text></View>
        <View style={s.row}><Droplets size={14} color={COLORS.muted} /><Text style={s.mutedSmall}> {weather.humidity}%</Text></View>
        <View style={s.row}><CloudRain size={14} color={COLORS.muted} /><Text style={s.mutedSmall}> {T('weather.rain')} {weather.rainProbability}%</Text></View>
      </View>
    </View>
  );
}

function AgeGroupToggleView({ selected, onChange }) {
  const { lang } = useLang();
  const T = (k) => t(lang, k);
  const groups = [
    { value: 'vauva', emoji: '👶' },
    { value: 'taapero', emoji: '🧒' },
    { value: 'leikki-ikäinen', emoji: '🎨' },
    { value: 'koululainen', emoji: '🎒' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {groups.map(g => (
        <TouchableOpacity key={g.value} style={[s.ageBtn, selected === g.value && s.ageBtnActive]} onPress={() => onChange(g.value)}>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>{g.emoji}</Text>
          <Text style={[s.ageBtnLabel, selected === g.value && { color: COLORS.primaryFg }]}>{T(`age.${g.value}`)}</Text>
          <Text style={[s.mutedSmall, selected === g.value && { color: COLORS.primaryFg + 'cc' }]}>{T(`age.${g.value}.ages`)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MorningSummaryView({ alerts }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);
  if (!alerts.loaded) return (
    <View style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
      <ActivityIndicator size="small" color={COLORS.muted} />
      <Text style={s.mutedSmall}>{T('morning.loading')}</Text>
    </View>
  );

  const msgs = [];
  if (alerts.rainStartTime) msgs.push({ icon: '🌧️', text: T('morning.rainStart', { time: alerts.rainStartTime }) });
  if (alerts.morningFreezing) msgs.push({ icon: '🥶', text: T('morning.freezing') });
  if (alerts.maxWindSpeed > 5) msgs.push({ icon: '💨', text: T('morning.windChill', { speed: alerts.maxWindSpeed }) });
  if (alerts.uvMax >= 3) msgs.push({ icon: '☀️', text: T('morning.uvHigh') });

  if (!msgs.length) return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>{T('morning.title')}</Text>
      <Text style={s.bodyText}>{T('morning.calmDay')}</Text>
    </View>
  );

  return (
    <View style={[s.card, { borderColor: '#fbbf24', borderWidth: 1 }]}>
      <Text style={s.sectionTitle}>{T('morning.title')}</Text>
      {msgs.map((m, i) => (
        <View key={i} style={[s.row, { marginTop: 4, gap: 6 }]}>
          <Text>{m.icon}</Text>
          <Text style={s.bodyText}>{m.text}</Text>
        </View>
      ))}
    </View>
  );
}

function NightAlertView({ weather, alerts }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);
  if (!alerts.loaded) return null;

  const msgs = [];
  if (alerts.tomorrowColder && alerts.tomorrowMaxTemp !== null) {
    msgs.push(T('night.tomorrowColder', { today: alerts.todayMaxTemp ?? weather.temperature, tomorrow: alerts.tomorrowMaxTemp }));
  }
  if (alerts.tomorrowWarmer && alerts.tomorrowMaxTemp !== null) {
    msgs.push(T('night.tomorrowWarmer', { today: alerts.todayMaxTemp ?? weather.temperature, tomorrow: alerts.tomorrowMaxTemp }));
  }
  if (alerts.tomorrowRain) msgs.push(T('night.tomorrowRain'));
  if (alerts.todayHadRain) msgs.push(T('night.dryGear'));
  if (!msgs.length) return null;

  return (
    <View style={[s.card, { borderColor: COLORS.destructive + '44', borderWidth: 1 }]}>
      <Text style={s.sectionTitle}>{T('night.title')}</Text>
      {msgs.map((m, i) => <Text key={i} style={[s.bodyText, { marginTop: 4 }]}>• {m}</Text>)}
    </View>
  );
}

function ClothingListView({ items }) {
  const { lang } = useLang();
  return (
    <View style={{ gap: 6 }}>
      {items.map((item, i) => (
        <View key={item.name + i} style={s.clothingItem}>
          <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={s.clothingName}>{translateName(item.name, lang)}</Text>
            <Text style={s.mutedSmall}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function DualClothingView({ dual }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);

  return (
    <View style={{ gap: 10 }}>
      {(dual.windWarning || dual.mudFactor) && (
        <View style={[s.card, { backgroundColor: COLORS.accent }]}>
          {dual.windWarning && (
            <View style={[s.row, { gap: 6 }]}>
              <Wind size={14} color={COLORS.primary} />
              <Text style={s.bodyText}>{T('dual.windWarning', { speed: dual.windSpeed })}</Text>
            </View>
          )}
          {dual.mudFactor && (
            <View style={[s.row, { gap: 6, marginTop: 4 }]}>
              <Droplets size={14} color={COLORS.primary} />
              <Text style={s.bodyText}>{T('dual.mudWarning')}</Text>
            </View>
          )}
        </View>
      )}

      {dual.isDual ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[s.card, { flex: 1 }]}>
            <Text style={s.sectionTitle}>🌅 {T('dual.morning')}</Text>
            <Text style={s.mutedSmall}>{dual.morningTemp}°C ({T('weather.feelsLike')} {dual.morningFeelsLike}°C)</Text>
            <View style={{ marginTop: 8 }}><ClothingListView items={dual.morningClothing} /></View>
          </View>
          <View style={[s.card, { flex: 1 }]}>
            <Text style={s.sectionTitle}>☀️ {T('dual.afternoon')}</Text>
            <Text style={s.mutedSmall}>{dual.afternoonTemp}°C ({T('weather.feelsLike')} {dual.afternoonFeelsLike}°C)</Text>
            <View style={{ marginTop: 8 }}><ClothingListView items={dual.afternoonClothing} /></View>
          </View>
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.sectionTitle}>{T('clothing.title')}</Text>
          <View style={{ marginTop: 8 }}><ClothingListView items={dual.morningClothing} /></View>
        </View>
      )}

      {dual.isDual && (
        <View style={[s.card, { backgroundColor: COLORS.primary + '15' }]}>
          <View style={[s.row, { gap: 6 }]}>
            <AlertTriangle size={14} color={COLORS.primary} />
            <Text style={s.bodyText}>{T('dual.gapInfo', { morning: dual.morningTemp, afternoon: dual.afternoonTemp })}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function TomorrowView({ tomorrow }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);
  if (!tomorrow) return null;

  return (
    <View style={[s.card, { backgroundColor: COLORS.night }]}>
      <View style={[s.row, { gap: 6, marginBottom: 8 }]}>
        <Moon size={14} color={COLORS.nightMuted} />
        <Text style={[s.sectionTitle, { color: COLORS.nightMuted }]}>{T('tomorrow.title')}</Text>
        <View style={[s.badge, { backgroundColor: COLORS.nightFg + '20' }]}>
          <Text style={[s.badgeText, { color: COLORS.nightMuted }]}>{T(`weekday.${new Date(Date.now() + 86400000).getDay()}`)}</Text>
        </View>
      </View>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <View>
          <Text style={[s.bigTemp, { color: COLORS.nightFg, fontSize: 28 }]}>{tomorrow.tempMin}° / {tomorrow.tempMax}°</Text>
          <Text style={{ color: COLORS.nightMuted, fontSize: 12, marginTop: 2 }}>{T('tomorrow.rainProb')} {tomorrow.rainProbability}%</Text>
        </View>
        <Text style={{ fontSize: 40 }}>{getWeatherIcon(tomorrow.condition)}</Text>
      </View>
    </View>
  );
}

function UvAlertView({ weather }) {
  const { lang } = useLang();
  const T = (k, p) => t(lang, k, p);
  if (!weather.uvi || weather.uvi < 3) return null;
  return (
    <View style={[s.card, { borderColor: '#fbbf24', borderWidth: 1 }]}>
      <View style={[s.row, { gap: 8 }]}>
        <Sun size={20} color="#f59e0b" />
        <View style={{ flex: 1 }}>
          <Text style={s.sectionTitle}>{T('uv.high', { uvi: weather.uvi })}</Text>
          <Text style={[s.mutedSmall, { marginTop: 2 }]}>{T('uv.description')}</Text>
        </View>
      </View>
    </View>
  );
}

function ShareButtonView({ dual, ageGroup }) {
  const { lang } = useLang();
  const T = (k) => t(lang, k);
  const handleShare = async () => {
    const ageName = T(`age.${ageGroup}`);
    const items = dual.morningClothing.map(c => `${c.emoji} ${translateName(c.name, lang)}`).join(', ');
    let msg = `${T('share.messageIntro')} 🌦️\n👶 ${ageName}\n🌅 ${items}\n\n🔗 https://pukuri.lovable.app`;
    try { await Share.share({ message: msg }); } catch {}
  };
  return (
    <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
      <Share2 size={16} color={COLORS.primary} />
      <Text style={s.shareBtnText}>{T('share.button')}</Text>
    </TouchableOpacity>
  );
}

function LocationSearchView({ currentCity, onSelectCity, onGeolocate, loading }) {
  const { lang } = useLang();
  const T = (k) => t(lang, k);
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) { onSelectCity(query.trim()); setQuery(''); }
  };

  return (
    <View style={s.card}>
      {loading && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={[s.mutedSmall, { marginLeft: 6 }]}>{T('location.updating')}</Text>
        </View>
      )}
      <View style={[s.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
        <View style={[s.row, { gap: 4 }]}>
          <MapPin size={14} color={COLORS.primary} />
          <Text style={s.bodyText}>{T('location.weatherNow')}: <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{currentCity}</Text></Text>
        </View>
        <TouchableOpacity onPress={onGeolocate} disabled={loading} style={[s.row, { gap: 4 }]}>
          <MapPin size={12} color={COLORS.muted} />
          <Text style={s.mutedSmall}>{T('location.useCurrentLocation')}</Text>
        </TouchableOpacity>
      </View>
      <View style={s.searchRow}>
        <Search size={14} color={COLORS.muted} style={{ position: 'absolute', left: 10, top: 10 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder={T('location.searchPlaceholder')}
          placeholderTextColor={COLORS.muted}
          style={s.searchInput}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

function FooterView() {
  const { lang } = useLang();
  const T = (k) => t(lang, k);
  return (
    <View style={s.footer}>
      <Text style={s.mutedSmall}>{T('footer.copyright')} | {T('footer.contact')}</Text>
    </View>
  );
}

// ========== MAIN APP ==========
export default function App() {
  const [lang, setLangState] = useState('fi');
  const [city, setCity] = useState('Helsinki');
  const [ageGroup, setAgeGroup] = useState('leikki-ikäinen');
  const [weather, setWeather] = useState(null);
  const [tomorrow, setTomorrow] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheAge, setCacheAge] = useState(null);

  const setLang = useCallback(async (l) => {
    setLangState(l);
    try { await AsyncStorage.setItem('pukuri-language', l); } catch {}
    if (l === 'ar') { I18nManager.forceRTL(true); } else { I18nManager.forceRTL(false); }
  }, []);

  const T = useCallback((k, p) => t(lang, k, p), [lang]);

  // Load saved state
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('pukuri-language');
        if (savedLang && ['fi','sv','en','et','ar'].includes(savedLang)) setLangState(savedLang);
        const savedCity = await AsyncStorage.getItem('pukuri-city');
        if (savedCity) setCity(savedCity);
      } catch {}
    })();
  }, []);

  // Load weather
  const loadWeather = useCallback(async (cityName) => {
    setLoading(true);
    try {
      const data = await fetchWeather(cityName);
      const w = parseWeatherData(data.weather);
      setWeather(w);
      setCity(w.city);
      setForecastList(data.forecast.list ?? []);
      setTomorrow(parseTomorrow(data.forecast.list ?? []));
      setCacheAge(0);
      await AsyncStorage.setItem('pukuri-city', w.city);
    } catch (e) {
      Alert.alert('Error', T('location.notFound'));
    } finally {
      setLoading(false);
    }
  }, [T]);

  const loadByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      const w = parseWeatherData(data.weather);
      setWeather(w);
      setCity(w.city);
      setForecastList(data.forecast.list ?? []);
      setTomorrow(parseTomorrow(data.forecast.list ?? []));
      setCacheAge(0);
      await AsyncStorage.setItem('pukuri-city', w.city);
    } catch {
      Alert.alert('Error', T('location.geoError'));
    } finally {
      setLoading(false);
    }
  }, [T]);

  useEffect(() => { loadWeather(city); }, []); // eslint-disable-line

  const handleGeolocate = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('', T('location.geoError')); return; }
      setLoading(true);
      const loc = await Location.getCurrentPositionAsync({});
      await loadByCoords(loc.coords.latitude, loc.coords.longitude);
    } catch {
      setLoading(false);
      Alert.alert('', T('location.geoError'));
    }
  }, [loadByCoords, T]);

  const handleRefresh = useCallback(() => loadWeather(city), [loadWeather, city]);

  const alerts = useMemo(() => {
    if (!weather || !forecastList.length) return { loaded: false };
    return computeAlerts(forecastList, weather.temperature, weather.uvi);
  }, [weather, forecastList]);

  const dual = useMemo(() => {
    if (!weather) return null;
    return computeDual(weather, ageGroup, forecastList);
  }, [weather, ageGroup, forecastList]);

  // Update cache age every minute
  useEffect(() => {
    const iv = setInterval(() => {
      if (cacheAge !== null) setCacheAge(prev => (prev ?? 0) + 1);
    }, 60000);
    return () => clearInterval(iv);
  }, [cacheAge]);

  if (!weather) {
    return (
      <SafeAreaView style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[s.bodyText, { marginTop: 12 }]}>{T('location.updating')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <LangContext.Provider value={{ lang, setLang: setLang, t: T }}>
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>{T('header.title')}</Text>
            <Text style={s.headerSubtitle}>{T('header.subtitle')}</Text>
          </View>
          <LanguageSwitcher />
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40, gap: 12, padding: 16 }}>
          <LocationSearchView currentCity={city} onSelectCity={(c) => loadWeather(c)} onGeolocate={handleGeolocate} loading={loading} />
          <MorningSummaryView alerts={alerts} />
          <NightAlertView weather={weather} alerts={alerts} />
          <WeatherCardView weather={weather} cacheAge={cacheAge} onRefresh={handleRefresh} loading={loading} />
          <TomorrowView tomorrow={tomorrow} />
          <UvAlertView weather={weather} />

          <View>
            <Text style={[s.sectionLabel, { marginBottom: 8 }]}>{T('age.title')}</Text>
            <AgeGroupToggleView selected={ageGroup} onChange={setAgeGroup} />
          </View>

          {dual && <DualClothingView dual={dual} />}
          {dual && <ShareButtonView dual={dual} ageGroup={ageGroup} />}
          <FooterView />
        </ScrollView>
      </SafeAreaView>
    </LangContext.Provider>
  );
}

// ========== STYLES ==========
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.card },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.foreground },
  headerSubtitle: { fontSize: 10, color: COLORS.muted, fontWeight: '500', letterSpacing: 0.5, marginTop: 1 },
  scroll: { flex: 1 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center' },
  cityText: { fontSize: 13, fontWeight: '600', color: COLORS.foreground, marginLeft: 4 },
  badge: { backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 6 },
  badgeText: { fontSize: 10, fontWeight: '600', color: COLORS.muted },
  bigTemp: { fontSize: 52, fontWeight: '800', color: COLORS.foreground, letterSpacing: -2 },
  mutedSmall: { fontSize: 11, color: COLORS.muted },
  bodyText: { fontSize: 13, color: COLORS.foreground, flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.foreground, marginBottom: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 },
  clothingItem: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, backgroundColor: COLORS.accent, borderWidth: 1, borderColor: COLORS.primary + '15' },
  clothingName: { fontSize: 12, fontWeight: '700', color: COLORS.foreground },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  langBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 2 },
  langBtnActive: { backgroundColor: COLORS.primary },
  langFlag: { fontSize: 12 },
  langLabel: { fontSize: 10, fontWeight: '700', color: COLORS.muted },
  langLabelActive: { color: COLORS.primaryFg },
  ageBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  ageBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ageBtnLabel: { fontSize: 10, fontWeight: '700', color: COLORS.foreground, textAlign: 'center', marginTop: 2 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary + '30' },
  shareBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  searchRow: { position: 'relative' },
  searchInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingLeft: 32, paddingRight: 12, paddingVertical: 10, fontSize: 13, color: COLORS.foreground, backgroundColor: COLORS.bg },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: COLORS.card + 'dd', borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  footer: { paddingVertical: 16, alignItems: 'center' },
});
