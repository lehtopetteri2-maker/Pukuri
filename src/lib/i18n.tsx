import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "fi" | "sv" | "no" | "da" | "en";
export type Country = "FI" | "SE" | "NO" | "DK";

const LANG_KEY = "saavahti-language";
const COUNTRY_KEY = "saavahti-country";
const ONBOARDING_KEY = "saavahti-onboarded";

function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "sv" || saved === "no" || saved === "da" || saved === "en") return saved;
  return "fi";
}

export function getSavedCountry(): Country {
  const saved = localStorage.getItem(COUNTRY_KEY);
  if (saved === "SE" || saved === "NO" || saved === "DK") return saved as Country;
  return "FI";
}

export function saveCountry(country: Country) {
  localStorage.setItem(COUNTRY_KEY, country);
}

export function isOnboarded(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function setOnboarded() {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

// Flat translation keys
const translations = {
  // Header
  "header.title": { fi: "Säävahti", sv: "Väderpytten", no: "Værpassen", da: "Vejrvagten", en: "Säävahti" },
  "header.subtitle": { fi: "Älykäs apu aamun varustevalintoihin", sv: "Smart hjälp med morgonens utrustningsval", no: "Smart hjelp med morgenens utstyrsvalg", da: "Smart hjælp til morgenens påklædning", en: "Smart help for morning outfit choices" },

  // Location search
  "location.weatherNow": { fi: "Sää nyt", sv: "Väder nu", no: "Vær nå", da: "Vejr nu", en: "Weather now" },
  "location.useCurrentLocation": { fi: "Käytä nykyistä sijaintia", sv: "Använd nuvarande plats", no: "Bruk nåværende posisjon", da: "Brug nuværende placering", en: "Use current location" },
  "location.searchPlaceholder": { fi: "Etsi paikkakuntaa (esim. Tampere)...", sv: "Sök ort (t.ex. Stockholm)...", no: "Søk sted (f.eks. Oslo)...", da: "Søg by (f.eks. København)...", en: "Search city (e.g. Helsinki)..." },
  "location.updating": { fi: "Päivitetään säätietoja...", sv: "Uppdaterar väderdata...", no: "Oppdaterer værdata...", da: "Opdaterer vejrdata...", en: "Updating weather data..." },
  "location.notFound": { fi: "Hups! Säätietoja ei löytynyt. Tarkista kirjoitusasu.", sv: "Hoppsan! Väderdata hittades inte. Kontrollera stavningen.", no: "Ops! Værdata ble ikke funnet. Sjekk stavemåten.", da: "Ups! Vejrdata blev ikke fundet. Tjek stavemåden.", en: "Oops! Weather data not found. Check the spelling." },
  "location.geoError": { fi: "Paikannus epäonnistui. Tarkista selaimen asetukset.", sv: "Positionering misslyckades. Kontrollera webbläsarens inställningar.", no: "Posisjonsbestemmelse mislyktes. Sjekk nettleserinnstillingene.", da: "Positionering mislykkedes. Tjek browserindstillingerne.", en: "Geolocation failed. Check browser settings." },
  "location.geoNotSupported": { fi: "Selaimesi ei tue paikannusta.", sv: "Din webbläsare stöder inte positionering.", no: "Nettleseren din støtter ikke posisjonsbestemmelse.", da: "Din browser understøtter ikke positionering.", en: "Your browser does not support geolocation." },
  "location.noConnection": { fi: "Ei yhteyttä, näytetään viimeisin tallennettu sää.", sv: "Ingen anslutning, visar senast sparad väderdata.", no: "Ingen tilkobling, viser sist lagret værdata.", da: "Ingen forbindelse, viser sidst gemte vejrdata.", en: "No connection, showing last saved weather." },
  "location.testData": { fi: "API ei ole vielä käytettävissä — näytetään testisäätiedot.", sv: "API är inte tillgängligt ännu — visar testväderdata.", no: "API er ikke tilgjengelig ennå — viser testvärdata.", da: "API er ikke tilgængeligt endnu — viser testvejrdata.", en: "API not available yet — showing test weather data." },
  "location.coordsNotFound": { fi: "Sijaintiin perustuvia säätietoja ei löytynyt.", sv: "Platsbaserad väderdata hittades inte.", no: "Stedsbasert værdata ble ikke funnet.", da: "Stedsbaseret vejrdata blev ikke fundet.", en: "Location-based weather data not found." },

  // Weather card
  "weather.feelsLike": { fi: "Tuntuu kuin", sv: "Känns som", no: "Føles som", da: "Føles som", en: "Feels like" },
  "weather.country": { fi: "Suomi", sv: "Sverige", no: "Norge", da: "Danmark", en: "Finland" },
  "weather.justUpdated": { fi: "Juuri päivitetty", sv: "Nyss uppdaterad", no: "Nettopp oppdatert", da: "Lige opdateret", en: "Just updated" },
  "weather.updatedAgo": { fi: "Päivitetty {min} min sitten", sv: "Uppdaterad {min} min sedan", no: "Oppdatert {min} min siden", da: "Opdateret {min} min siden", en: "Updated {min} min ago" },
  "weather.refreshNow": { fi: "Päivitä nyt", sv: "Uppdatera nu", no: "Oppdater nå", da: "Opdater nu", en: "Refresh now" },
  "weather.rain": { fi: "Sade", sv: "Regn", no: "Regn", da: "Regn", en: "Rain" },
  "weather.today": { fi: "Tänään", sv: "Idag", no: "I dag", da: "I dag", en: "Today" },

  // Morning summary
  "morning.title": { fi: "☀️ Vinkki aamuun", sv: "☀️ Morgontips", no: "☀️ Morgentips", da: "☀️ Morgentip", en: "☀️ Morning tip" },
  "morning.loading": { fi: "Haetaan päivän suosituksia...", sv: "Hämtar dagens rekommendationer...", no: "Henter dagens anbefalinger...", da: "Henter dagens anbefalinger...", en: "Fetching today's recommendations..." },
  "morning.rainStart": { fi: "Säävahti huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Vädervakten märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", no: "Værpassen la merke til: regn begynner ca. kl {time}. Husk regnklær til barnehagen!", da: "Vejrvagten bemærkede: regn begynder ca. kl {time}. Husk regntøj til børnehaven!", en: "Säävahti noticed: rain starts around {time}. Remember rain gear for daycare!" },
  "morning.rainStart.school": { fi: "Säävahti huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Vädervakten märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", no: "Værpassen la merke til: regn begynner ca. kl {time}. Husk regnklær til skolen!", da: "Vejrvagten bemærkede: regn begynder ca. kl {time}. Husk regntøj til skolen!", en: "Säävahti noticed: rain starts around {time}. Remember rain gear for school!" },
  "morning.rainDaycare": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", no: "Regn begynner ca. kl {time}. Husk regnklær til barnehagen!", da: "Regn begynder ca. kl {time}. Husk regntøj til børnehaven!", en: "Rain starts around {time}. Remember rain gear for daycare!" },
  "morning.rainDaycare.school": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", no: "Regn begynner ca. kl {time}. Husk regnklær til skolen!", da: "Regn begynder ca. kl {time}. Husk regntøj til skolen!", en: "Rain starts around {time}. Remember rain gear for school!" },
  "morning.freezing": { fi: "Säävahti huomasi: tie on liukas ja aamu on kylmä, valitse lämpimät kengät.", sv: "Vädervakten märkte: vägen är hal och morgonen kall, välj varma skor.", no: "Værpassen la merke til: veien er glatt og morgenen kald, velg varme sko.", da: "Vejrvagten bemærkede: vejen er glat og morgenen kold, vælg varme sko.", en: "Säävahti noticed: roads are slippery and the morning is cold, choose warm shoes." },
  "morning.uvHigh": { fi: "Säävahti huomasi: UV-indeksi nousee yli 3 tänään. Muista aurinkorasva lapselle!", sv: "Vädervakten märkte: UV-index stiger över 3 idag. Kom ihåg solskyddskräm!", no: "Værpassen la merke til: UV-indeksen stiger over 3 i dag. Husk solkrem til barnet!", da: "Vejrvagten bemærkede: UV-indeks stiger over 3 i dag. Husk solcreme til barnet!", en: "Säävahti noticed: UV index rises above 3 today. Remember sunscreen for the child!" },
  "morning.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder.", no: "Vinden gjør været bitende ({speed} m/s), velg vindtette klær.", da: "Vinden gør vejret bidende ({speed} m/s), vælg vindtæt tøj.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing." },
  "morning.calmDay": { fi: "Sää on vakaa, nauti päivästä! Normaalit kauden vaatteet riittävät. 🌤️", sv: "Vädret är stabilt, njut av dagen! Normala säsongskläder räcker. 🌤️", no: "Været er stabilt, nyt dagen! Normale sesongklær holder. 🌤️", da: "Vejret er stabilt, nyd dagen! Normale sæsontøj er nok. 🌤️", en: "Weather is stable, enjoy the day! Normal seasonal clothes will do. 🌤️" },

  // Night alert
  "night.title": { fi: "🌙 Ilta-muistutus", sv: "🌙 Kvällspåminnelse", no: "🌙 Kveldspåminnelse", da: "🌙 Aftenpåmindelse", en: "🌙 Evening reminder" },
  "night.freezing": { fi: "Huomiseksi pakastuu ({from}° → {to}°), etsi toppahousut valmiiksi!", sv: "Det fryser i morgon ({from}° → {to}°), plocka fram täckbyxor!", no: "Det fryser i morgen ({from}° → {to}°), finn frem varmebuksene!", da: "Det fryser i morgen ({from}° → {to}°), find varmebukserne frem!", en: "Freezing tomorrow ({from}° → {to}°), get snow trousers ready!" },
  "night.hardFrost": { fi: "Yöllä kireä pakkanen ({temp}°), jätä vaatteet eteiseen valmiiksi!", sv: "Hård frost i natt ({temp}°), lägg kläderna i hallen!", no: "Hard frost i natt ({temp}°), legg klærne klare i gangen!", da: "Hård frost i nat ({temp}°), læg tøjet klar i entréen!", en: "Hard frost tonight ({temp}°), lay out clothes in the hallway!" },
  "night.tomorrowColder": { fi: "Säävahti huomasi: huominen on selvästi kylmempi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Vädervakten märkte: i morgon blir det betydligt kallare ({today}° → {tomorrow}°). Förbered klädombyte!", no: "Værpassen la merke til: i morgen blir det mye kaldere ({today}° → {tomorrow}°). Forbered klesbytte!", da: "Vejrvagten bemærkede: i morgen bliver det meget koldere ({today}° → {tomorrow}°). Forbered tøjskifte!", en: "Säävahti noticed: tomorrow is much colder than today ({today}° → {tomorrow}°). Prepare for a clothing change!" },
  "night.tomorrowWarmer": { fi: "Säävahti huomasi: huominen on selvästi lämpimämpi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Vädervakten märkte: i morgon blir det betydligt varmare ({today}° → {tomorrow}°). Förbered klädombyte!", no: "Værpassen la merke til: i morgen blir det mye varmere ({today}° → {tomorrow}°). Forbered klesbytte!", da: "Vejrvagten bemærkede: i morgen bliver det meget varmere ({today}° → {tomorrow}°). Forbered tøjskifte!", en: "Säävahti noticed: tomorrow is much warmer than today ({today}° → {tomorrow}°). Prepare for a clothing change!" },
  "night.tomorrowRain": { fi: "Huomenna tarvitaan kuravarusteita, tarkista että ne ovat repussa.", sv: "I morgon behövs regnutrustning, kontrollera att den finns i ryggsäcken.", no: "I morgen trengs regnklær, sjekk at de er i sekken.", da: "I morgen skal der bruges regntøj, tjek at det er i tasken.", en: "Rain gear needed tomorrow, check that it's in the backpack." },
  "night.dryGear": { fi: "Muista ottaa märät varusteet ja kengät kuivumaan! 👟", sv: "Kom ihåg att torka blöta kläder och skor! 👟", no: "Husk å tørke våte klær og sko! 👟", da: "Husk at tørre vådt tøj og sko! 👟", en: "Remember to dry wet gear and shoes! 👟" },
  "night.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää huomenna.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder i morgon.", no: "Vinden gjør været bitende ({speed} m/s), velg vindtette klær i morgen.", da: "Vinden gør vejret bidende ({speed} m/s), vælg vindtæt tøj i morgen.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing tomorrow." },

  // Age groups
  "age.title": { fi: "Lapsen ikäryhmä", sv: "Barnets åldersgrupp", no: "Barnets aldersgruppe", da: "Barnets aldersgruppe", en: "Child's age group" },
  "age.vauva": { fi: "Vauva", sv: "Baby", no: "Baby", da: "Baby", en: "Baby" },
  "age.taapero": { fi: "Taapero", sv: "Småbarn", no: "Småbarn", da: "Småbarn", en: "Toddler" },
  "age.leikki-ikäinen": { fi: "Leikki-ikäinen", sv: "Förskoleålder", no: "Førskolealder", da: "Førskolealder", en: "Preschooler" },
  "age.koululainen": { fi: "Koululainen", sv: "Skolbarn", no: "Skolebarn", da: "Skolebarn", en: "School age" },
  "age.vauva.ages": { fi: "0–1 v", sv: "0–1 år", no: "0–1 år", da: "0–1 år", en: "0–1 yr" },
  "age.taapero.ages": { fi: "1–3 v", sv: "1–3 år", no: "1–3 år", da: "1–3 år", en: "1–3 yr" },
  "age.leikki-ikäinen.ages": { fi: "3–6 v", sv: "3–6 år", no: "3–6 år", da: "3–6 år", en: "3–6 yr" },
  "age.koululainen.ages": { fi: "7–10 v", sv: "7–10 år", no: "7–10 år", da: "7–10 år", en: "7–10 yr" },

  // Clothing card
  "clothing.title": { fi: "🧥 Pukeutumissuositus", sv: "🧥 Klädrekommendation", no: "🧥 Klesanbefaling", da: "🧥 Tøjanbefaling", en: "🧥 Clothing recommendation" },

  // Checklist
  "checklist.title": { fi: "🎒 Päiväkoti-reppu", sv: "🎒 Dagisryggsäck", no: "🎒 Barnehagesekk", da: "🎒 Børnehavetaske", en: "🎒 Daycare backpack" },
  "checklist.title.school": { fi: "🎒 Koulureppu", sv: "🎒 Skolryggsäck", no: "🎒 Skolesekk", da: "🎒 Skoletaske", en: "🎒 School backpack" },
  "checklist.allPacked": { fi: "✅ Kaikki pakattu!", sv: "✅ Allt packat!", no: "✅ Alt pakket!", da: "✅ Alt pakket!", en: "✅ All packed!" },
  "checklist.weatherGear": { fi: "🌦️ Säänmukaiset varusteet", sv: "🌦️ Väderanpassad utrustning", no: "🌦️ Værtilpasset utstyr", da: "🌦️ Vejrtilpasset udstyr", en: "🌦️ Weather-appropriate gear" },
  "checklist.spareClothes": { fi: "👕 Perusvarusteet", sv: "👕 Basutrustning", no: "👕 Basisutstyr", da: "👕 Basisudstyr", en: "👕 Essentials" },
  "checklist.miscItems": { fi: "🎲 Satunnaiset tavarat", sv: "🎲 Övriga saker", no: "🎲 Diverse ting", da: "🎲 Diverse ting", en: "🎲 Miscellaneous items" },
  "checklist.myNote": { fi: "📝 Oma muistiinpano", sv: "📝 Min anteckning", no: "📝 Mitt notat", da: "📝 Min note", en: "📝 My note" },
  "checklist.notePlaceholder": { fi: "Kirjoita tähän oma tavara tai muistutus…", sv: "Skriv din egen sak eller påminnelse här…", no: "Skriv din egen ting eller påminnelse her…", da: "Skriv din egen ting eller påmindelse her…", en: "Write your own item or reminder here…" },
  "checklist.fridayReminder": { fi: "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!", sv: "📋 Kom ihåg att tömma ryggsäcken inför helgen och kontrollera ombyteskläderna!", no: "📋 Husk å tømme sekken til helgen og sjekke bytteklærne!", da: "📋 Husk at tømme tasken til weekenden og tjekke skiftetøjet!", en: "📋 Remember to empty the backpack for the weekend and check spare clothes!" },
  "checklist.sundayReminder": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till dagis!", no: "👕 I morgen er det mandag — husk å pakke bytteklær til barnehagen!", da: "👕 I morgen er det mandag — husk at pakke skiftetøj til børnehaven!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for daycare!" },
  "checklist.sundayReminder.school": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet kouluun!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till skolan!", no: "👕 I morgen er det mandag — husk å pakke bytteklær til skolen!", da: "👕 I morgen er det mandag — husk at pakke skiftetøj til skolen!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for school!" },
  "checklist.mondayReminder": { fi: "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till dagis idag!", no: "👕 Husk å ta med bytteklærne tilbake til barnehagen i dag!", da: "👕 Husk at tage skiftetøjet med tilbage til børnehaven i dag!", en: "👕 Remember to bring spare clothes back to daycare today!" },
  "checklist.mondayReminder.school": { fi: "👕 Muista viedä vaihtovaatteet takaisin kouluun tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till skolan idag!", no: "👕 Husk å ta med bytteklærne tilbake til skolen i dag!", da: "👕 Husk at tage skiftetøjet med tilbage til skolen i dag!", en: "👕 Remember to bring spare clothes back to school today!" },

  // Checklist items
  "item.varahousut": { fi: "Varahousut", sv: "Reservbyxor", no: "Reservebukser", da: "Reservebukser", en: "Spare trousers" },
  "item.varapaita": { fi: "Varapaita", sv: "Reservtröja", no: "Reservetrøye", da: "Reservetrøje", en: "Spare shirt" },
  "item.alusvaatteet": { fi: "Alusvaatteet (2 kpl)", sv: "Underkläder (2 st)", no: "Undertøy (2 stk)", da: "Undertøj (2 stk)", en: "Underwear (2 pcs)" },
  "item.varahanskat": { fi: "Varahanskat", sv: "Reservvantar", no: "Reservehansker", da: "Reservehandsker", en: "Spare gloves" },
  "item.vaihtosukat": { fi: "Vaihtosukat", sv: "Reservstrumpor", no: "Reservesokker", da: "Reservesokker", en: "Spare socks" },
  "item.vaippapaketti": { fi: "Vaippapaketti", sv: "Blöjpaket", no: "Blepakke", da: "Blepakke", en: "Diaper pack" },
  "item.tutti": { fi: "Tutti", sv: "Napp", no: "Smokk", da: "Sut", en: "Pacifier" },
  "item.unilelu": { fi: "Unilelu", sv: "Gossedjur", no: "Kosedyr", da: "Krammedyr", en: "Comfort toy" },
  "item.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", no: "Solkrem", da: "Solcreme", en: "Sunscreen" },
  "item.juomapullo": { fi: "Juomapullo", sv: "Vattenflaska", no: "Drikkeflaske", da: "Drikkeflaske", en: "Water bottle" },
  "item.omalelu": { fi: "Oma lelu", sv: "Egen leksak", no: "Egen leke", da: "Eget legetøj", en: "Own toy" },
  "item.välipala": { fi: "Välipala", sv: "Mellanmål", no: "Mellommåltid", da: "Mellemmåltid", en: "Snack" },
  "item.avaimet": { fi: "Avaimet", sv: "Nycklar", no: "Nøkler", da: "Nøgler", en: "Keys" },
  "item.uikkarit": { fi: "Uikkarit & pyyhe", sv: "Badkläder & handduk", no: "Badetøy & håndkle", da: "Badetøj & håndklæde", en: "Swimwear & towel" },
  "item.sisäliikunta": { fi: "Sisäliikuntavaatteet & pyyhe", sv: "Inomhusidrottskläder & handduk", no: "Innendørs treningstøy & håndkle", da: "Indendørs sportstøj & håndklæde", en: "Indoor sports clothes & towel" },
  "item.lippis": { fi: "Lippis/Hattu", sv: "Keps/Hatt", no: "Caps/Hatt", da: "Kasket/Hat", en: "Cap/Hat" },
  "item.kuravarusteet": { fi: "Kuravarusteet", sv: "Regnutrustning", no: "Regnklær", da: "Regntøj", en: "Rain gear" },
  "item.vaihtohanskat": { fi: "Vaihtohanskat", sv: "Extravantar", no: "Ekstrahansker", da: "Ekstrahandsker", en: "Extra gloves" },
  "item.lamminkerrasto": { fi: "Lämmin kerrasto", sv: "Varmt underställ", no: "Varmt undertøy", da: "Varmt undertøj", en: "Warm base layer" },
  "item.luistimet": { fi: "Luistimet & kypärä", sv: "Skridskor & hjälm", no: "Skøyter & hjelm", da: "Skøjter & hjelm", en: "Ice skates & helmet" },

  // Weekdays
  "weekday.0": { fi: "Sunnuntai", sv: "Söndag", no: "Søndag", da: "Søndag", en: "Sunday" },
  "weekday.1": { fi: "Maanantai", sv: "Måndag", no: "Mandag", da: "Mandag", en: "Monday" },
  "weekday.2": { fi: "Tiistai", sv: "Tisdag", no: "Tirsdag", da: "Tirsdag", en: "Tuesday" },
  "weekday.3": { fi: "Keskiviikko", sv: "Onsdag", no: "Onsdag", da: "Onsdag", en: "Wednesday" },
  "weekday.4": { fi: "Torstai", sv: "Torsdag", no: "Torsdag", da: "Torsdag", en: "Thursday" },
  "weekday.5": { fi: "Perjantai", sv: "Fredag", no: "Fredag", da: "Fredag", en: "Friday" },
  "weekday.6": { fi: "Lauantai", sv: "Lördag", no: "Lørdag", da: "Lørdag", en: "Saturday" },

  // Tomorrow forecast
  "tomorrow.title": { fi: "Huomisen sää — Ennuste", sv: "Morgondagens väder — Prognos", no: "Morgendagens vær — Prognose", da: "Morgendagens vejr — Prognose", en: "Tomorrow's weather — Forecast" },
  "tomorrow.rainProb": { fi: "Sateen todennäköisyys", sv: "Regnchans", no: "Regnsjanse", da: "Regnchance", en: "Rain probability" },
  "tomorrow.prepTitle": { fi: "Valmistele huomiseksi — Poimi valmiiksi:", sv: "Förbered till i morgon — Plocka fram:", no: "Forbered til i morgen — Plukk frem:", da: "Forbered til i morgen — Find frem:", en: "Prepare for tomorrow — Get ready:" },
  "tomorrow.colderWarning": { fi: "Huomiseksi kylmenee, muista lämpimämpi kerrasto.", sv: "Det blir kallare i morgon, kom ihåg varmare underställ.", no: "Det blir kaldere i morgen, husk varmere undertøy.", da: "Det bliver koldere i morgen, husk varmere undertøj.", en: "It gets colder tomorrow, remember warmer layers." },
  "tomorrow.rainWarning": { fi: "Huomenna sataa, muista viedä kuravarusteet päiväkotiin.", sv: "Det regnar i morgon, kom ihåg att ta med regnutrustning till dagis.", no: "Det regner i morgen, husk å ta med regnklær til barnehagen.", da: "Det regner i morgen, husk at tage regntøj med til børnehaven.", en: "Rain expected tomorrow, remember rain gear for daycare." },
  "tomorrow.morningGear": { fi: "Aamun varusteet", sv: "Morgonens utrustning", no: "Morgenens utstyr", da: "Morgenens udstyr", en: "Morning gear" },
  "tomorrow.afternoonGear": { fi: "Iltapäivän varusteet", sv: "Eftermiddagens utrustning", no: "Ettermiddagens utstyr", da: "Eftermiddagens udstyr", en: "Afternoon gear" },

  // AI Analysis
  "ai.title": { fi: "Säävahdin analyysi", sv: "Väderpyttens analys", no: "Værpassens analyse", da: "Vejrvagtens analyse", en: "Säävahti's analysis" },
  "ai.ageGroup": { fi: "Ikäryhmä", sv: "Åldersgrupp", no: "Aldersgruppe", da: "Aldersgruppe", en: "Age group" },
  "ai.analyzing": { fi: "Analysoidaan...", sv: "Analyserar...", no: "Analyserer...", da: "Analyserer...", en: "Analyzing..." },
  "ai.updated": { fi: "Päivitetty", sv: "Uppdaterad", no: "Oppdatert", da: "Opdateret", en: "Updated" },
  "ai.rainTip": { fi: "🌧️ Huomataan lähestyvä sadealue klo 14. Suosittelen kuravarusteita jo aamusta, jotta ulkoilu ei keskeydy.", sv: "🌧️ Vi ser ett regnområde som närmar sig kl 14. Jag rekommenderar regnutrustning redan på morgonen så att utevistelsen inte avbryts.", no: "🌧️ Vi ser et regnområde som nærmer seg kl 14. Jeg anbefaler regnklær allerede fra morgenen, slik at utetiden ikke avbrytes.", da: "🌧️ Vi ser et regnområde der nærmer sig kl 14. Jeg anbefaler regntøj allerede fra morgenen, så udetiden ikke afbrydes.", en: "🌧️ A rain area is approaching around 14:00. I recommend rain gear from the morning so outdoor time isn't interrupted." },
  "ai.hardWindTip": { fi: "💨 Tänään on kova tuuli ({speed} m/s). Vaikka mittari näyttää {temp}°C, viima tuntuu pakkaselta. Valitse tuulenpitävä kuorikerros.", sv: "💨 Det blåser kraftigt idag ({speed} m/s). Även om termometern visar {temp}°C känns det kallare med vinden. Välj ett vindtätt skalplagg.", no: "💨 Det blåser kraftig i dag ({speed} m/s). Selv om termometeret viser {temp}°C, føles det kaldere med vinden. Velg et vindtett skallplagg.", da: "💨 Det blæser kraftigt i dag ({speed} m/s). Selvom termometeret viser {temp}°C, føles det koldere med vinden. Vælg et vindtæt skallag.", en: "💨 Strong wind today ({speed} m/s). Even though it shows {temp}°C, wind chill makes it feel freezing. Choose a windproof shell layer." },
  "ai.moderateWindTip": { fi: "💨 Kohtalainen tuuli ({speed} m/s) viilentää tuntuvasti. Tuulenpitävä kerros on hyvä valinta.", sv: "💨 Måttlig vind ({speed} m/s) kyler ner märkbart. Ett vindtätt lager är ett bra val.", no: "💨 Moderat vind ({speed} m/s) kjøler ned merkbart. Et vindtett lag er et godt valg.", da: "💨 Moderat vind ({speed} m/s) afkøler mærkbart. Et vindtæt lag er et godt valg.", en: "💨 Moderate wind ({speed} m/s) cools noticeably. A windproof layer is a good choice." },
  "ai.layeringTip": { fi: "🌡️ Aamu on kylmä ({feelsLike}°C tuntuu), mutta iltapäivällä lämpötila nousee ({temp}°C). Kerrospukeutuminen on tänään avainasemassa.", sv: "🌡️ Morgonen är kall (känns som {feelsLike}°C), men på eftermiddagen stiger temperaturen ({temp}°C). Lagerklädsel är nyckeln idag.", no: "🌡️ Morgenen er kald (føles som {feelsLike}°C), men om ettermiddagen stiger temperaturen ({temp}°C). Lagpåkledning er nøkkelen i dag.", da: "🌡️ Morgenen er kold (føles som {feelsLike}°C), men om eftermiddagen stiger temperaturen ({temp}°C). Lagpåklædning er nøglen i dag.", en: "🌡️ Morning is cold (feels like {feelsLike}°C), but afternoon warms up ({temp}°C). Layering is key today." },
  "ai.uvTip": { fi: "☀️ UV-indeksi on korkea ({uvi}). Aurinko paistaa voimakkaasti. Suojaa lapsen iho aurinkorasvalla, vaikka tuntuisi viileältä. Lippis ja aurinkolasit mukaan{age}!", sv: "☀️ UV-index är högt ({uvi}). Solen skiner starkt. Skydda barnets hud med solskyddskräm, även om det känns svalt. Ta med keps och solglasögon{age}!", no: "☀️ UV-indeksen er høy ({uvi}). Solen skinner sterkt. Beskytt barnets hud med solkrem, selv om det føles kjølig. Ta med caps og solbriller{age}!", da: "☀️ UV-indeks er højt ({uvi}). Solen skinner kraftigt. Beskyt barnets hud med solcreme, selvom det føles køligt. Tag kasket og solbriller med{age}!", en: "☀️ UV index is high ({uvi}). The sun is strong. Protect the child's skin with sunscreen, even if it feels cool. Bring cap and sunglasses{age}!" },
  "ai.sunnyUvTip": { fi: "☀️ Korkea UV-indeksi. Muista aurinkorasva ja lippis suojaksi.", sv: "☀️ Högt UV-index. Kom ihåg solskyddskräm och keps som skydd.", no: "☀️ Høy UV-indeks. Husk solkrem og caps som beskyttelse.", da: "☀️ Høj UV-indeks. Husk solcreme og kasket som beskyttelse.", en: "☀️ High UV index. Remember sunscreen and a cap for protection." },
  "ai.calmDay": { fi: "✅ Tänään on rauhallinen sääpäivä ({temp}°C, {desc}). Normaalit kauden vaatteet riittävät hyvin.", sv: "✅ En lugn väderdag idag ({temp}°C, {desc}). Normala säsongskläder räcker bra.", no: "✅ En rolig værdag i dag ({temp}°C, {desc}). Normale sesongklær holder fint.", da: "✅ En rolig vejrdag i dag ({temp}°C, {desc}). Normalt sæsontøj er fint.", en: "✅ A calm weather day ({temp}°C, {desc}). Normal seasonal clothing will do just fine." },
  "ai.mudTip": { fi: "💡 Vaikka nyt on poutaa, maa on vielä märkä. Kurahousut ovat hyvä valinta suojaamaan vaatteet hiekkalaatikolla.", sv: "💡 Även om det är uppehåll nu är marken fortfarande blöt. Regnbyxor är ett bra val för att skydda kläderna i sandlådan.", no: "💡 Selv om det er opphold nå, er bakken fortsatt våt. Regnbukser er et godt valg for å beskytte klærne i sandkassen.", da: "💡 Selvom det er tørvejr nu, er jorden stadig våd. Regnbukser er et godt valg for at beskytte tøjet i sandkassen.", en: "💡 Even though it's dry now, the ground is still wet. Rain trousers are a good choice to protect clothes at the sandbox." },
  "ai.gapTip": { fi: "🌡️ Aamu on kylmä ({amTemp}°C), mutta iltapäivällä tarkenee vähemmällä ({pmTemp}°C). Muista kerrospukeutuminen ja pakkaa ohuempi paita reppuun.", sv: "🌡️ Morgonen är kall ({amTemp}°C), men på eftermiddagen klarar man sig med mindre ({pmTemp}°C). Kom ihåg lagerklädsel och packa en tunnare tröja i ryggsäcken.", no: "🌡️ Morgenen er kald ({amTemp}°C), men om ettermiddagen klarer man seg med mindre ({pmTemp}°C). Husk lagpåkledning og pakk en tynnere trøye i sekken.", da: "🌡️ Morgenen er kold ({amTemp}°C), men om eftermiddagen klarer man sig med mindre ({pmTemp}°C). Husk lagpåklædning og pak en tyndere trøje i tasken.", en: "🌡️ Morning is cold ({amTemp}°C), but afternoon is warmer ({pmTemp}°C). Remember layering and pack a lighter shirt in the backpack." },
  "ai.layerZoneTip": { fi: "🧤 Suosi tänään kerrospukeutumista. Ohut villakerros väliin pitää lapsen lämpimänä ilman hikoilua.", sv: "🧤 Föredra lagerklädsel idag. Ett tunt ullager emellan håller barnet varmt utan att svettas.", no: "🧤 Foretrekk lagpåkledning i dag. Et tynt ullag imellom holder barnet varmt uten å svette.", da: "🧤 Foretræk lagpåklædning i dag. Et tyndt uldlag imellem holder barnet varmt uden at svede.", en: "🧤 Layer up today. A thin wool layer in between keeps the child warm without sweating." },
  "ai.windChillTip": { fi: "🌬️ Tuuli tekee säästä purevan ({speed} m/s), suosi tuulenpitävää kuorikerrosta.", sv: "🌬️ Vinden gör vädret bitande ({speed} m/s), välj vindtätt skalplagg.", no: "🌬️ Vinden gjør været bitende ({speed} m/s), velg vindtett skallplagg.", da: "🌬️ Vinden gør vejret bidende ({speed} m/s), vælg vindtæt skallag.", en: "🌬️ Wind makes the weather biting ({speed} m/s), choose a windproof shell layer." },
  "ai.uvReminderTip": { fi: "☀️ Aurinko on voimakasta (UV {uvi}). Muista aurinkorasva ja hattu.", sv: "☀️ Solen är stark (UV {uvi}). Kom ihåg solskyddskräm och hatt.", no: "☀️ Solen er sterk (UV {uvi}). Husk solkrem og hatt.", da: "☀️ Solen er stærk (UV {uvi}). Husk solcreme og hat.", en: "☀️ The sun is strong (UV {uvi}). Remember sunscreen and a hat." },
  "ai.mudTipWet": { fi: "💡 Maa on yhä märkä sateen jäljiltä. Kurahousut suojaavat vaatteet leikeissä.", sv: "💡 Marken är fortfarande blöt efter regnet. Regnbyxor skyddar kläderna under leken.", no: "💡 Bakken er fortsatt våt etter regnet. Regnbukser beskytter klærne under leken.", da: "💡 Jorden er stadig våd efter regnen. Regnbukser beskytter tøjet under legen.", en: "💡 The ground is still wet from rain. Rain trousers protect clothes during play." },
  "ai.morningGapHighlight": { fi: "⭐ Vinkki aamuun: Aamu on kylmä ({amTemp}°C), mutta iltapäivällä lämpenee huomattavasti ({pmTemp}°C). Pakkaa ohuempi paita reppuun ja suosi kerrospukeutumista.", sv: "⭐ Morgontips: Morgonen är kall ({amTemp}°C), men det blir betydligt varmare på eftermiddagen ({pmTemp}°C). Packa en tunnare tröja i ryggsäcken och satsa på lagerklädsel.", no: "⭐ Morgentips: Morgenen er kald ({amTemp}°C), men det blir mye varmere om ettermiddagen ({pmTemp}°C). Pakk en tynnere trøye i sekken og sats på lagpåkledning.", da: "⭐ Morgentip: Morgenen er kold ({amTemp}°C), men det bliver meget varmere om eftermiddagen ({pmTemp}°C). Pak en tyndere trøje i tasken og sats på lagpåklædning.", en: "⭐ Morning tip: The morning is cold ({amTemp}°C), but it warms up significantly in the afternoon ({pmTemp}°C). Pack a lighter shirt in the backpack and layer up." },
  "ai.springTip": { fi: "☀️ Kevätaurinko lämmittää! Vaikka lämpömittari näyttää lievää pakkasta, välikausivaatteet hyvällä välikerroksella ovat nyt paras valinta aktiiviseen ulkoiluun.", sv: "☀️ Vårsolen värmer! Även om termometern visar lätt frost är mellansäsongskläder med ett bra mellanlager nu det bästa valet för aktiv utevistelse.", no: "☀️ Vårsolen varmer! Selv om termometeret viser lett frost, er mellomsesongsklær med et godt mellomlag nå det beste valget for aktiv utelek.", da: "☀️ Forårssolen varmer! Selvom termometeret viser let frost, er mellemsæsontøj med et godt mellemlag nu det bedste valg til aktiv udeleg.", en: "☀️ The spring sun is warming things up! Even though the thermometer shows a slight frost, mid-season gear with a good mid-layer is now the best choice for active play." },
  "ai.springWindTip": { fi: "💨 Vaikka tuuli on pureva, kevätaurinko lämmittää jo tehokkaasti. Pysytään välikausivaatteissa, mutta muista lisätä lämmin välikerros (villa/fleece) tuulensuojaksi.", sv: "💨 Även om vinden biter, värmer vårsolen redan effektivt. Vi håller oss till skalkläder, men glöm inte ett varmt mellanlager (ull/fleece) som vindskydd.", no: "💨 Selv om vinden biter, varmer vårsolen allerede effektivt. Hold deg til skallklær, men husk et varmt mellomlag (ull/fleece) som vindskjerm.", da: "💨 Selvom vinden bider, varmer forårssolen allerede effektivt. Hold dig til skaltøj, men husk et varmt mellemlag (uld/fleece) som vindskærm.", en: "💨 Even though the wind is biting, the spring sun is already warming effectively. Stick with mid-season gear, but remember to add a warm mid-layer (wool/fleece) for wind protection." },
  "ai.hasSpecialTip": { fi: "Erityishuomio", sv: "Specialtips", no: "Spesialtips", da: "Specialtip", en: "Special tip" },
  "ai.ageLabel.vauva": { fi: " vauvalle", sv: " för babyn", no: " for babyen", da: " for babyen", en: " for the baby" },
  "ai.ageLabel.taapero": { fi: " taaperolle", sv: " för småbarnet", no: " for småbarnet", da: " for småbarnet", en: " for the toddler" },
  "ai.ageLabel.leikki-ikäinen": { fi: " leikki-ikäiselle", sv: " för förskolebarnet", no: " for førskolebarnet", da: " for førskolebarnet", en: " for the preschooler" },
  "ai.ageLabel.koululainen": { fi: " koululaiselle", sv: " för skolbarnet", no: " for skolebarnet", da: " for skolebarnet", en: " for the school child" },

  // UV Alert
  "uv.veryHigh": { fi: "Erittäin korkea", sv: "Mycket högt", no: "Svært høy", da: "Meget høj", en: "Very high" },
  "uv.high": { fi: "Korkea", sv: "Högt", no: "Høy", da: "Høj", en: "High" },
  "uv.moderate": { fi: "Kohtalainen", sv: "Måttligt", no: "Moderat", da: "Moderat", en: "Moderate" },
  "uv.titleFormat": { fi: "{level} UV-indeksi ({uvi})", sv: "{level} UV-index ({uvi})", no: "{level} UV-indeks ({uvi})", da: "{level} UV-indeks ({uvi})", en: "{level} UV index ({uvi})" },
  "uv.description": { fi: "Muista aurinkorasva ja hattu! Suojaa lapsen iho, silmät ja pää auringolta.", sv: "Kom ihåg solskyddskräm och hatt! Skydda barnets hud, ögon och huvud mot solen.", no: "Husk solkrem og hatt! Beskytt barnets hud, øyne og hode mot solen.", da: "Husk solcreme og hat! Beskyt barnets hud, øjne og hoved mod solen.", en: "Remember sunscreen and a hat! Protect the child's skin, eyes and head from the sun." },

  // Schedule
  "schedule.title.vauva": { fi: "Vauvan", sv: "Babyns", no: "Babyens", da: "Babyens", en: "Baby's" },
  "schedule.title.taapero": { fi: "Taaperon", sv: "Småbarnets", no: "Småbarnets", da: "Småbarnets", en: "Toddler's" },
  "schedule.title.leikki-ikäinen": { fi: "Leikki-ikäisen", sv: "Förskolebarnets", no: "Førskolebarnets", da: "Førskolebarnets", en: "Preschooler's" },
  "schedule.title.koululainen": { fi: "Koululaisen", sv: "Skolbarnets", no: "Skolebarnets", da: "Skolebarnets", en: "School child's" },
  "schedule.weeklySchedule": { fi: "viikko-ohjelma", sv: "veckoschema", no: "ukeplan", da: "ugeplan", en: "weekly schedule" },
  "schedule.addImageDesc": { fi: "Lisää kuva lukujärjestyksestä tai päiväkodin viikko-ohjelmasta", sv: "Lägg till bild på schemat eller dagisens veckoprogram", no: "Legg til bilde av timeplanen eller barnehagens ukeplan", da: "Tilføj billede af skemaet eller børnehavens ugeplan", en: "Add a photo of the schedule or daycare weekly program" },
  "schedule.saving": { fi: "Tallennetaan...", sv: "Sparar...", no: "Lagrer...", da: "Gemmer...", en: "Saving..." },
  "schedule.saved": { fi: "Kuva tallennettu!", sv: "Bilden sparad!", no: "Bildet lagret!", da: "Billedet gemt!", en: "Image saved!" },
  "schedule.saveError": { fi: "Hups! Kuva on liian suuri tai tallennus epäonnistui. Yritä pienemmällä kuvalla.", sv: "Hoppsan! Bilden är för stor eller sparningen misslyckades. Prova med en mindre bild.", no: "Ops! Bildet er for stort eller lagringen mislyktes. Prøv med et mindre bilde.", da: "Ups! Billedet er for stort eller gemningen mislykkedes. Prøv med et mindre billede.", en: "Oops! Image is too large or saving failed. Try a smaller image." },
  "schedule.viewLarge": { fi: "Katso isona", sv: "Visa i fullstorlek", no: "Vis i full størrelse", da: "Vis i fuld størrelse", en: "View full size" },
  "schedule.changeImage": { fi: "Vaihda kuva", sv: "Byt bild", no: "Bytt bilde", da: "Skift billede", en: "Change image" },
  "schedule.removeImage": { fi: "Poista kuva", sv: "Ta bort bild", no: "Fjern bilde", da: "Fjern billede", en: "Remove image" },
  "schedule.addSchedule": { fi: "Lisää lukujärjestys", sv: "Lägg till schema", no: "Legg til timeplan", da: "Tilføj skema", en: "Add schedule" },
  "schedule.takeOrSelect": { fi: "Ota kuva tai valitse galleriasta", sv: "Ta en bild eller välj från galleriet", no: "Ta et bilde eller velg fra galleriet", da: "Tag et billede eller vælg fra galleriet", en: "Take a photo or select from gallery" },
  "schedule.doubleTapReset": { fi: "Kaksoisnapautus nollataksesi", sv: "Dubbeltryck för att återställa", no: "Dobbelttrykk for å tilbakestille", da: "Dobbelttryk for at nulstille", en: "Double tap to reset" },
  "schedule.pinchToZoom": { fi: "Nipistä zoomataksesi", sv: "Nyp för att zooma", no: "Knip for å zoome", da: "Knib for at zoome", en: "Pinch to zoom" },
  "schedule.close": { fi: "Sulje", sv: "Stäng", no: "Lukk", da: "Luk", en: "Close" },

  // Schedule reminder
  "scheduleReminder.text": { fi: "Tarkista päivän ohjelma kuvasta", sv: "Kontrollera dagens program från bilden", no: "Sjekk dagens program fra bildet", da: "Tjek dagens program fra billedet", en: "Check today's program from the image" },

  // Affiliate
  "affiliate.title": { fi: "Suosittelemme laadukkaita varusteita", sv: "Vi rekommenderar kvalitetsutrustning", no: "Vi anbefaler kvalitetsutstyr", da: "Vi anbefaler kvalitetsudstyr", en: "We recommend quality gear" },
  "affiliate.polarnopyret.desc": { fi: "Polarn O. Pyret – Laatua, joka kestää lapselta toiselle", sv: "Polarn O. Pyret – Kvalitet som håller från barn till barn", no: "Polarn O. Pyret – Kvalitet som varer fra barn til barn", da: "Polarn O. Pyret – Kvalitet der holder fra barn til barn", en: "Polarn O. Pyret – Quality that lasts from child to child" },
  "affiliate.polarnopyret.cta": { fi: "Tutustu ulkoilu- ja arkivaatteisiin", sv: "Upptäck ute- och vardagskläder", no: "Utforsk ute- og hverdagsklær", da: "Udforsk ude- og hverdagstøj", en: "Explore outdoor & everyday clothing" },
  "affiliate.lindex.desc": { fi: "Kestävät ja pehmeät arkivaatteet lapsille", sv: "Hållbara och mjuka vardagskläder för barn", no: "Holdbare og myke hverdagsklær for barn", da: "Holdbart og blødt hverdagstøj til børn", en: "Durable and soft everyday clothes for kids" },
  "affiliate.lindex.cta": { fi: "Katso päivän tarjoukset", sv: "Se dagens erbjudanden", no: "Se dagens tilbud", da: "Se dagens tilbud", en: "See today's deals" },
  "affiliate.disclaimer": {
    fi: "Säävahti suosittelee laadukkaita varusteita arkeen. Linkit ovat mainoslinkkejä, joiden kautta tuet sovelluksen kehitystä.",
    sv: "Väderpytten rekommenderar kvalitetsutrustning för vardagen. Länkarna är annonslänkar som stöder utvecklingen av appen.",
    no: "Værpassen anbefaler kvalitetsutstyr for hverdagen. Lenkene er annonselenker som støtter utviklingen av appen.",
    da: "Vejrvagten anbefaler kvalitetsudstyr til hverdagen. Linkene er reklamelinks der støtter udviklingen af appen.",
    en: "Säävahti recommends quality gear for everyday life. Links are affiliate links that support the app's development."
  },
  "affiliate.adtraction": {
    fi: "Tämä sivusto on vahvistettu Adtraction-verkostoon.",
    sv: "Denna webbplats är verifierad i Adtraction-nätverket.",
    no: "Denne nettsiden er verifisert i Adtraction-nettverket.",
    da: "Denne hjemmeside er verificeret i Adtraction-netværket.",
    en: "This site is verified in the Adtraction network."
  },

  // Feedback
  "feedback.title": { fi: "Anna palautetta", sv: "Ge feedback", no: "Gi tilbakemelding", da: "Giv feedback", en: "Give feedback" },
  "feedback.placeholder": { fi: "Mitä voisimme parantaa?", sv: "Vad kan vi förbättra?", no: "Hva kan vi forbedre?", da: "Hvad kan vi forbedre?", en: "What could we improve?" },
  "feedback.send": { fi: "Lähetä palaute", sv: "Skicka feedback", no: "Send tilbakemelding", da: "Send feedback", en: "Send feedback" },
  "feedback.sending": { fi: "Lähetetään...", sv: "Skickar...", no: "Sender...", da: "Sender...", en: "Sending..." },
  "feedback.thanks": { fi: "Kiitos! Palautteesi on vastaanotettu.", sv: "Tack! Din feedback har mottagits.", no: "Takk! Tilbakemeldingen din er mottatt.", da: "Tak! Din feedback er modtaget.", en: "Thank you! Your feedback has been received." },
  "feedback.thanksDesc": { fi: "Autat meitä tekemään Säävahdista paremman.", sv: "Du hjälper oss att göra Väderpytten bättre.", no: "Du hjelper oss med å gjøre Værpassen bedre.", da: "Du hjælper os med at gøre Vejrvagten bedre.", en: "You're helping us make Säävahti better." },
  "feedback.error": { fi: "Lähetys epäonnistui. Yritä uudelleen.", sv: "Sändningen misslyckades. Försök igen.", no: "Sendingen mislyktes. Prøv igjen.", da: "Afsendelsen mislykkedes. Prøv igen.", en: "Sending failed. Please try again." },

  // Footer
  "footer.copyright": { fi: "© 2024 Säävahti", sv: "© 2024 Väderpytten", no: "© 2024 Værpassen", da: "© 2024 Vejrvagten", en: "© 2024 Säävahti" },
  "footer.privacy": { fi: "Tietosuoja", sv: "Integritetspolicy", no: "Personvern", da: "Privatlivspolitik", en: "Privacy" },
  "footer.contact": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", no: "Kontaktinformasjon", da: "Kontaktoplysninger", en: "Contact" },
  "footer.close": { fi: "Sulje", sv: "Stäng", no: "Lukk", da: "Luk", en: "Close" },
  "footer.privacyTitle": { fi: "Tietosuojaseloste", sv: "Integritetspolicy", no: "Personvernerklæring", da: "Privatlivspolitik", en: "Privacy Policy" },
  "footer.contactTitle": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", no: "Kontaktinformasjon", da: "Kontaktoplysninger", en: "Contact Information" },
  "footer.privacyS1Title": { fi: "1. Rekisterinpitäjä", sv: "1. Registeransvarig", no: "1. Behandlingsansvarlig", da: "1. Dataansvarlig", en: "1. Data Controller" },
  "footer.privacyS1": { fi: "Säävahti-sovellus", sv: "Väderpytten-appen", no: "Værpassen-appen", da: "Vejrvagten-appen", en: "Säävahti app" },
  "footer.privacyS2Title": { fi: "2. Kerättävät tiedot", sv: "2. Insamlade uppgifter", no: "2. Innsamlede opplysninger", da: "2. Indsamlede oplysninger", en: "2. Data Collected" },
  "footer.privacyS2": { fi: "Sovellus tallentaa paikallisesti (selaimen LocalStorage) käyttäjän valitseman kaupungin, ikäryhmävalinnan sekä viikko-ohjelmakuvan. Tietoja ei lähetetä ulkoisille palvelimille.", sv: "Appen sparar lokalt (webbläsarens LocalStorage) användarens valda stad, åldersgrupp och veckoschemabild. Inga uppgifter skickas till externa servrar.", no: "Appen lagrer lokalt (nettleserens LocalStorage) brukerens valgte by, aldersgruppe og ukeplanbilde. Ingen data sendes til eksterne servere.", da: "Appen gemmer lokalt (browserens LocalStorage) brugerens valgte by, aldersgruppe og ugeplanbillede. Ingen data sendes til eksterne servere.", en: "The app stores locally (browser LocalStorage) the selected city, age group, and weekly schedule image. No data is sent to external servers." },
  "footer.privacyS3Title": { fi: "3. Tietojen käyttö", sv: "3. Användning av uppgifter", no: "3. Bruk av opplysninger", da: "3. Brug af oplysninger", en: "3. Use of Data" },
  "footer.privacyS3": { fi: "Tallennettuja tietoja käytetään ainoastaan sovelluksen toiminnallisuuden tarjoamiseen, kuten pukeutumissuositusten näyttämiseen ja viikko-ohjelman säilyttämiseen.", sv: "Sparade uppgifter används enbart för att tillhandahålla appens funktionalitet, som att visa klädrekommendationer och spara veckoschemat.", no: "Lagrede opplysninger brukes kun for å tilby appens funksjonalitet, som å vise klesanbefalinger og lagre ukeplanen.", da: "Gemte oplysninger bruges kun til at levere appens funktionalitet, som at vise tøjanbefalinger og gemme ugeplanen.", en: "Stored data is used solely for providing app functionality, such as displaying clothing recommendations and saving the weekly schedule." },
  "footer.privacyS4Title": { fi: "4. Evästeet ja analytiikka", sv: "4. Cookies och analys", no: "4. Informasjonskapsler og analyse", da: "4. Cookies og analyse", en: "4. Cookies & Analytics" },
  "footer.privacyS4": { fi: "Sovellus ei käytä kolmannen osapuolen evästeitä. Mahdolliset mainoslinkit (affiliate-linkit) voivat ohjata ulkoisille sivustoille, joilla on omat tietosuojakäytäntönsä.", sv: "Appen använder inga tredjepartscookies. Eventuella annonslänkar (affiliatelänkar) kan leda till externa webbplatser med egna integritetspolicyer.", no: "Appen bruker ingen tredjeparts informasjonskapsler. Eventuelle annonselenker (affiliatelenker) kan lede til eksterne nettsteder med egne personvernerklæringer.", da: "Appen bruger ingen tredjepartscookies. Eventuelle reklamelinks (affiliatelinks) kan lede til eksterne hjemmesider med egne privatlivspolitikker.", en: "The app does not use third-party cookies. Affiliate links may redirect to external sites with their own privacy policies." },
  "footer.privacyS5Title": { fi: "5. Tietojen poistaminen", sv: "5. Radering av uppgifter", no: "5. Sletting av opplysninger", da: "5. Sletning af oplysninger", en: "5. Data Deletion" },
  "footer.privacyS5": { fi: "Käyttäjä voi poistaa kaikki tallentamansa tiedot tyhjentämällä selaimen LocalStorage-tiedot selaimen asetuksista.", sv: "Användaren kan radera alla sparade uppgifter genom att rensa webbläsarens LocalStorage-data i webbläsarens inställningar.", no: "Brukeren kan slette alle lagrede opplysninger ved å tømme nettleserens LocalStorage-data i nettleserinnstillingene.", da: "Brugeren kan slette alle gemte oplysninger ved at rydde browserens LocalStorage-data i browserindstillingerne.", en: "Users can delete all stored data by clearing the browser's LocalStorage in browser settings." },
  "footer.privacyS6Title": { fi: "6. Yhteydenotto", sv: "6. Kontakt", no: "6. Kontakt", da: "6. Kontakt", en: "6. Contact" },
  "footer.privacyS6": { fi: "Palautetta ja tietosuojaa koskevia kysymyksiä voit lähettää sähköpostitse:", sv: "Feedback och frågor om integritetspolicyn kan skickas via e-post:", no: "Tilbakemeldinger og spørsmål om personvern kan sendes via e-post:", da: "Feedback og spørgsmål om privatlivspolitikken kan sendes via e-mail:", en: "Feedback and privacy-related questions can be sent via email:" },
  "footer.contactIntro": { fi: "Olemme iloisia kuullessamme sinusta! Voit ottaa yhteyttä alla olevilla tavoilla.", sv: "Vi är glada att höra från dig! Du kan kontakta oss på följande sätt.", no: "Vi er glade for å høre fra deg! Du kan kontakte oss på følgende måter.", da: "Vi er glade for at høre fra dig! Du kan kontakte os på følgende måder.", en: "We'd love to hear from you! You can reach us in the following ways." },
  "footer.emailTitle": { fi: "Sähköposti", sv: "E-post", no: "E-post", da: "E-mail", en: "Email" },
  "footer.partnerTitle": { fi: "Yhteistyö & Mainonta", sv: "Samarbete & Annonsering", no: "Samarbeid & Annonsering", da: "Samarbejde & Annoncering", en: "Partnership & Advertising" },
  "footer.partnerDesc": { fi: "Kiinnostaako affiliate-yhteistyö tai mainospaikka? Ota yhteyttä sähköpostitse, niin kerromme lisää mahdollisuuksista.", sv: "Intresserad av affiliatesamarbete eller annonsplats? Kontakta oss via e-post så berättar vi mer om möjligheterna.", no: "Interessert i affiliatesamarbeid eller annonseplass? Kontakt oss via e-post, så forteller vi mer om mulighetene.", da: "Interesseret i affiliatesamarbejde eller annonceplads? Kontakt os via e-mail, så fortæller vi mere om mulighederne.", en: "Interested in affiliate partnerships or ad placements? Contact us by email and we'll share more about the opportunities." },

  // Misc
  "misc.windTip": { fi: "💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!", sv: "💡 Kom ihåg att kontrollera vindbyarna innan utevistelsen!", no: "💡 Husk å sjekke vindkastene før du går ut!", da: "💡 Husk at tjekke vindstødene inden du går ud!", en: "💡 Remember to check wind gusts before going outside!" },

  // Clothing items (for weatherData translations)
  "cloth.kerrospukeutuminen": { fi: "Kerrospukeutuminen", sv: "Lagerklädsel", no: "Lagpåkledning", da: "Lagpåklædning", en: "Layering" },
  "cloth.kerrospukeutuminen.desc": { fi: "Merinovilla, välikerros ja paksu toppapuku", sv: "Merinoull, mellanskikt och tjock overall", no: "Merinoull, mellomlag og tykk vinterdress", da: "Merinould, mellemlag og tyk vinterdragt", en: "Merino wool, mid layer and thick snow overall" },
  "cloth.toppapuku": { fi: "Toppapuku ja villasukat", sv: "Täckoverall och ullstrumpor", no: "Vinterdress og ullsokker", da: "Vinterdragt og uldsokker", en: "Snow overall and wool socks" },
  "cloth.toppapuku.desc": { fi: "Lämpö: 0 … –10 °C — paksu toppapuku ja villasukat", sv: "Temp: 0 … –10 °C — tjock täckoverall och ullstrumpor", no: "Temp: 0 … –10 °C — tykk vinterdress og ullsokker", da: "Temp: 0 … –10 °C — tyk vinterdragt og uldsokker", en: "Temp: 0 … –10 °C — thick snow overall and wool socks" },
  "cloth.välikausivaatteet": { fi: "Välikausivaatteet", sv: "Övergångskläder", no: "Mellomsesongsklær", da: "Mellemsæsontøj", en: "Mid-season clothing" },
  "cloth.välikausivaatteet.desc": { fi: "+1 … +12 °C — kuoritakki ja kerroksia", sv: "+1 … +12 °C — skaljacka och lager", no: "+1 … +12 °C — skalljakke og lag", da: "+1 … +12 °C — skaljakke og lag", en: "+1 … +12 °C — shell jacket and layers" },
  "cloth.teknisetkuorivaatteet": { fi: "Tekniset kuorivaatteet", sv: "Tekniska skalkläder", no: "Tekniske skallklær", da: "Teknisk skaltøj", en: "Technical shell clothing" },
  "cloth.teknisetkuorivaatteet.desc": { fi: "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia", sv: "+1 … +12 °C — tekniska skalkläder och lager", no: "+1 … +12 °C — tekniske skallklær og lag", da: "+1 … +12 °C — teknisk skaltøj og lag", en: "+1 … +12 °C — technical shell clothing and layers" },
  "cloth.rattaissalisakerros": { fi: "Rattaissa lisäkerros", sv: "Extra lager i vagnen", no: "Ekstra lag i vognen", da: "Ekstra lag i vognen", en: "Extra layer in stroller" },
  "cloth.rattaissalisakerros.desc": { fi: "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle", sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", no: "Hvis barnet sitter stille i vognen, bruk en varm posepose eller legg til et ullag under skallklær", da: "Hvis barnet sidder stille i vognen, brug en varm kørepose eller tilføj et uldlag under skaltøj", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear" },
  "cloth.tuubihuivi": { fi: "Tuubihuivi", sv: "Tubhalsduk", no: "Tubskjerf", da: "Tubhalstørklæde", en: "Neck gaiter" },
  "cloth.tuubihuivi.desc": { fi: "Tuuli yli 5 m/s — tuubihuivi suojaa", sv: "Vind över 5 m/s — tubhalsduk skyddar", no: "Vind over 5 m/s — tubskjerf beskytter", da: "Vind over 5 m/s — tubhalstørklæde beskytter", en: "Wind over 5 m/s — neck gaiter protects" },
  "cloth.lippalakki": { fi: "Lippalakki", sv: "Keps", no: "Caps", da: "Kasket", en: "Cap" },
  "cloth.lippalakki.desc": { fi: "Aurinkoisella säällä suojaksi", sv: "Skydd i soligt väder", no: "Beskyttelse i solrikt vær", da: "Beskyttelse i solrigt vejr", en: "Protection in sunny weather" },
  "cloth.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", no: "Solkrem", da: "Solcreme", en: "Sunscreen" },
  "cloth.aurinkorasva.desc": { fi: "Suojaa iho UV-säteilyltä", sv: "Skyddar huden mot UV-strålning", no: "Beskytter huden mot UV-stråling", da: "Beskytter huden mod UV-stråling", en: "Protects skin from UV radiation" },
  "cloth.vuorettomat": { fi: "Vuorettomat kurahousut", sv: "Ofodrade regnbyxor", no: "Uforede regnbukser", da: "Uforede regnbukser", en: "Unlined rain trousers" },
  "cloth.vuorettomat.desc": { fi: "Kevyet sadehousut ilman vuorta", sv: "Lätta regnbyxor utan foder", no: "Lette regnbukser uten fôr", da: "Lette regnbukser uden for", en: "Light rain trousers without lining" },
  "cloth.kumisaappaat": { fi: "Kumisaappaat", sv: "Gummistövlar", no: "Gummistøvler", da: "Gummistøvler", en: "Rubber boots" },
  "cloth.kumisaappaat.desc": { fi: "Kumisaappaat ohuilla sukilla", sv: "Gummistövlar med tunna strumpor", no: "Gummistøvler med tynne sokker", da: "Gummistøvler med tynde sokker", en: "Rubber boots with thin socks" },
  "cloth.kumisaappaat.wool": { fi: "+ villasukat", sv: "+ yllesockor", no: "+ ullsokker", da: "+ uldsokker", en: "+ wool socks" },
  "cloth.kumisaappaat.wool.desc": { fi: "Kumisaappaat ja villasukat suojaavat kylmältä", sv: "Gummistövlar och ullstrumpor skyddar mot kylan", no: "Gummistøvler og ullsokker beskytter mot kulden", da: "Gummistøvler og uldsokker beskytter mod kulden", en: "Rubber boots and wool socks protect against cold" },
  "cloth.kurahousut": { fi: "Kurahousut ja kurahanskat", sv: "Regnbyxor och regnvantar", no: "Regnbukser og regnvotter", da: "Regnbukser og regnvanter", en: "Rain trousers and rain gloves" },
  "cloth.kurahousut.desc": { fi: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!", sv: "Regnchans över 40 % — ta med vattentät utrustning!", no: "Regnsjanse over 40 % — ta med vanntett utstyr!", da: "Regnchance over 40 % — tag vandtæt udstyr med!", en: "Rain probability over 40% — bring waterproof gear!" },
  "cloth.lippisUv": { fi: "Lippis/Hattu", sv: "Keps/Hatt", no: "Caps/Hatt", da: "Kasket/Hat", en: "Cap/Hat" },
  "cloth.lippisUv.desc": { fi: "Korkea UV — suojaa pää auringolta", sv: "Högt UV — skydda huvudet mot solen", no: "Høy UV — beskytt hodet mot solen", da: "Høj UV — beskyt hovedet mod solen", en: "High UV — protect head from the sun" },
  "cloth.aurinkolasit": { fi: "Aurinkolasit", sv: "Solglasögon", no: "Solbriller", da: "Solbriller", en: "Sunglasses" },
  "cloth.aurinkolasit.desc": { fi: "UV-suoja silmille", sv: "UV-skydd för ögonen", no: "UV-beskyttelse for øynene", da: "UV-beskyttelse for øjnene", en: "UV protection for eyes" },

  // Cold gear
  "cloth.toppahaalari": { fi: "Toppahaalari", sv: "Täckoverall", no: "Vinterdress", da: "Vinterdragt", en: "Snow overall" },
  "cloth.toppahaalari.desc": { fi: "Paksu talvihaalari", sv: "Tjock vinteroverall", no: "Tykk vinterdress", da: "Tyk vinterdragt", en: "Thick winter overall" },
  "cloth.villakerrastot": { fi: "Villakerrastot", sv: "Ullunderställ", no: "Ullundertøy", da: "Uldundertøj", en: "Wool base layers" },
  "cloth.villakerrastot.desc": { fi: "Merinovillaiset aluskerrastot", sv: "Underställ i merinoull", no: "Undertøy i merinoull", da: "Undertøj i merinould", en: "Merino wool base layers" },
  "cloth.villasukat": { fi: "Villasukat", sv: "Ullstrumpor", no: "Ullsokker", da: "Uldsokker", en: "Wool socks" },
  "cloth.villasukat.desc": { fi: "Paksut villasukat", sv: "Tjocka ullstrumpor", no: "Tykke ullsokker", da: "Tykke uldsokker", en: "Thick wool socks" },
  "cloth.talvitöppöset": { fi: "Talvitöppöset", sv: "Vinterskor", no: "Vintersko", da: "Vintersko", en: "Winter booties" },
  "cloth.talvitöppöset.desc": { fi: "Lämpimät vauvan kengät", sv: "Varma babyskor", no: "Varme babysko", da: "Varme babysko", en: "Warm baby shoes" },
  "cloth.lapaset": { fi: "Lapaset", sv: "Vantar", no: "Votter", da: "Vanter", en: "Mittens" },
  "cloth.lapaset.desc": { fi: "Paksut tumput", sv: "Tjocka tumvantar", no: "Tykke votter", da: "Tykke luffer", en: "Thick mittens" },
  "cloth.pipo": { fi: "Pipo", sv: "Mössa", no: "Lue", da: "Hue", en: "Beanie" },
  "cloth.pipo.desc": { fi: "Villapipo + kypärämyssy", sv: "Ullmössa + hjälmhuva", no: "Ullue + balaklava", da: "Uldhue + balaklava", en: "Wool beanie + balaclava" },
  "cloth.toppahousut": { fi: "Toppahousut", sv: "Täckbyxor", no: "Vinterbukser", da: "Vinterbukser", en: "Snow trousers" },
  "cloth.toppahousut.desc": { fi: "Talvitoppahousut", sv: "Vintertäckbyxor", no: "Vinter varmebukser", da: "Vinter varmebukser", en: "Winter snow trousers" },
  "cloth.toppatakki": { fi: "Toppatakki", sv: "Täckjacka", no: "Vinterjakke", da: "Vinterjakke", en: "Winter jacket" },
  "cloth.toppatakki.desc": { fi: "Paksu talvitakki", sv: "Tjock vinterjacka", no: "Tykk vinterjakke", da: "Tyk vinterjakke", en: "Thick winter jacket" },
  "cloth.villakerrastot2.desc": { fi: "Aluskerrastot villan päälle", sv: "Underställ ovanpå ullen", no: "Undertøy oppå ullen", da: "Undertøj ovenpå ulden", en: "Base layers over wool" },
  "cloth.talvisaappaat": { fi: "Talvisaappaat", sv: "Vinterstövlar", no: "Vinterstøvler", da: "Vinterstøvler", en: "Winter boots" },
  "cloth.talvisaappaat.desc": { fi: "Lämpimät vedenpitävät saappaat", sv: "Varma vattentäta stövlar", no: "Varme vanntette støvler", da: "Varme vandtætte støvler", en: "Warm waterproof boots" },
  "cloth.hanskat": { fi: "Hanskat", sv: "Handskar", no: "Hansker", da: "Handsker", en: "Gloves" },
  "cloth.hanskat.desc.taapero": { fi: "Hanskat tai rukkaset", sv: "Handskar eller vantar", no: "Hansker eller votter", da: "Handsker eller vanter", en: "Gloves or mittens" },
  "cloth.kauluri": { fi: "Kauluri", sv: "Halskrage", no: "Hals", da: "Halskrave", en: "Neck warmer" },
  "cloth.kauluri.desc.taapero": { fi: "Tuubihuivi tai kypärämyssy", sv: "Tubhalsduk eller hjälmhuva", no: "Tubskjerf eller balaklava", da: "Tubhalstørklæde eller balaklava", en: "Neck gaiter or balaclava" },
  "cloth.pipo2.desc": { fi: "Lämmin villapipo", sv: "Varm ullmössa", no: "Varm ullue", da: "Varm uldhue", en: "Warm wool beanie" },
  "cloth.hanskat.desc.leikki": { fi: "Sormikkaat tai lapaset", sv: "Fingervantar eller vantar", no: "Fingerhansker eller votter", da: "Fingerhandsker eller vanter", en: "Finger gloves or mittens" },
  "cloth.pipo3.desc": { fi: "Lämpimä pipo", sv: "Varm mössa", no: "Varm lue", da: "Varm hue", en: "Warm beanie" },
  "cloth.kauluri2.desc": { fi: "Tuubihuivi", sv: "Tubhalsduk", no: "Tubskjerf", da: "Tubhalstørklæde", en: "Neck gaiter" },
  "cloth.välikerrastot": { fi: "Välikerrastot", sv: "Mellanunderställ", no: "Mellomundertøy", da: "Mellemundertøj", en: "Mid base layers" },
  "cloth.välikerrastot.desc": { fi: "Kerrostettavat alusvaatteet", sv: "Lagerbara underkläder", no: "Lagbare underklær", da: "Lagbart undertøj", en: "Layerable underwear" },
  "cloth.talvikengät": { fi: "Talvikengät", sv: "Vinterskor", no: "Vintersko", da: "Vintersko", en: "Winter shoes" },
  "cloth.talvikengät.desc": { fi: "Lämpimät kengät", sv: "Varma skor", no: "Varme sko", da: "Varme sko", en: "Warm shoes" },
  "cloth.kauluri3.desc": { fi: "Kauluri, huivi tai kypärämyssy", sv: "Halskrage, halsduk eller hjälmhuva", no: "Hals, skjerf eller balaklava", da: "Halskrave, tørklæde eller balaklava", en: "Neck warmer, scarf or balaclava" },

  // Mild rain gear
  "cloth.välikausihaalari": { fi: "Välikausihaalari", sv: "Skaloverall", no: "Skalldress", da: "Skaldragt", en: "Mid-season overall" },
  "cloth.välikausihaalari.desc": { fi: "Kevyt haalari", sv: "Lätt overall", no: "Lett dress", da: "Let dragt", en: "Light overall" },
  "cloth.sadehaalari": { fi: "Sadehaalari", sv: "Regnoverall", no: "Regndress", da: "Regndragt", en: "Rain overall" },
  "cloth.sadehaalari.desc": { fi: "Vedenpitävä haalari päälle", sv: "Vattentät overall ovanpå", no: "Vanntett dress utenpå", da: "Vandtæt dragt udenpå", en: "Waterproof overall on top" },
  "cloth.kumisaappaat2.desc": { fi: "Pienet kumpparet", sv: "Små gummistövlar", no: "Små gummistøvler", da: "Små gummistøvler", en: "Small rubber boots" },
  "cloth.ohutpipo": { fi: "Ohut pipo", sv: "Tunn mössa", no: "Tynn lue", da: "Tynd hue", en: "Thin beanie" },
  "cloth.ohutpipo.desc": { fi: "Puuvillapipo", sv: "Bomullsmössa", no: "Bomullslue", da: "Bomuldshue", en: "Cotton beanie" },
  "cloth.välikausihousut": { fi: "Välikausihousut", sv: "Övergångsbyxor", no: "Mellomsesongsbuker", da: "Mellemsæsonbukser", en: "Mid-season trousers" },
  "cloth.välikausihousut.desc": { fi: "Joustavat välikausihousut", sv: "Stretchiga övergångsbyxor", no: "Stretchy mellomsesongsbuker", da: "Stretchy mellemsæsonbukser", en: "Flexible mid-season trousers" },
  "cloth.kuoritakki": { fi: "Kuoritakki", sv: "Skaljacka", no: "Skalljakke", da: "Skaljakke", en: "Shell jacket" },
  "cloth.kuoritakki.desc": { fi: "Tuulenpitävä kuoritakki", sv: "Vindtät skaljacka", no: "Vindtett skalljakke", da: "Vindtæt skaljakke", en: "Windproof shell jacket" },
  "cloth.välikausikengät": { fi: "Välikausikengät", sv: "Övergångsskor", no: "Mellomsesongssko", da: "Mellemsæsonsko", en: "Mid-season shoes" },
  "cloth.välikausikengät.desc": { fi: "Vettähylkivät välikausikengät", sv: "Vattenavvisande övergångsskor", no: "Vannavvisende mellomsesongssko", da: "Vandafvisende mellemsæsonsko", en: "Water-repellent mid-season shoes" },
  "cloth.välikerrasto": { fi: "Välikerrasto", sv: "Mellanskikt", no: "Mellomlag", da: "Mellemlag", en: "Mid layer" },
  "cloth.välikerrasto.desc": { fi: "Fleece tai villainen", sv: "Fleece eller ull", no: "Fleece eller ull", da: "Fleece eller uld", en: "Fleece or wool" },

  // Warm spring
  "cloth.body": { fi: "Body", sv: "Body", no: "Body", da: "Body", en: "Bodysuit" },
  "cloth.body.desc": { fi: "Ohut puuvillabody", sv: "Tunn bomullsbody", no: "Tynn bomullsbody", da: "Tynd bomuldsbody", en: "Thin cotton bodysuit" },
  "cloth.ohuthaalari": { fi: "Ohut haalari", sv: "Tunn overall", no: "Tynn dress", da: "Tynd dragt", en: "Thin overall" },
  "cloth.ohuthaalari.desc": { fi: "Kevyt ulkohaalari", sv: "Lätt utomhusoverall", no: "Lett utedress", da: "Let udedragt", en: "Light outdoor overall" },
  "cloth.collegehousut": { fi: "Collegehousut", sv: "Mjukisbyxor", no: "Joggebukser", da: "Joggingbukser", en: "Joggers" },
  "cloth.collegehousut.desc": { fi: "Joustavat collegehousut", sv: "Stretchiga mjukisbyxor", no: "Stretchy joggebukser", da: "Stretchy joggingbukser", en: "Flexible joggers" },
  "cloth.pitkähihainen": { fi: "Pitkähihainen paita", sv: "Långärmad tröja", no: "Langermet trøye", da: "Langærmet trøje", en: "Long-sleeve shirt" },
  "cloth.pitkähihainen.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", no: "Lett langermet", da: "Let langærmet", en: "Light long-sleeve" },
  "cloth.kevyttakki": { fi: "Kevyt takki", sv: "Lätt jacka", no: "Lett jakke", da: "Let jakke", en: "Light jacket" },
  "cloth.kevyttakki.desc": { fi: "Kevyt takki tai liivi", sv: "Lätt jacka eller väst", no: "Lett jakke eller vest", da: "Let jakke eller vest", en: "Light jacket or vest" },
  "cloth.lenkkarit": { fi: "Lenkkarit", sv: "Sneakers", no: "Joggesko", da: "Sneakers", en: "Sneakers" },
  "cloth.lenkkarit.desc": { fi: "Kevyet kengät", sv: "Lätta skor", no: "Lette sko", da: "Lette sko", en: "Light shoes" },
  "cloth.farkut": { fi: "Farkut", sv: "Jeans", no: "Jeans", da: "Jeans", en: "Jeans" },
  "cloth.farkut.desc": { fi: "Farkut tai collegehousut", sv: "Jeans eller mjukisbyxor", no: "Jeans eller joggebukser", da: "Jeans eller joggingbukser", en: "Jeans or joggers" },
  "cloth.collegehousut2.desc": { fi: "Collegehousut tai farkut", sv: "Mjukisbyxor eller jeans", no: "Joggebukser eller jeans", da: "Joggingbukser eller jeans", en: "Joggers or jeans" },
  "cloth.pitkähihainen2.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", no: "Lett langermet", da: "Let langærmet", en: "Light long-sleeve" },

  // Warm gear
  "cloth.aurinkohattu": { fi: "Aurinkohattu", sv: "Solhatt", no: "Solhatt", da: "Solhat", en: "Sun hat" },
  "cloth.aurinkohattu.desc": { fi: "Leveälierinen hattu", sv: "Bredbrättad hatt", no: "Bredbremmet hatt", da: "Bredskygget hat", en: "Wide-brimmed hat" },
  "cloth.tpaita": { fi: "T-paita", sv: "T-shirt", no: "T-skjorte", da: "T-shirt", en: "T-shirt" },
  "cloth.tpaita.desc": { fi: "Kevyt paita", sv: "Lätt tröja", no: "Lett trøye", da: "Let trøje", en: "Light shirt" },
  "cloth.shortsit": { fi: "Shortsit", sv: "Shorts", no: "Shorts", da: "Shorts", en: "Shorts" },
  "cloth.shortsit.desc": { fi: "Kevyet shortsit", sv: "Lätta shorts", no: "Lette shorts", da: "Lette shorts", en: "Light shorts" },
  "cloth.sandaalit": { fi: "Sandaalit", sv: "Sandaler", no: "Sandaler", da: "Sandaler", en: "Sandals" },
  "cloth.sandaalit.desc": { fi: "Avoimet kengät", sv: "Öppna skor", no: "Åpne sko", da: "Åbne sko", en: "Open shoes" },
  "cloth.aurinkohattu2.desc": { fi: "Lippalakki tai hattu", sv: "Keps eller hatt", no: "Caps eller hatt", da: "Kasket eller hat", en: "Cap or hat" },
  "cloth.shortsit2.desc": { fi: "Shortsit tai hame", sv: "Shorts eller kjol", no: "Shorts eller skjørt", da: "Shorts eller nederdel", en: "Shorts or skirt" },
  "cloth.lippalakki2.desc": { fi: "Aurinkosuoja", sv: "Solskydd", no: "Solbeskyttelse", da: "Solbeskyttelse", en: "Sun protection" },
  "cloth.huppari": { fi: "Huppari", sv: "Hoodie", no: "Hettegenser", da: "Hoodie", en: "Hoodie" },
  "cloth.huppari.desc": { fi: "Fleece tai huppari", sv: "Fleece eller hoodie", no: "Fleece eller hettegenser", da: "Fleece eller hoodie", en: "Fleece or hoodie" },
  "cloth.välikausikengät2.desc": { fi: "Vettähylkivät kengät", sv: "Vattenavvisande skor", no: "Vannavvisende sko", da: "Vandafvisende sko", en: "Water-repellent shoes" },

  // Dual recommendation
  "dual.morning": { fi: "Aamun varustus", sv: "Morgonens utrustning", no: "Morgenens utstyr", da: "Morgenens udstyr", en: "Morning outfit" },
  "dual.afternoon": { fi: "Iltapäivän varustus", sv: "Eftermiddagens utrustning", no: "Ettermiddagens utstyr", da: "Eftermiddagens udstyr", en: "Afternoon outfit" },
  "dual.windWarning": { fi: "Kova tuuli ({speed} m/s) lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros.", sv: "Stark vind ({speed} m/s) ökar kylkänslan — välj vindtätt skalplagg.", no: "Sterk vind ({speed} m/s) øker kuldefølelsen — velg vindtett skallplagg.", da: "Stærk vind ({speed} m/s) øger kuldefølelsen — vælg vindtæt skallag.", en: "Strong wind ({speed} m/s) increases wind chill — choose a windproof shell layer." },
  "dual.mudWarning": { fi: "Vaikka nyt on poutaa, maa on vielä märkä yöllisen sateen jäljiltä.", sv: "Även om det är uppehåll nu är marken fortfarande blöt efter nattens regn.", no: "Selv om det er opphold nå, er bakken fortsatt våt etter nattens regn.", da: "Selvom det er tørvejr nu, er jorden stadig våd efter nattens regn.", en: "Even though it's dry now, the ground is still wet from overnight rain." },
  "dual.gapInfo": { fi: "Lämpötila muuttuu merkittävästi päivän aikana ({morning}°C → {afternoon}°C). Pakkaa iltapäivän varusteet reppuun!", sv: "Temperaturen förändras betydligt under dagen ({morning}°C → {afternoon}°C). Packa eftermiddagens kläder i ryggsäcken!", no: "Temperaturen endres betydelig i løpet av dagen ({morning}°C → {afternoon}°C). Pakk ettermiddagens klær i sekken!", da: "Temperaturen ændres betydeligt i løbet af dagen ({morning}°C → {afternoon}°C). Pak eftermiddagens tøj i tasken!", en: "Temperature changes significantly during the day ({morning}°C → {afternoon}°C). Pack afternoon outfit in the backpack!" },

  // PWA install banner
  "pwa.title": { fi: "Asenna Säävahti puhelimeesi", sv: "Installera Vädervakten på din telefon", no: "Installer Værpassen på telefonen din", da: "Installér Vejrvagten på din telefon", en: "Install Säävahti on your phone" },
  "pwa.instructionIos": { fi: "Paina selaimen \"Jaa\"-painiketta (📤) ja valitse \"Lisää kotivalikkoon\".", sv: "Tryck på webbläsarens \"Dela\"-knapp (📤) och välj \"Lägg till på hemskärmen\".", no: "Trykk på nettleserens \"Del\"-knapp (📤) og velg \"Legg til på hjemmeskjermen\".", da: "Tryk på browserens \"Del\"-knap (📤) og vælg \"Føj til hjemmeskærm\".", en: "Tap the browser's \"Share\" button (📤) and select \"Add to Home Screen\"." },
  "pwa.instructionAndroid": { fi: "Paina selaimen valikkoa (⋮) ja valitse \"Lisää aloitusnäytölle\".", sv: "Tryck på webbläsarens meny (⋮) och välj \"Lägg till på startskärmen\".", no: "Trykk på nettlesermenyeen (⋮) og velg \"Legg til på startskjermen\".", da: "Tryk på browsermenuen (⋮) og vælg \"Føj til startskærm\".", en: "Tap the browser menu (⋮) and select \"Add to Home Screen\"." },
  "pwa.close": { fi: "Sulje", sv: "Stäng", no: "Lukk", da: "Luk", en: "Close" },

  // Share button
  "share.button": { fi: "Jaa puolison kanssa", sv: "Dela med partner", no: "Del med partner", da: "Del med partner", en: "Share with partner" },
  "share.messageIntro": { fi: "Säävahti-muistutus!", sv: "Vädervakten-påminnelse!", no: "Værpassen-påminnelse!", da: "Vejrvagten-påmindelse!", en: "Säävahti reminder!" },
  "share.rememberMud": { fi: "Muista kuravarusteet!", sv: "Kom ihåg smutskläderna!", no: "Husk regnklærne!", da: "Husk regntøjet!", en: "Remember mud gear!" },

  // Onboarding
  "onboarding.welcome": { fi: "Tervetuloa!", sv: "Välkommen!", no: "Velkommen!", da: "Velkommen!", en: "Welcome!" },
  "onboarding.subtitle": { fi: "Valitse maa ja kieli aloittaaksesi", sv: "Välj land och språk för att börja", no: "Velg land og språk for å begynne", da: "Vælg land og sprog for at begynde", en: "Choose your country and language to get started" },
  "onboarding.selectCountry": { fi: "Valitse maa", sv: "Välj land", no: "Velg land", da: "Vælg land", en: "Select country" },
  "onboarding.selectLanguage": { fi: "Valitse kieli", sv: "Välj språk", no: "Velg språk", da: "Vælg sprog", en: "Select language" },
  "onboarding.continue": { fi: "Jatka", sv: "Fortsätt", no: "Fortsett", da: "Fortsæt", en: "Continue" },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextValue {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getSavedLanguage);

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const entry = translations[key];
    if (!entry) return key;
    let text: string = (entry as any)[lang] || entry.fi;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

// Clothing item translation maps (Finnish → { sv, en, no, da })
const clothingNameMap: Record<string, { sv: string; en: string; no: string; da: string }> = {
  "Kerrospukeutuminen": { sv: "Lagerklädsel", en: "Layering", no: "Lagpåkledning", da: "Lagpåklædning" },
  "Toppapuku ja villasukat": { sv: "Täckoverall och ullstrumpor", en: "Snow overall and wool socks", no: "Vinterdress og ullsokker", da: "Vinterdragt og uldsokker" },
  "Välikausivaatteet": { sv: "Övergångskläder", en: "Mid-season clothing", no: "Mellomsesongsklær", da: "Mellemsæsontøj" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter", no: "Tubskjerf", da: "Tubhalstørklæde" },
  "Lippalakki": { sv: "Keps", en: "Cap", no: "Caps", da: "Kasket" },
  "Aurinkorasva": { sv: "Solskyddskräm", en: "Sunscreen", no: "Solkrem", da: "Solcreme" },
  "Vuorettomat kurahousut": { sv: "Ofodrade regnbyxor", en: "Unlined rain trousers", no: "Uforede regnbukser", da: "Uforede regnbukser" },
  "Kumisaappaat": { sv: "Gummistövlar", en: "Rubber boots", no: "Gummistøvler", da: "Gummistøvler" },
  "Kumisaappaat + villasukat": { sv: "Gummistövlar + ullstrumpor", en: "Rubber boots + wool socks", no: "Gummistøvler + ullsokker", da: "Gummistøvler + uldsokker" },
  "Kurahousut ja kurahanskat": { sv: "Regnbyxor och regnvantar", en: "Rain trousers and rain gloves", no: "Regnbukser og regnvotter", da: "Regnbukser og regnvanter" },
  "Kurahousut": { sv: "Regnbyxor", en: "Rain trousers", no: "Regnbukser", da: "Regnbukser" },
  "Lippis/Hattu": { sv: "Keps/Hatt", en: "Cap/Hat", no: "Caps/Hatt", da: "Kasket/Hat" },
  "Aurinkolasit": { sv: "Solglasögon", en: "Sunglasses", no: "Solbriller", da: "Solbriller" },
  "Toppahaalari": { sv: "Täckoverall", en: "Snow overall", no: "Vinterdress", da: "Vinterdragt" },
  "Villakerrastot": { sv: "Ullunderställ", en: "Wool base layers", no: "Ullundertøy", da: "Uldundertøj" },
  "Villasukat": { sv: "Ullstrumpor", en: "Wool socks", no: "Ullsokker", da: "Uldsokker" },
  "Talvitöppöset": { sv: "Vinterskor", en: "Winter booties", no: "Vintersko", da: "Vintersko" },
  "Lapaset": { sv: "Vantar", en: "Mittens", no: "Votter", da: "Vanter" },
  "Pipo": { sv: "Mössa", en: "Beanie", no: "Lue", da: "Hue" },
  "Toppahousut": { sv: "Täckbyxor", en: "Snow trousers", no: "Vinterbukser", da: "Vinterbukser" },
  "Toppatakki": { sv: "Täckjacka", en: "Winter jacket", no: "Vinterjakke", da: "Vinterjakke" },
  "Talvisaappaat": { sv: "Vinterstövlar", en: "Winter boots", no: "Vinterstøvler", da: "Vinterstøvler" },
  "Hanskat": { sv: "Handskar", en: "Gloves", no: "Hansker", da: "Handsker" },
  "Kauluri": { sv: "Halskrage", en: "Neck warmer", no: "Hals", da: "Halskrave" },
  "Välikerrastot": { sv: "Mellanunderställ", en: "Mid base layers", no: "Mellomundertøy", da: "Mellemundertøj" },
  "Talvikengät": { sv: "Vinterskor", en: "Winter shoes", no: "Vintersko", da: "Vintersko" },
  "Välikausihaalari": { sv: "Skaloverall", en: "Mid-season overall", no: "Skalldress", da: "Skaldragt" },
  "Sadehaalari": { sv: "Regnoverall", en: "Rain overall", no: "Regndress", da: "Regndragt" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie", no: "Tynn lue", da: "Tynd hue" },
  "Välikausihousut": { sv: "Övergångsbyxor", en: "Mid-season trousers", no: "Mellomsesongsbuker", da: "Mellemsæsonbukser" },
  "Kuoritakki": { sv: "Skaljacka", en: "Shell jacket", no: "Skalljakke", da: "Skaljakke" },
  "Välikausikengät": { sv: "Övergångsskor", en: "Mid-season shoes", no: "Mellomsesongssko", da: "Mellemsæsonsko" },
  "Välikerrasto": { sv: "Mellanskikt", en: "Mid layer", no: "Mellomlag", da: "Mellemlag" },
  "Body": { sv: "Body", en: "Bodysuit", no: "Body", da: "Body" },
  "Ohut haalari": { sv: "Tunn overall", en: "Thin overall", no: "Tynn dress", da: "Tynd dragt" },
  "Collegehousut": { sv: "Mjukisbyxor", en: "Joggers", no: "Joggebukser", da: "Joggingbukser" },
  "Pitkähihainen paita": { sv: "Långärmad tröja", en: "Long-sleeve shirt", no: "Langermet trøye", da: "Langærmet trøje" },
  "Kevyt takki": { sv: "Lätt jacka", en: "Light jacket", no: "Lett jakke", da: "Let jakke" },
  "Lenkkarit": { sv: "Sneakers", en: "Sneakers", no: "Joggesko", da: "Sneakers" },
  "Farkut": { sv: "Jeans", en: "Jeans", no: "Jeans", da: "Jeans" },
  "Aurinkohattu": { sv: "Solhatt", en: "Sun hat", no: "Solhatt", da: "Solhat" },
  "T-paita": { sv: "T-shirt", en: "T-shirt", no: "T-skjorte", da: "T-shirt" },
  "Shortsit": { sv: "Shorts", en: "Shorts", no: "Shorts", da: "Shorts" },
  "Sandaalit": { sv: "Sandaler", en: "Sandals", no: "Sandaler", da: "Sandaler" },
  "Huppari": { sv: "Hoodie", en: "Hoodie", no: "Hettegenser", da: "Hoodie" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket", no: "Vanntett skalljakke", da: "Vandtæt skaljakke" },
  "Vedenpitävät ulkoiluhousut": { sv: "Vattentäta utomhusbyxor", en: "Waterproof outdoor trousers", no: "Vanntette utebukser", da: "Vandtætte udebukser" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes", no: "Vannavvisende sko", da: "Vandafvisende sko" },
  "Vuorellinen sadehaalari": { sv: "Fodrad regnoverall", en: "Lined rain overall", no: "Foret regndress", da: "Foret regndragt" },
  "Kurahanskat": { sv: "Regnvantar", en: "Rain gloves", no: "Regnvotter", da: "Regnvanter" },
  "Ohuet kuravarusteet": { sv: "Tunna regnkläder", en: "Thin rain gear", no: "Tynne regnklær", da: "Tyndt regntøj" },
  "Sadehaalari tai kurahousut & sadetakki": { sv: "Regnoverall eller regnbyxor & regnjacka", en: "Rain overall or rain trousers & rain jacket", no: "Regndress eller regnbukser & regnjakke", da: "Regndragt eller regnbukser & regnjakke" },
  "Tuulenpitävä kuorikerros": { sv: "Vindtätt skallager", en: "Windproof shell layer", no: "Vindtett skallag", da: "Vindtæt skallag" },
  "Lämpöpussi / lisäkerros": { sv: "Åkpåse / extra lager", en: "Footmuff / extra layer", no: "Vognpose / ekstra lag", da: "Kørepose / ekstra lag" },
  "Tekniset kuorivaatteet": { sv: "Tekniska skalkläder", en: "Technical shell clothing", no: "Tekniske skallklær", da: "Teknisk skaltøj" },
  "Rattaissa lisäkerros": { sv: "Extra lager i vagnen", en: "Extra layer in stroller", no: "Ekstra lag i vognen", da: "Ekstra lag i vognen" },
};

const clothingDescMap: Record<string, { sv: string; en: string; no: string; da: string }> = {
  "Merinovilla, välikerros ja paksu toppapuku": { sv: "Merinoull, mellanskikt och tjock overall", en: "Merino wool, mid layer and thick snow overall", no: "Merinoull, mellomlag og tykk vinterdress", da: "Merinould, mellemlag og tyk vinterdragt" },
  "Lämpö: 0 … –1 °C — paksu toppapuku ja villasukat": { sv: "Temp: 0 … –1 °C — tjock täckoverall och ullstrumpor", en: "Temp: 0 … –1 °C — thick snow overall and wool socks", no: "Temp: 0 … –1 °C — tykk vinterdress og ullsokker", da: "Temp: 0 … –1 °C — tyk vinterdragt og uldsokker" },
  "+1 … +12 °C — kuoritakki ja kerroksia": { sv: "+1 … +12 °C — skaljacka och lager", en: "+1 … +12 °C — shell jacket and layers", no: "+1 … +12 °C — skalljakke og lag", da: "+1 … +12 °C — skaljakke og lag" },
  "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia": { sv: "+1 … +12 °C — tekniska skalkläder och lager", en: "+1 … +12 °C — technical shell clothing and layers", no: "+1 … +12 °C — tekniske skallklær og lag", da: "+1 … +12 °C — teknisk skaltøj og lag" },
  "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle": { sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear", no: "Hvis barnet sitter stille i vognen, bruk en varm vognpose eller legg til et ullag under skallklær", da: "Hvis barnet sidder stille i vognen, brug en varm kørepose eller tilføj et uldlag under skaltøj" },
  "Tuuli yli 5 m/s — tuubihuivi suojaa": { sv: "Vind över 5 m/s — tubhalsduk skyddar", en: "Wind over 5 m/s — neck gaiter protects", no: "Vind over 5 m/s — tubskjerf beskytter", da: "Vind over 5 m/s — tubhalstørklæde beskytter" },
  "Aurinkoisella säällä suojaksi": { sv: "Skydd i soligt väder", en: "Protection in sunny weather", no: "Beskyttelse i solrikt vær", da: "Beskyttelse i solrigt vejr" },
  "Suojaa iho UV-säteilyltä": { sv: "Skyddar huden mot UV-strålning", en: "Protects skin from UV radiation", no: "Beskytter huden mot UV-stråling", da: "Beskytter huden mod UV-stråling" },
  "Paksu talvihaalari": { sv: "Tjock vinteroverall", en: "Thick winter overall", no: "Tykk vinterdress", da: "Tyk vinterdragt" },
  "Merinovillaiset aluskerrastot": { sv: "Underställ i merinoull", en: "Merino wool base layers", no: "Undertøy i merinoull", da: "Undertøj i merinould" },
  "Paksut villasukat": { sv: "Tjocka ullstrumpor", en: "Thick wool socks", no: "Tykke ullsokker", da: "Tykke uldsokker" },
  "Lämpimät vauvan kengät": { sv: "Varma babyskor", en: "Warm baby shoes", no: "Varme babysko", da: "Varme babysko" },
  "Paksut tumput": { sv: "Tjocka tumvantar", en: "Thick mittens", no: "Tykke votter", da: "Tykke luffer" },
  "Villapipo + kypärämyssy": { sv: "Ullmössa + hjälmhuva", en: "Wool beanie + balaclava", no: "Ullue + balaklava", da: "Uldhue + balaklava" },
  "Talvitoppahousut": { sv: "Vintertäckbyxor", en: "Winter snow trousers", no: "Vinter varmebukser", da: "Vinter varmebukser" },
  "Paksu talvitakki": { sv: "Tjock vinterjacka", en: "Thick winter jacket", no: "Tykk vinterjakke", da: "Tyk vinterjakke" },
  "Aluskerrastot villan päälle": { sv: "Underställ ovanpå ullen", en: "Base layers over wool", no: "Undertøy oppå ullen", da: "Undertøj ovenpå ulden" },
  "Lämpimät vedenpitävät saappaat": { sv: "Varma vattentäta stövlar", en: "Warm waterproof boots", no: "Varme vanntette støvler", da: "Varme vandtætte støvler" },
  "Hanskat tai rukkaset": { sv: "Handskar eller vantar", en: "Gloves or mittens", no: "Hansker eller votter", da: "Handsker eller vanter" },
  "Tuubihuivi tai kypärämyssy": { sv: "Tubhalsduk eller hjälmhuva", en: "Neck gaiter or balaclava", no: "Tubskjerf eller balaklava", da: "Tubhalstørklæde eller balaklava" },
  "Lämmin villapipo": { sv: "Varm ullmössa", en: "Warm wool beanie", no: "Varm ullue", da: "Varm uldhue" },
  "Talvihousut": { sv: "Vinterbyxor", en: "Winter trousers", no: "Vinterbukser", da: "Vinterbukser" },
  "Talvitakki": { sv: "Vinterjacka", en: "Winter jacket", no: "Vinterjakke", da: "Vinterjakke" },
  "Aluskerrastot": { sv: "Underställ", en: "Base layers", no: "Undertøy", da: "Undertøj" },
  "Lämpimät saappaat": { sv: "Varma stövlar", en: "Warm boots", no: "Varme støvler", da: "Varme støvler" },
  "Sormikkaat tai lapaset": { sv: "Fingervantar eller vantar", en: "Finger gloves or mittens", no: "Fingerhansker eller votter", da: "Fingerhandsker eller vanter" },
  "Lämpimä pipo": { sv: "Varm mössa", en: "Warm beanie", no: "Varm lue", da: "Varm hue" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter", no: "Tubskjerf", da: "Tubhalstørklæde" },
  "Kerrostettavat alusvaatteet": { sv: "Lagerbara underkläder", en: "Layerable underwear", no: "Lagbare underklær", da: "Lagbart undertøj" },
  "Lämpimät kengät": { sv: "Varma skor", en: "Warm shoes", no: "Varme sko", da: "Varme sko" },
  "Pipo": { sv: "Mössa", en: "Beanie", no: "Lue", da: "Hue" },
  "Kauluri, huivi tai kypärämyssy": { sv: "Halskrage, halsduk eller hjälmhuva", en: "Neck warmer, scarf or balaclava", no: "Hals, skjerf eller balaklava", da: "Halskrave, tørklæde eller balaklava" },
  "Kevyt haalari": { sv: "Lätt overall", en: "Light overall", no: "Lett dress", da: "Let dragt" },
  "Vedenpitävä haalari päälle": { sv: "Vattentät overall ovanpå", en: "Waterproof overall on top", no: "Vanntett dress utenpå", da: "Vandtæt dragt udenpå" },
  "Pienet kumpparet": { sv: "Små gummistövlar", en: "Small rubber boots", no: "Små gummistøvler", da: "Små gummistøvler" },
  "Puuvillapipo": { sv: "Bomullsmössa", en: "Cotton beanie", no: "Bomullslue", da: "Bomuldshue" },
  "Joustavat välikausihousut": { sv: "Stretchiga övergångsbyxor", en: "Flexible mid-season trousers", no: "Stretchy mellomsesongsbuker", da: "Stretchy mellemsæsonbukser" },
  "Tuulenpitävä kuoritakki": { sv: "Vindtät skaljacka", en: "Windproof shell jacket", no: "Vindtett skalljakke", da: "Vindtæt skaljakke" },
  "Vettähylkivät välikausikengät": { sv: "Vattenavvisande övergångsskor", en: "Water-repellent mid-season shoes", no: "Vannavvisende mellomsesongssko", da: "Vandafvisende mellemsæsonsko" },
  "Fleece tai villainen": { sv: "Fleece eller ull", en: "Fleece or wool", no: "Fleece eller ull", da: "Fleece eller uld" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie", no: "Tynn lue", da: "Tynd hue" },
  "Ohut puuvillabody": { sv: "Tunn bomullsbody", en: "Thin cotton bodysuit", no: "Tynn bomullsbody", da: "Tynd bomuldsbody" },
  "Kevyt ulkohaalari": { sv: "Lätt utomhusoverall", en: "Light outdoor overall", no: "Lett utedress", da: "Let udedragt" },
  "Joustavat collegehousut": { sv: "Stretchiga mjukisbyxor", en: "Flexible joggers", no: "Stretchy joggebukser", da: "Stretchy joggingbukser" },
  "Kevyt pitkähihainen": { sv: "Lätt långärmad", en: "Light long-sleeve", no: "Lett langermet", da: "Let langærmet" },
  "Kevyt takki tai liivi": { sv: "Lätt jacka eller väst", en: "Light jacket or vest", no: "Lett jakke eller vest", da: "Let jakke eller vest" },
  "Kevyet kengät": { sv: "Lätta skor", en: "Light shoes", no: "Lette sko", da: "Lette sko" },
  "Farkut tai collegehousut": { sv: "Jeans eller mjukisbyxor", en: "Jeans or joggers", no: "Jeans eller joggebukser", da: "Jeans eller joggingbukser" },
  "Collegehousut tai farkut": { sv: "Mjukisbyxor eller jeans", en: "Joggers or jeans", no: "Joggebukser eller jeans", da: "Joggingbukser eller jeans" },
  "Leveälierinen hattu": { sv: "Bredbrättad hatt", en: "Wide-brimmed hat", no: "Bredbremmet hatt", da: "Bredskygget hat" },
  "Kevyt paita": { sv: "Lätt tröja", en: "Light shirt", no: "Lett trøye", da: "Let trøje" },
  "Kevyet shortsit": { sv: "Lätta shorts", en: "Light shorts", no: "Lette shorts", da: "Lette shorts" },
  "Avoimet kengät": { sv: "Öppna skor", en: "Open shoes", no: "Åpne sko", da: "Åbne sko" },
  "Lippalakki tai hattu": { sv: "Keps eller hatt", en: "Cap or hat", no: "Caps eller hatt", da: "Kasket eller hat" },
  "Shortsit tai hame": { sv: "Shorts eller kjol", en: "Shorts or skirt", no: "Shorts eller skjørt", da: "Shorts eller nederdel" },
  "Aurinkosuoja": { sv: "Solskydd", en: "Sun protection", no: "Solbeskyttelse", da: "Solbeskyttelse" },
  "T-paita": { sv: "T-shirt", en: "T-shirt", no: "T-skjorte", da: "T-shirt" },
  "Fleece tai huppari": { sv: "Fleece eller hoodie", en: "Fleece or hoodie", no: "Fleece eller hettegenser", da: "Fleece eller hoodie" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes", no: "Vannavvisende sko", da: "Vandafvisende sko" },
  "Kumisaappaat ohuilla sukilla": { sv: "Gummistövlar med tunna strumpor", en: "Rubber boots with thin socks", no: "Gummistøvler med tynne sokker", da: "Gummistøvler med tynde sokker" },
  "Kumisaappaat ja villasukat suojaavat kylmältä": { sv: "Gummistövlar och ullstrumpor skyddar mot kylan", en: "Rubber boots and wool socks protect against cold", no: "Gummistøvler og ullsokker beskytter mot kulden", da: "Gummistøvler og uldsokker beskytter mod kulden" },
  "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!": { sv: "Regnchans över 40 % — ta med vattentät utrustning!", en: "Rain probability over 40% — bring waterproof gear!", no: "Regnsjanse over 40 % — ta med vanntett utstyr!", da: "Regnchance over 40 % — tag vandtæt udstyr med!" },
  "Korkea UV — suojaa pää auringolta": { sv: "Högt UV — skydda huvudet mot solen", en: "High UV — protect head from the sun", no: "Høy UV — beskytt hodet mot solen", da: "Høj UV — beskyt hovedet mod solen" },
  "UV-suoja silmille": { sv: "UV-skydd för ögonen", en: "UV protection for eyes", no: "UV-beskyttelse for øynene", da: "UV-beskyttelse for øjnene" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket", no: "Vanntett skalljakke", da: "Vandtæt skaljakke" },
  "Vedenpitävä kuoritakki sateelta suojaan": { sv: "Vattentät skaljacka mot regnet", en: "Waterproof shell jacket for rain protection", no: "Vanntett skalljakke mot regnet", da: "Vandtæt skaljakke mod regnen" },
  "Vedenpitävät ulkoiluhousut sadesäälle": { sv: "Vattentäta utomhusbyxor för regnväder", en: "Waterproof outdoor trousers for rainy weather", no: "Vanntette utebukser for regnvær", da: "Vandtætte udebukser til regnvejr" },
  "Vettä hylkivät kengät pitävät jalat kuivina": { sv: "Vattenavvisande skor håller fötterna torra", en: "Water-repellent shoes keep feet dry", no: "Vannavvisende sko holder føttene tørre", da: "Vandafvisende sko holder fødderne tørre" },
  "Vuorellinen sadehaalari tai kuravarusteet välikausipuvun päällä": { sv: "Fodrad regnoverall eller regnkläder ovanpå skaldräkt", en: "Lined rain overall or rain gear over mid-season suit", no: "Foret regndress eller regnklær oppå skalldress", da: "Foret regndragt eller regntøj ovenpå skaldragt" },
  "Vedenpitävät kurahanskat": { sv: "Vattentäta regnvantar", en: "Waterproof rain gloves", no: "Vanntette regnvotter", da: "Vandtætte regnvanter" },
  "Ohuet kuravarusteet — kevyet ja ilmavat": { sv: "Tunna regnkläder — lätta och luftiga", en: "Thin rain gear — light and airy", no: "Tynne regnklær — lette og luftige", da: "Tyndt regntøj — let og luftigt" },
  "Kevyet kurahanskat": { sv: "Lätta regnvantar", en: "Light rain gloves", no: "Lette regnvotter", da: "Lette regnvanter" },
  "Kestää päiväkodin hiekkalaatikkoleikkejä": { sv: "Tål sandlådelek på dagis", en: "Withstands daycare sandbox play", no: "Tåler barnehagens sandkasselek", da: "Tåler børnehavens sandkasseleg" },
  "Kevyet sadehousut ilman vuorta": { sv: "Lätta regnbyxor utan foder", en: "Light rain trousers without lining", no: "Lette regnbukser uten fôr", da: "Lette regnbukser uden for" },
  "Huomenna sataa — vedenpitävät varusteet mukaan": { sv: "Det regnar i morgon — ta med vattentäta kläder", en: "Rain expected tomorrow — bring waterproof gear", no: "Det regner i morgen — ta med vanntette klær", da: "Det regner i morgen — tag vandtæt tøj med" },
  "Maa on märkä yöllisen sateen jäljiltä": { sv: "Marken är blöt efter nattens regn", en: "Ground is wet from overnight rain", no: "Bakken er våt etter nattens regn", da: "Jorden er våd efter nattens regn" },
  "Vaikka nyt on poutaa, maa on vielä märkä": { sv: "Även om det är uppehåll nu är marken fortfarande blöt", en: "Even though it's dry now, the ground is still wet", no: "Selv om det er opphold nå, er bakken fortsatt våt", da: "Selvom det er tørvejr nu, er jorden stadig våd" },
  "Kova tuuli lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros": { sv: "Stark vind ökar kylkänslan — välj vindtätt skalplagg", en: "Strong wind increases wind chill — choose a windproof shell layer", no: "Sterk vind øker kuldefølelsen — velg vindtett skallplagg", da: "Stærk vind øger kuldefølelsen — vælg vindtæt skallag" },
  "Vauva on paikoillaan — lisää yksi kerros lämpöä": { sv: "Babyn sitter still — lägg till ett extra värmande lager", en: "Baby is stationary — add one extra warm layer", no: "Babyen sitter stille — legg til et ekstra varmt lag", da: "Babyen sidder stille — tilføj et ekstra varmt lag" },
  "Aurinkoinen sää — lippis suojaa": { sv: "Soligt väder — keps skyddar", en: "Sunny weather — cap protects", no: "Solrikt vær — caps beskytter", da: "Solrigt vejr — kasket beskytter" },
  "Paksu pipo kovaan pakkaseen": { sv: "Tjock mössa i hård kyla", en: "Thick beanie for hard frost", no: "Tykk lue til hard kulde", da: "Tyk hue til hård frost" },
  "Ohut pipo viileään säähän": { sv: "Tunn mössa i svalt väder", en: "Thin beanie for cool weather", no: "Tynn lue til kjølig vær", da: "Tynd hue til køligt vejr" },
};

export type { ClothingItem } from "./weatherData";

/**
 * Translate a ClothingItem's name and description based on current language.
 * Falls back to the original Finnish text if no translation is found.
 */
export function translateClothingItem(
  item: { name: string; description: string },
  lang: Language
): { name: string; description: string } {
  if (lang === "fi") return item;
  const nameT = clothingNameMap[item.name];
  const descT = clothingDescMap[item.description];
  return {
    name: nameT ? nameT[lang] : item.name,
    description: descT ? descT[lang] : item.description,
  };
}
