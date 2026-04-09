import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "fi" | "sv" | "en";

const LANG_KEY = "saavahti-language";

function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "sv") return "sv";
  if (saved === "en") return "en";
  return "fi";
}

// Flat translation keys
const translations = {
  // Header
  "header.title": { fi: "Säävahti", sv: "Väderpytten", en: "Säävahti" },
  "header.subtitle": { fi: "Älykäs apu aamun varustevalintoihin", sv: "Smart hjälp med morgonens utrustningsval", en: "Smart help for morning outfit choices" },

  // Location search
  "location.weatherNow": { fi: "Sää nyt", sv: "Väder nu", en: "Weather now" },
  "location.useCurrentLocation": { fi: "Käytä nykyistä sijaintia", sv: "Använd nuvarande plats", en: "Use current location" },
  "location.searchPlaceholder": { fi: "Etsi paikkakuntaa (esim. Tampere)...", sv: "Sök ort (t.ex. Stockholm)...", en: "Search city (e.g. Helsinki)..." },
  "location.updating": { fi: "Päivitetään säätietoja...", sv: "Uppdaterar väderdata...", en: "Updating weather data..." },
  "location.notFound": { fi: "Hups! Säätietoja ei löytynyt. Tarkista kirjoitusasu.", sv: "Hoppsan! Väderdata hittades inte. Kontrollera stavningen.", en: "Oops! Weather data not found. Check the spelling." },
  "location.geoError": { fi: "Paikannus epäonnistui. Tarkista selaimen asetukset.", sv: "Positionering misslyckades. Kontrollera webbläsarens inställningar.", en: "Geolocation failed. Check browser settings." },
  "location.geoNotSupported": { fi: "Selaimesi ei tue paikannusta.", sv: "Din webbläsare stöder inte positionering.", en: "Your browser does not support geolocation." },
  "location.noConnection": { fi: "Ei yhteyttä, näytetään viimeisin tallennettu sää.", sv: "Ingen anslutning, visar senast sparad väderdata.", en: "No connection, showing last saved weather." },
  "location.testData": { fi: "API ei ole vielä käytettävissä — näytetään testisäätiedot.", sv: "API är inte tillgängligt ännu — visar testväderdata.", en: "API not available yet — showing test weather data." },
  "location.coordsNotFound": { fi: "Sijaintiin perustuvia säätietoja ei löytynyt.", sv: "Platsbaserad väderdata hittades inte.", en: "Location-based weather data not found." },

  // Weather card
  "weather.feelsLike": { fi: "Tuntuu kuin", sv: "Känns som", en: "Feels like" },
  "weather.country": { fi: "Suomi", sv: "Sverige", en: "Finland" },
  "weather.justUpdated": { fi: "Juuri päivitetty", sv: "Nyss uppdaterad", en: "Just updated" },
  "weather.updatedAgo": { fi: "Päivitetty {min} min sitten", sv: "Uppdaterad {min} min sedan", en: "Updated {min} min ago" },
  "weather.refreshNow": { fi: "Päivitä nyt", sv: "Uppdatera nu", en: "Refresh now" },
  "weather.rain": { fi: "Sade", sv: "Regn", en: "Rain" },

  // Morning summary
  "morning.title": { fi: "☀️ Vinkki aamuun", sv: "☀️ Morgontips", en: "☀️ Morning tip" },
  "morning.loading": { fi: "Haetaan päivän suosituksia...", sv: "Hämtar dagens rekommendationer...", en: "Fetching today's recommendations..." },
  "morning.rainStart": { fi: "Säävahti huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Vädervakten märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", en: "Säävahti noticed: rain starts around {time}. Remember rain gear for daycare!" },
  "morning.rainStart.school": { fi: "Säävahti huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Vädervakten märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", en: "Säävahti noticed: rain starts around {time}. Remember rain gear for school!" },
  "morning.rainDaycare": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", en: "Rain starts around {time}. Remember rain gear for daycare!" },
  "morning.rainDaycare.school": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", en: "Rain starts around {time}. Remember rain gear for school!" },
  "morning.freezing": { fi: "Säävahti huomasi: tie on liukas ja aamu on kylmä, valitse lämpimät kengät.", sv: "Vädervakten märkte: vägen är hal och morgonen kall, välj varma skor.", en: "Säävahti noticed: roads are slippery and the morning is cold, choose warm shoes." },
  "morning.uvHigh": { fi: "Säävahti huomasi: UV-indeksi nousee yli 3 tänään. Muista aurinkorasva lapselle!", sv: "Vädervakten märkte: UV-index stiger över 3 idag. Kom ihåg solskyddskräm!", en: "Säävahti noticed: UV index rises above 3 today. Remember sunscreen for the child!" },
  "morning.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing." },
  "morning.calmDay": { fi: "Sää on vakaa, nauti päivästä! Normaalit kauden vaatteet riittävät. 🌤️", sv: "Vädret är stabilt, njut av dagen! Normala säsongskläder räcker. 🌤️", en: "Weather is stable, enjoy the day! Normal seasonal clothes will do. 🌤️" },

  // Night alert
  "night.title": { fi: "🌙 Ilta-muistutus", sv: "🌙 Kvällspåminnelse", en: "🌙 Evening reminder" },
  "night.freezing": { fi: "Huomiseksi pakastuu ({from}° → {to}°), etsi toppahousut valmiiksi!", sv: "Det fryser i morgon ({from}° → {to}°), plocka fram täckbyxor!", en: "Freezing tomorrow ({from}° → {to}°), get snow trousers ready!" },
  "night.hardFrost": { fi: "Yöllä kireä pakkanen ({temp}°), jätä vaatteet eteiseen valmiiksi!", sv: "Hård frost i natt ({temp}°), lägg kläderna i hallen!", en: "Hard frost tonight ({temp}°), lay out clothes in the hallway!" },
  "night.tomorrowColder": { fi: "Säävahti huomasi: huominen on selvästi kylmempi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Vädervakten märkte: i morgon blir det betydligt kallare ({today}° → {tomorrow}°). Förbered klädombyte!", en: "Säävahti noticed: tomorrow is much colder than today ({today}° → {tomorrow}°). Prepare for a clothing change!" },
  "night.tomorrowWarmer": { fi: "Säävahti huomasi: huominen on selvästi lämpimämpi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Vädervakten märkte: i morgon blir det betydligt varmare ({today}° → {tomorrow}°). Förbered klädombyte!", en: "Säävahti noticed: tomorrow is much warmer than today ({today}° → {tomorrow}°). Prepare for a clothing change!" },
  "night.tomorrowRain": { fi: "Huomenna tarvitaan kuravarusteita, tarkista että ne ovat repussa.", sv: "I morgon behövs regnutrustning, kontrollera att den finns i ryggsäcken.", en: "Rain gear needed tomorrow, check that it's in the backpack." },
  "night.dryGear": { fi: "Muista ottaa märät varusteet ja kengät kuivumaan! 👟", sv: "Kom ihåg att torka blöta kläder och skor! 👟", en: "Remember to dry wet gear and shoes! 👟" },
  "night.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää huomenna.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder i morgon.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing tomorrow." },

  // Age groups
  "age.title": { fi: "Lapsen ikäryhmä", sv: "Barnets åldersgrupp", en: "Child's age group" },
  "age.vauva": { fi: "Vauva", sv: "Baby", en: "Baby" },
  "age.taapero": { fi: "Taapero", sv: "Småbarn", en: "Toddler" },
  "age.leikki-ikäinen": { fi: "Leikki-ikäinen", sv: "Förskoleålder", en: "Preschooler" },
  "age.koululainen": { fi: "Koululainen", sv: "Skolbarn", en: "School age" },
  "age.vauva.ages": { fi: "0–1 v", sv: "0–1 år", en: "0–1 yr" },
  "age.taapero.ages": { fi: "1–3 v", sv: "1–3 år", en: "1–3 yr" },
  "age.leikki-ikäinen.ages": { fi: "3–6 v", sv: "3–6 år", en: "3–6 yr" },
  "age.koululainen.ages": { fi: "7–10 v", sv: "7–10 år", en: "7–10 yr" },

  // Clothing card
  "clothing.title": { fi: "🧥 Pukeutumissuositus", sv: "🧥 Klädrekommendation", en: "🧥 Clothing recommendation" },

  // Checklist
  "checklist.title": { fi: "🎒 Päiväkoti-reppu", sv: "🎒 Dagisryggsäck", en: "🎒 Daycare backpack" },
  "checklist.title.school": { fi: "🎒 Koulureppu", sv: "🎒 Skolryggsäck", en: "🎒 School backpack" },
  "checklist.allPacked": { fi: "✅ Kaikki pakattu!", sv: "✅ Allt packat!", en: "✅ All packed!" },
  "checklist.weatherGear": { fi: "🌦️ Säänmukaiset varusteet", sv: "🌦️ Väderanpassad utrustning", en: "🌦️ Weather-appropriate gear" },
  "checklist.spareClothes": { fi: "👕 Perusvarusteet", sv: "👕 Basutrustning", en: "👕 Essentials" },
  "checklist.miscItems": { fi: "🎲 Satunnaiset tavarat", sv: "🎲 Övriga saker", en: "🎲 Miscellaneous items" },
  "checklist.myNote": { fi: "📝 Oma muistiinpano", sv: "📝 Min anteckning", en: "📝 My note" },
  "checklist.notePlaceholder": { fi: "Kirjoita tähän oma tavara tai muistutus…", sv: "Skriv din egen sak eller påminnelse här…", en: "Write your own item or reminder here…" },
  "checklist.fridayReminder": { fi: "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!", sv: "📋 Kom ihåg att tömma ryggsäcken inför helgen och kontrollera ombyteskläderna!", en: "📋 Remember to empty the backpack for the weekend and check spare clothes!" },
  "checklist.sundayReminder": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till dagis!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for daycare!" },
  "checklist.sundayReminder.school": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet kouluun!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till skolan!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for school!" },
  "checklist.mondayReminder": { fi: "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till dagis idag!", en: "👕 Remember to bring spare clothes back to daycare today!" },
  "checklist.mondayReminder.school": { fi: "👕 Muista viedä vaihtovaatteet takaisin kouluun tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till skolan idag!", en: "👕 Remember to bring spare clothes back to school today!" },

  // Checklist items
  "item.varahousut": { fi: "Varahousut", sv: "Reservbyxor", en: "Spare trousers" },
  "item.varapaita": { fi: "Varapaita", sv: "Reservtröja", en: "Spare shirt" },
  "item.alusvaatteet": { fi: "Alusvaatteet (2 kpl)", sv: "Underkläder (2 st)", en: "Underwear (2 pcs)" },
  "item.varahanskat": { fi: "Varahanskat", sv: "Reservvantar", en: "Spare gloves" },
  "item.vaihtosukat": { fi: "Vaihtosukat", sv: "Reservstrumpor", en: "Spare socks" },
  "item.vaippapaketti": { fi: "Vaippapaketti", sv: "Blöjpaket", en: "Diaper pack" },
  "item.tutti": { fi: "Tutti", sv: "Napp", en: "Pacifier" },
  "item.unilelu": { fi: "Unilelu", sv: "Gossedjur", en: "Comfort toy" },
  "item.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", en: "Sunscreen" },
  "item.juomapullo": { fi: "Juomapullo", sv: "Vattenflaska", en: "Water bottle" },
  "item.omalelu": { fi: "Oma lelu", sv: "Egen leksak", en: "Own toy" },
  "item.välipala": { fi: "Välipala", sv: "Mellanmål", en: "Snack" },
  "item.avaimet": { fi: "Avaimet", sv: "Nycklar", en: "Keys" },
  "item.uikkarit": { fi: "Uikkarit & pyyhe", sv: "Badkläder & handduk", en: "Swimwear & towel" },
  "item.sisäliikunta": { fi: "Sisäliikuntavaatteet & pyyhe", sv: "Inomhusidrottskläder & handduk", en: "Indoor sports clothes & towel" },
  "item.lippis": { fi: "Lippis/Hattu", sv: "Keps/Hatt", en: "Cap/Hat" },
  "item.kuravarusteet": { fi: "Kuravarusteet", sv: "Regnutrustning", en: "Rain gear" },
  "item.vaihtohanskat": { fi: "Vaihtohanskat", sv: "Extravantar", en: "Extra gloves" },
  "item.lamminkerrasto": { fi: "Lämmin kerrasto", sv: "Varmt underställ", en: "Warm base layer" },
  "item.luistimet": { fi: "Luistimet & kypärä", sv: "Skridskor & hjälm", en: "Ice skates & helmet" },

  // Weekdays
  "weekday.0": { fi: "Sunnuntai", sv: "Söndag", en: "Sunday" },
  "weekday.1": { fi: "Maanantai", sv: "Måndag", en: "Monday" },
  "weekday.2": { fi: "Tiistai", sv: "Tisdag", en: "Tuesday" },
  "weekday.3": { fi: "Keskiviikko", sv: "Onsdag", en: "Wednesday" },
  "weekday.4": { fi: "Torstai", sv: "Torsdag", en: "Thursday" },
  "weekday.5": { fi: "Perjantai", sv: "Fredag", en: "Friday" },
  "weekday.6": { fi: "Lauantai", sv: "Lördag", en: "Saturday" },
  "weather.today": { fi: "Tänään", sv: "Idag", en: "Today" },

  // Tomorrow forecast
  "tomorrow.title": { fi: "Huomisen sää — Ennuste", sv: "Morgondagens väder — Prognos", en: "Tomorrow's weather — Forecast" },
  "tomorrow.rainProb": { fi: "Sateen todennäköisyys", sv: "Regnchans", en: "Rain probability" },
  "tomorrow.prepTitle": { fi: "Valmistele huomiseksi — Poimi valmiiksi:", sv: "Förbered till i morgon — Plocka fram:", en: "Prepare for tomorrow — Get ready:" },
  "tomorrow.colderWarning": { fi: "Huomiseksi kylmenee, muista lämpimämpi kerrasto.", sv: "Det blir kallare i morgon, kom ihåg varmare underställ.", en: "It gets colder tomorrow, remember warmer layers." },
  "tomorrow.rainWarning": { fi: "Huomenna sataa, muista viedä kuravarusteet päiväkotiin.", sv: "Det regnar i morgon, kom ihåg att ta med regnutrustning till dagis.", en: "Rain expected tomorrow, remember rain gear for daycare." },
  "tomorrow.morningGear": { fi: "Aamun varusteet", sv: "Morgonens utrustning", en: "Morning gear" },
  "tomorrow.afternoonGear": { fi: "Iltapäivän varusteet", sv: "Eftermiddagens utrustning", en: "Afternoon gear" },

  // AI Analysis
  "ai.title": { fi: "Säävahdin analyysi", sv: "Väderpyttens analys", en: "Säävahti's analysis" },
  "ai.ageGroup": { fi: "Ikäryhmä", sv: "Åldersgrupp", en: "Age group" },
  "ai.analyzing": { fi: "Analysoidaan...", sv: "Analyserar...", en: "Analyzing..." },
  "ai.updated": { fi: "Päivitetty", sv: "Uppdaterad", en: "Updated" },
  "ai.rainTip": { fi: "🌧️ Huomataan lähestyvä sadealue klo 14. Suosittelen kuravarusteita jo aamusta, jotta ulkoilu ei keskeydy.", sv: "🌧️ Vi ser ett regnområde som närmar sig kl 14. Jag rekommenderar regnutrustning redan på morgonen så att utevistelsen inte avbryts.", en: "🌧️ A rain area is approaching around 14:00. I recommend rain gear from the morning so outdoor time isn't interrupted." },
  "ai.hardWindTip": { fi: "💨 Tänään on kova tuuli ({speed} m/s). Vaikka mittari näyttää {temp}°C, viima tuntuu pakkaselta. Valitse tuulenpitävä kuorikerros.", sv: "💨 Det blåser kraftigt idag ({speed} m/s). Även om termometern visar {temp}°C känns det kallare med vinden. Välj ett vindtätt skalplagg.", en: "💨 Strong wind today ({speed} m/s). Even though it shows {temp}°C, wind chill makes it feel freezing. Choose a windproof shell layer." },
  "ai.moderateWindTip": { fi: "💨 Kohtalainen tuuli ({speed} m/s) viilentää tuntuvasti. Tuulenpitävä kerros on hyvä valinta.", sv: "💨 Måttlig vind ({speed} m/s) kyler ner märkbart. Ett vindtätt lager är ett bra val.", en: "💨 Moderate wind ({speed} m/s) cools noticeably. A windproof layer is a good choice." },
  "ai.layeringTip": { fi: "🌡️ Aamu on kylmä ({feelsLike}°C tuntuu), mutta iltapäivällä lämpötila nousee ({temp}°C). Kerrospukeutuminen on tänään avainasemassa.", sv: "🌡️ Morgonen är kall (känns som {feelsLike}°C), men på eftermiddagen stiger temperaturen ({temp}°C). Lagerklädsel är nyckeln idag.", en: "🌡️ Morning is cold (feels like {feelsLike}°C), but afternoon warms up ({temp}°C). Layering is key today." },
  "ai.uvTip": { fi: "☀️ UV-indeksi on korkea ({uvi}). Aurinko paistaa voimakkaasti. Suojaa lapsen iho aurinkorasvalla, vaikka tuntuisi viileältä. Lippis ja aurinkolasit mukaan{age}!", sv: "☀️ UV-index är högt ({uvi}). Solen skiner starkt. Skydda barnets hud med solskyddskräm, även om det känns svalt. Ta med keps och solglasögon{age}!", en: "☀️ UV index is high ({uvi}). The sun is strong. Protect the child's skin with sunscreen, even if it feels cool. Bring cap and sunglasses{age}!" },
  "ai.sunnyUvTip": { fi: "☀️ Korkea UV-indeksi. Muista aurinkorasva ja lippis suojaksi.", sv: "☀️ Högt UV-index. Kom ihåg solskyddskräm och keps som skydd.", en: "☀️ High UV index. Remember sunscreen and a cap for protection." },
  "ai.calmDay": { fi: "✅ Tänään on rauhallinen sääpäivä ({temp}°C, {desc}). Normaalit kauden vaatteet riittävät hyvin.", sv: "✅ En lugn väderdag idag ({temp}°C, {desc}). Normala säsongskläder räcker bra.", en: "✅ A calm weather day ({temp}°C, {desc}). Normal seasonal clothing will do just fine." },
  "ai.mudTip": { fi: "💡 Vaikka nyt on poutaa, maa on vielä märkä. Kurahousut ovat hyvä valinta suojaamaan vaatteet hiekkalaatikolla.", sv: "💡 Även om det är uppehåll nu är marken fortfarande blöt. Regnbyxor är ett bra val för att skydda kläderna i sandlådan.", en: "💡 Even though it's dry now, the ground is still wet. Rain trousers are a good choice to protect clothes at the sandbox." },
  "ai.gapTip": { fi: "🌡️ Aamu on kylmä ({amTemp}°C), mutta iltapäivällä tarkenee vähemmällä ({pmTemp}°C). Muista kerrospukeutuminen ja pakkaa ohuempi paita reppuun.", sv: "🌡️ Morgonen är kall ({amTemp}°C), men på eftermiddagen klarar man sig med mindre ({pmTemp}°C). Kom ihåg lagerklädsel och packa en tunnare tröja i ryggsäcken.", en: "🌡️ Morning is cold ({amTemp}°C), but afternoon is warmer ({pmTemp}°C). Remember layering and pack a lighter shirt in the backpack." },
  "ai.layerZoneTip": { fi: "🧤 Suosi tänään kerrospukeutumista. Ohut villakerros väliin pitää lapsen lämpimänä ilman hikoilua.", sv: "🧤 Föredra lagerklädsel idag. Ett tunt ullager emellan håller barnet varmt utan att svettas.", en: "🧤 Layer up today. A thin wool layer in between keeps the child warm without sweating." },
   "ai.windChillTip": { fi: "🌬️ Tuuli tekee säästä purevan ({speed} m/s), suosi tuulenpitävää kuorikerrosta.", sv: "🌬️ Vinden gör vädret bitande ({speed} m/s), välj vindtätt skalplagg.", en: "🌬️ Wind makes the weather biting ({speed} m/s), choose a windproof shell layer." },
   "ai.uvReminderTip": { fi: "☀️ Aurinko on voimakasta (UV {uvi}). Muista aurinkorasva ja hattu.", sv: "☀️ Solen är stark (UV {uvi}). Kom ihåg solskyddskräm och hatt.", en: "☀️ The sun is strong (UV {uvi}). Remember sunscreen and a hat." },
   "ai.mudTipWet": { fi: "💡 Maa on yhä märkä sateen jäljiltä. Kurahousut suojaavat vaatteet leikeissä.", sv: "💡 Marken är fortfarande blöt efter regnet. Regnbyxor skyddar kläderna under leken.", en: "💡 The ground is still wet from rain. Rain trousers protect clothes during play." },
   "ai.morningGapHighlight": { fi: "⭐ Vinkki aamuun: Aamu on kylmä ({amTemp}°C), mutta iltapäivällä lämpenee huomattavasti ({pmTemp}°C). Pakkaa ohuempi paita reppuun ja suosi kerrospukeutumista.", sv: "⭐ Morgontips: Morgonen är kall ({amTemp}°C), men det blir betydligt varmare på eftermiddagen ({pmTemp}°C). Packa en tunnare tröja i ryggsäcken och satsa på lagerklädsel.", en: "⭐ Morning tip: The morning is cold ({amTemp}°C), but it warms up significantly in the afternoon ({pmTemp}°C). Pack a lighter shirt in the backpack and layer up." },
   "ai.springTip": { fi: "☀️ Kevätaurinko lämmittää! Vaikka lämpömittari näyttää lievää pakkasta, välikausivaatteet hyvällä välikerroksella ovat nyt paras valinta aktiiviseen ulkoiluun.", sv: "☀️ Vårsolen värmer! Även om termometern visar lätt frost är mellansäsongskläder med ett bra mellanlager nu det bästa valet för aktiv utevistelse.", en: "☀️ The spring sun is warming things up! Even though the thermometer shows a slight frost, mid-season gear with a good mid-layer is now the best choice for active play." },
   "ai.springWindTip": { fi: "💨 Vaikka tuuli on pureva, kevätaurinko lämmittää jo tehokkaasti. Pysytään välikausivaatteissa, mutta muista lisätä lämmin välikerros (villa/fleece) tuulensuojaksi.", sv: "💨 Även om vinden biter, värmer vårsolen redan effektivt. Vi håller oss till skalkläder, men glöm inte ett varmt mellanlager (ull/fleece) som vindskydd.", en: "💨 Even though the wind is biting, the spring sun is already warming effectively. Stick with mid-season gear, but remember to add a warm mid-layer (wool/fleece) for wind protection." },
   "ai.hasSpecialTip": { fi: "Erityishuomio", sv: "Specialtips", en: "Special tip" },
  "ai.ageLabel.vauva": { fi: " vauvalle", sv: " för babyn", en: " for the baby" },
  "ai.ageLabel.taapero": { fi: " taaperolle", sv: " för småbarnet", en: " for the toddler" },
  "ai.ageLabel.leikki-ikäinen": { fi: " leikki-ikäiselle", sv: " för förskolebarnet", en: " for the preschooler" },
  "ai.ageLabel.koululainen": { fi: " koululaiselle", sv: " för skolbarnet", en: " for the school child" },

  // UV Alert
  "uv.veryHigh": { fi: "Erittäin korkea", sv: "Mycket högt", en: "Very high" },
  "uv.high": { fi: "Korkea", sv: "Högt", en: "High" },
  "uv.moderate": { fi: "Kohtalainen", sv: "Måttligt", en: "Moderate" },
  "uv.titleFormat": { fi: "{level} UV-indeksi ({uvi})", sv: "{level} UV-index ({uvi})", en: "{level} UV index ({uvi})" },
  "uv.description": { fi: "Muista aurinkorasva ja hattu! Suojaa lapsen iho, silmät ja pää auringolta.", sv: "Kom ihåg solskyddskräm och hatt! Skydda barnets hud, ögon och huvud mot solen.", en: "Remember sunscreen and a hat! Protect the child's skin, eyes and head from the sun." },

  // Schedule
  "schedule.title.vauva": { fi: "Vauvan", sv: "Babyns", en: "Baby's" },
  "schedule.title.taapero": { fi: "Taaperon", sv: "Småbarnets", en: "Toddler's" },
  "schedule.title.leikki-ikäinen": { fi: "Leikki-ikäisen", sv: "Förskolebarnets", en: "Preschooler's" },
  "schedule.title.koululainen": { fi: "Koululaisen", sv: "Skolbarnets", en: "School child's" },
  "schedule.weeklySchedule": { fi: "viikko-ohjelma", sv: "veckoschema", en: "weekly schedule" },
  "schedule.addImageDesc": { fi: "Lisää kuva lukujärjestyksestä tai päiväkodin viikko-ohjelmasta", sv: "Lägg till bild på schemat eller dagisens veckoprogram", en: "Add a photo of the schedule or daycare weekly program" },
  "schedule.saving": { fi: "Tallennetaan...", sv: "Sparar...", en: "Saving..." },
  "schedule.saved": { fi: "Kuva tallennettu!", sv: "Bilden sparad!", en: "Image saved!" },
  "schedule.saveError": { fi: "Hups! Kuva on liian suuri tai tallennus epäonnistui. Yritä pienemmällä kuvalla.", sv: "Hoppsan! Bilden är för stor eller sparningen misslyckades. Prova med en mindre bild.", en: "Oops! Image is too large or saving failed. Try a smaller image." },
  "schedule.viewLarge": { fi: "Katso isona", sv: "Visa i fullstorlek", en: "View full size" },
  "schedule.changeImage": { fi: "Vaihda kuva", sv: "Byt bild", en: "Change image" },
  "schedule.removeImage": { fi: "Poista kuva", sv: "Ta bort bild", en: "Remove image" },
  "schedule.addSchedule": { fi: "Lisää lukujärjestys", sv: "Lägg till schema", en: "Add schedule" },
  "schedule.takeOrSelect": { fi: "Ota kuva tai valitse galleriasta", sv: "Ta en bild eller välj från galleriet", en: "Take a photo or select from gallery" },
  "schedule.doubleTapReset": { fi: "Kaksoisnapautus nollataksesi", sv: "Dubbeltryck för att återställa", en: "Double tap to reset" },
  "schedule.pinchToZoom": { fi: "Nipistä zoomataksesi", sv: "Nyp för att zooma", en: "Pinch to zoom" },
  "schedule.close": { fi: "Sulje", sv: "Stäng", en: "Close" },

  // Schedule reminder
  "scheduleReminder.text": { fi: "Tarkista päivän ohjelma kuvasta", sv: "Kontrollera dagens program från bilden", en: "Check today's program from the image" },

  // Affiliate
  "affiliate.title": { fi: "Suosittelemme laadukkaita varusteita", sv: "Vi rekommenderar kvalitetsutrustning", en: "We recommend quality gear" },
  "affiliate.polarnopyret.desc": { fi: "Polarn O. Pyret – Laatua, joka kestää lapselta toiselle", sv: "Polarn O. Pyret – Kvalitet som håller från barn till barn", en: "Polarn O. Pyret – Quality that lasts from child to child" },
  "affiliate.polarnopyret.cta": { fi: "Tutustu ulkoilu- ja arkivaatteisiin", sv: "Upptäck ute- och vardagskläder", en: "Explore outdoor & everyday clothing" },
  "affiliate.lindex.desc": { fi: "Kestävät ja pehmeät arkivaatteet lapsille", sv: "Hållbara och mjuka vardagskläder för barn", en: "Durable and soft everyday clothes for kids" },
  "affiliate.lindex.cta": { fi: "Katso päivän tarjoukset", sv: "Se dagens erbjudanden", en: "See today's deals" },
  "affiliate.disclaimer": {
    fi: "Säävahti suosittelee laadukkaita varusteita arkeen. Linkit ovat mainoslinkkejä, joiden kautta tuet sovelluksen kehitystä.",
    sv: "Väderpytten rekommenderar kvalitetsutrustning för vardagen. Länkarna är annonslänkar som stöder utvecklingen av appen.",
    en: "Säävahti recommends quality gear for everyday life. Links are affiliate links that support the app's development."
  },
  "affiliate.adtraction": {
    fi: "Tämä sivusto on vahvistettu Adtraction-verkostoon.",
    sv: "Denna webbplats är verifierad i Adtraction-nätverket.",
    en: "This site is verified in the Adtraction network."
  },

  // Feedback
  "feedback.title": { fi: "Anna palautetta", sv: "Ge feedback", en: "Give feedback" },
  "feedback.placeholder": { fi: "Mitä voisimme parantaa?", sv: "Vad kan vi förbättra?", en: "What could we improve?" },
  "feedback.send": { fi: "Lähetä palaute", sv: "Skicka feedback", en: "Send feedback" },
  "feedback.sending": { fi: "Lähetetään...", sv: "Skickar...", en: "Sending..." },
  "feedback.thanks": { fi: "Kiitos! Palautteesi on vastaanotettu.", sv: "Tack! Din feedback har mottagits.", en: "Thank you! Your feedback has been received." },
  "feedback.thanksDesc": { fi: "Autat meitä tekemään Säävahdista paremman.", sv: "Du hjälper oss att göra Väderpytten bättre.", en: "You're helping us make Säävahti better." },
  "feedback.error": { fi: "Lähetys epäonnistui. Yritä uudelleen.", sv: "Sändningen misslyckades. Försök igen.", en: "Sending failed. Please try again." },

  // Footer
  "footer.copyright": { fi: "© 2024 Säävahti", sv: "© 2024 Väderpytten", en: "© 2024 Säävahti" },
  "footer.privacy": { fi: "Tietosuoja", sv: "Integritetspolicy", en: "Privacy" },
  "footer.contact": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", en: "Contact" },
  "footer.close": { fi: "Sulje", sv: "Stäng", en: "Close" },
  "footer.privacyTitle": { fi: "Tietosuojaseloste", sv: "Integritetspolicy", en: "Privacy Policy" },
  "footer.contactTitle": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", en: "Contact Information" },
  "footer.privacyS1Title": { fi: "1. Rekisterinpitäjä", sv: "1. Registeransvarig", en: "1. Data Controller" },
  "footer.privacyS1": { fi: "Säävahti-sovellus", sv: "Väderpytten-appen", en: "Säävahti app" },
  "footer.privacyS2Title": { fi: "2. Kerättävät tiedot", sv: "2. Insamlade uppgifter", en: "2. Data Collected" },
  "footer.privacyS2": { fi: "Sovellus tallentaa paikallisesti (selaimen LocalStorage) käyttäjän valitseman kaupungin, ikäryhmävalinnan sekä viikko-ohjelmakuvan. Tietoja ei lähetetä ulkoisille palvelimille.", sv: "Appen sparar lokalt (webbläsarens LocalStorage) användarens valda stad, åldersgrupp och veckoschemabild. Inga uppgifter skickas till externa servrar.", en: "The app stores locally (browser LocalStorage) the selected city, age group, and weekly schedule image. No data is sent to external servers." },
  "footer.privacyS3Title": { fi: "3. Tietojen käyttö", sv: "3. Användning av uppgifter", en: "3. Use of Data" },
  "footer.privacyS3": { fi: "Tallennettuja tietoja käytetään ainoastaan sovelluksen toiminnallisuuden tarjoamiseen, kuten pukeutumissuositusten näyttämiseen ja viikko-ohjelman säilyttämiseen.", sv: "Sparade uppgifter används enbart för att tillhandahålla appens funktionalitet, som att visa klädrekommendationer och spara veckoschemat.", en: "Stored data is used solely for providing app functionality, such as displaying clothing recommendations and saving the weekly schedule." },
  "footer.privacyS4Title": { fi: "4. Evästeet ja analytiikka", sv: "4. Cookies och analys", en: "4. Cookies & Analytics" },
  "footer.privacyS4": { fi: "Sovellus ei käytä kolmannen osapuolen evästeitä. Mahdolliset mainoslinkit (affiliate-linkit) voivat ohjata ulkoisille sivustoille, joilla on omat tietosuojakäytäntönsä.", sv: "Appen använder inga tredjepartscookies. Eventuella annonslänkar (affiliatelänkar) kan leda till externa webbplatser med egna integritetspolicyer.", en: "The app does not use third-party cookies. Affiliate links may redirect to external sites with their own privacy policies." },
  "footer.privacyS5Title": { fi: "5. Tietojen poistaminen", sv: "5. Radering av uppgifter", en: "5. Data Deletion" },
  "footer.privacyS5": { fi: "Käyttäjä voi poistaa kaikki tallentamansa tiedot tyhjentämällä selaimen LocalStorage-tiedot selaimen asetuksista.", sv: "Användaren kan radera alla sparade uppgifter genom att rensa webbläsarens LocalStorage-data i webbläsarens inställningar.", en: "Users can delete all stored data by clearing the browser's LocalStorage in browser settings." },
  "footer.privacyS6Title": { fi: "6. Yhteydenotto", sv: "6. Kontakt", en: "6. Contact" },
  "footer.privacyS6": { fi: "Palautetta ja tietosuojaa koskevia kysymyksiä voit lähettää sähköpostitse:", sv: "Feedback och frågor om integritetspolicyn kan skickas via e-post:", en: "Feedback and privacy-related questions can be sent via email:" },
  "footer.contactIntro": { fi: "Olemme iloisia kuullessamme sinusta! Voit ottaa yhteyttä alla olevilla tavoilla.", sv: "Vi är glada att höra från dig! Du kan kontakta oss på följande sätt.", en: "We'd love to hear from you! You can reach us in the following ways." },
  "footer.emailTitle": { fi: "Sähköposti", sv: "E-post", en: "Email" },
  "footer.partnerTitle": { fi: "Yhteistyö & Mainonta", sv: "Samarbete & Annonsering", en: "Partnership & Advertising" },
  "footer.partnerDesc": { fi: "Kiinnostaako affiliate-yhteistyö tai mainospaikka? Ota yhteyttä sähköpostitse, niin kerromme lisää mahdollisuuksista.", sv: "Intresserad av affiliatesamarbete eller annonsplats? Kontakta oss via e-post så berättar vi mer om möjligheterna.", en: "Interested in affiliate partnerships or ad placements? Contact us by email and we'll share more about the opportunities." },

  // Misc
  "misc.windTip": { fi: "💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!", sv: "💡 Kom ihåg att kontrollera vindbyarna innan utevistelsen!", en: "💡 Remember to check wind gusts before going outside!" },

  // Clothing items (for weatherData translations)
  "cloth.kerrospukeutuminen": { fi: "Kerrospukeutuminen", sv: "Lagerklädsel", en: "Layering" },
  "cloth.kerrospukeutuminen.desc": { fi: "Merinovilla, välikerros ja paksu toppapuku", sv: "Merinoull, mellanskikt och tjock overall", en: "Merino wool, mid layer and thick snow overall" },
  "cloth.toppapuku": { fi: "Toppapuku ja villasukat", sv: "Täckoverall och ullstrumpor", en: "Snow overall and wool socks" },
  "cloth.toppapuku.desc": { fi: "Lämpö: 0 … –10 °C — paksu toppapuku ja villasukat", sv: "Temp: 0 … –10 °C — tjock täckoverall och ullstrumpor", en: "Temp: 0 … –10 °C — thick snow overall and wool socks" },
  "cloth.välikausivaatteet": { fi: "Välikausivaatteet", sv: "Övergångskläder", en: "Mid-season clothing" },
  "cloth.välikausivaatteet.desc": { fi: "+1 … +12 °C — kuoritakki ja kerroksia", sv: "+1 … +12 °C — skaljacka och lager", en: "+1 … +12 °C — shell jacket and layers" },
  "cloth.teknisetkuorivaatteet": { fi: "Tekniset kuorivaatteet", sv: "Tekniska skalkläder", en: "Technical shell clothing" },
  "cloth.teknisetkuorivaatteet.desc": { fi: "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia", sv: "+1 … +12 °C — tekniska skalkläder och lager", en: "+1 … +12 °C — technical shell clothing and layers" },
  "cloth.rattaissalisakerros": { fi: "Rattaissa lisäkerros", sv: "Extra lager i vagnen", en: "Extra layer in stroller" },
  "cloth.rattaissalisakerros.desc": { fi: "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle", sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear" },
  "cloth.tuubihuivi": { fi: "Tuubihuivi", sv: "Tubhalsduk", en: "Neck gaiter" },
  "cloth.tuubihuivi.desc": { fi: "Tuuli yli 5 m/s — tuubihuivi suojaa", sv: "Vind över 5 m/s — tubhalsduk skyddar", en: "Wind over 5 m/s — neck gaiter protects" },
  "cloth.lippalakki": { fi: "Lippalakki", sv: "Keps", en: "Cap" },
  "cloth.lippalakki.desc": { fi: "Aurinkoisella säällä suojaksi", sv: "Skydd i soligt väder", en: "Protection in sunny weather" },
  "cloth.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", en: "Sunscreen" },
  "cloth.aurinkorasva.desc": { fi: "Suojaa iho UV-säteilyltä", sv: "Skyddar huden mot UV-strålning", en: "Protects skin from UV radiation" },
  "cloth.vuorettomat": { fi: "Vuorettomat kurahousut", sv: "Ofodrade regnbyxor", en: "Unlined rain trousers" },
  "cloth.vuorettomat.desc": { fi: "Kevyet sadehousut ilman vuorta", sv: "Lätta regnbyxor utan foder", en: "Light rain trousers without lining" },
  "cloth.kumisaappaat": { fi: "Kumisaappaat", sv: "Gummistövlar", en: "Rubber boots" },
  "cloth.kumisaappaat.desc": { fi: "Kumisaappaat ohuilla sukilla", sv: "Gummistövlar med tunna strumpor", en: "Rubber boots with thin socks" },
  "cloth.kumisaappaat.wool": { fi: "+ villasukat", sv: "+ yllesockor", en: "+ wool socks" },
  "cloth.kumisaappaat.wool.desc": { fi: "Kumisaappaat ja villasukat suojaavat kylmältä", sv: "Gummistövlar och ullstrumpor skyddar mot kylan", en: "Rubber boots and wool socks protect against cold" },
  "cloth.kurahousut": { fi: "Kurahousut ja kurahanskat", sv: "Regnbyxor och regnvantar", en: "Rain trousers and rain gloves" },
  "cloth.kurahousut.desc": { fi: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!", sv: "Regnchans över 40 % — ta med vattentät utrustning!", en: "Rain probability over 40% — bring waterproof gear!" },
  "cloth.lippisUv": { fi: "Lippis/Hattu", sv: "Keps/Hatt", en: "Cap/Hat" },
  "cloth.lippisUv.desc": { fi: "Korkea UV — suojaa pää auringolta", sv: "Högt UV — skydda huvudet mot solen", en: "High UV — protect head from the sun" },
  "cloth.aurinkolasit": { fi: "Aurinkolasit", sv: "Solglasögon", en: "Sunglasses" },
  "cloth.aurinkolasit.desc": { fi: "UV-suoja silmille", sv: "UV-skydd för ögonen", en: "UV protection for eyes" },

  // Cold gear
  "cloth.toppahaalari": { fi: "Toppahaalari", sv: "Täckoverall", en: "Snow overall" },
  "cloth.toppahaalari.desc": { fi: "Paksu talvihaalari", sv: "Tjock vinteroverall", en: "Thick winter overall" },
  "cloth.villakerrastot": { fi: "Villakerrastot", sv: "Ullunderställ", en: "Wool base layers" },
  "cloth.villakerrastot.desc": { fi: "Merinovillaiset aluskerrastot", sv: "Underställ i merinoull", en: "Merino wool base layers" },
  "cloth.villasukat": { fi: "Villasukat", sv: "Ullstrumpor", en: "Wool socks" },
  "cloth.villasukat.desc": { fi: "Paksut villasukat", sv: "Tjocka ullstrumpor", en: "Thick wool socks" },
  "cloth.talvitöppöset": { fi: "Talvitöppöset", sv: "Vinterskor", en: "Winter booties" },
  "cloth.talvitöppöset.desc": { fi: "Lämpimät vauvan kengät", sv: "Varma babyskor", en: "Warm baby shoes" },
  "cloth.lapaset": { fi: "Lapaset", sv: "Vantar", en: "Mittens" },
  "cloth.lapaset.desc": { fi: "Paksut tumput", sv: "Tjocka tumvantar", en: "Thick mittens" },
  "cloth.pipo": { fi: "Pipo", sv: "Mössa", en: "Beanie" },
  "cloth.pipo.desc": { fi: "Villapipo + kypärämyssy", sv: "Ullmössa + hjälmhuva", en: "Wool beanie + balaclava" },
  "cloth.toppahousut": { fi: "Toppahousut", sv: "Täckbyxor", en: "Snow trousers" },
  "cloth.toppahousut.desc": { fi: "Talvitoppahousut", sv: "Vintertäckbyxor", en: "Winter snow trousers" },
  "cloth.toppatakki": { fi: "Toppatakki", sv: "Täckjacka", en: "Winter jacket" },
  "cloth.toppatakki.desc": { fi: "Paksu talvitakki", sv: "Tjock vinterjacka", en: "Thick winter jacket" },
  "cloth.villakerrastot2.desc": { fi: "Aluskerrastot villan päälle", sv: "Underställ ovanpå ullen", en: "Base layers over wool" },
  "cloth.talvisaappaat": { fi: "Talvisaappaat", sv: "Vinterstövlar", en: "Winter boots" },
  "cloth.talvisaappaat.desc": { fi: "Lämpimät vedenpitävät saappaat", sv: "Varma vattentäta stövlar", en: "Warm waterproof boots" },
  "cloth.hanskat": { fi: "Hanskat", sv: "Handskar", en: "Gloves" },
  "cloth.hanskat.desc.taapero": { fi: "Hanskat tai rukkaset", sv: "Handskar eller vantar", en: "Gloves or mittens" },
  "cloth.kauluri": { fi: "Kauluri", sv: "Halskrage", en: "Neck warmer" },
  "cloth.kauluri.desc.taapero": { fi: "Tuubihuivi tai kypärämyssy", sv: "Tubhalsduk eller hjälmhuva", en: "Neck gaiter or balaclava" },
  "cloth.pipo2.desc": { fi: "Lämmin villapipo", sv: "Varm ullmössa", en: "Warm wool beanie" },
  "cloth.hanskat.desc.leikki": { fi: "Sormikkaat tai lapaset", sv: "Fingervantar eller vantar", en: "Finger gloves or mittens" },
  "cloth.pipo3.desc": { fi: "Lämpimä pipo", sv: "Varm mössa", en: "Warm beanie" },
  "cloth.kauluri2.desc": { fi: "Tuubihuivi", sv: "Tubhalsduk", en: "Neck gaiter" },
  "cloth.välikerrastot": { fi: "Välikerrastot", sv: "Mellanunderställ", en: "Mid base layers" },
  "cloth.välikerrastot.desc": { fi: "Kerrostettavat alusvaatteet", sv: "Lagerbara underkläder", en: "Layerable underwear" },
  "cloth.talvikengät": { fi: "Talvikengät", sv: "Vinterskor", en: "Winter shoes" },
  "cloth.talvikengät.desc": { fi: "Lämpimät kengät", sv: "Varma skor", en: "Warm shoes" },
  "cloth.kauluri3.desc": { fi: "Kauluri, huivi tai kypärämyssy", sv: "Halskrage, halsduk eller hjälmhuva", en: "Neck warmer, scarf or balaclava" },

  // Mild rain gear
  "cloth.välikausihaalari": { fi: "Välikausihaalari", sv: "Skaloverall", en: "Mid-season overall" },
  "cloth.välikausihaalari.desc": { fi: "Kevyt haalari", sv: "Lätt overall", en: "Light overall" },
  "cloth.sadehaalari": { fi: "Sadehaalari", sv: "Regnoverall", en: "Rain overall" },
  "cloth.sadehaalari.desc": { fi: "Vedenpitävä haalari päälle", sv: "Vattentät overall ovanpå", en: "Waterproof overall on top" },
  "cloth.kumisaappaat2.desc": { fi: "Pienet kumpparet", sv: "Små gummistövlar", en: "Small rubber boots" },
  "cloth.ohutpipo": { fi: "Ohut pipo", sv: "Tunn mössa", en: "Thin beanie" },
  "cloth.ohutpipo.desc": { fi: "Puuvillapipo", sv: "Bomullsmössa", en: "Cotton beanie" },
  "cloth.välikausihousut": { fi: "Välikausihousut", sv: "Övergångsbyxor", en: "Mid-season trousers" },
  "cloth.välikausihousut.desc": { fi: "Joustavat välikausihousut", sv: "Stretchiga övergångsbyxor", en: "Flexible mid-season trousers" },
  "cloth.kuoritakki": { fi: "Kuoritakki", sv: "Skaljacka", en: "Shell jacket" },
  "cloth.kuoritakki.desc": { fi: "Tuulenpitävä kuoritakki", sv: "Vindtät skaljacka", en: "Windproof shell jacket" },
  "cloth.välikausikengät": { fi: "Välikausikengät", sv: "Övergångsskor", en: "Mid-season shoes" },
  "cloth.välikausikengät.desc": { fi: "Vettähylkivät välikausikengät", sv: "Vattenavvisande övergångsskor", en: "Water-repellent mid-season shoes" },
  "cloth.välikerrasto": { fi: "Välikerrasto", sv: "Mellanskikt", en: "Mid layer" },
  "cloth.välikerrasto.desc": { fi: "Fleece tai villainen", sv: "Fleece eller ull", en: "Fleece or wool" },

  // Warm spring
  "cloth.body": { fi: "Body", sv: "Body", en: "Bodysuit" },
  "cloth.body.desc": { fi: "Ohut puuvillabody", sv: "Tunn bomullsbody", en: "Thin cotton bodysuit" },
  "cloth.ohuthaalari": { fi: "Ohut haalari", sv: "Tunn overall", en: "Thin overall" },
  "cloth.ohuthaalari.desc": { fi: "Kevyt ulkohaalari", sv: "Lätt utomhusoverall", en: "Light outdoor overall" },
  "cloth.collegehousut": { fi: "Collegehousut", sv: "Mjukisbyxor", en: "Joggers" },
  "cloth.collegehousut.desc": { fi: "Joustavat collegehousut", sv: "Stretchiga mjukisbyxor", en: "Flexible joggers" },
  "cloth.pitkähihainen": { fi: "Pitkähihainen paita", sv: "Långärmad tröja", en: "Long-sleeve shirt" },
  "cloth.pitkähihainen.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", en: "Light long-sleeve" },
  "cloth.kevyttakki": { fi: "Kevyt takki", sv: "Lätt jacka", en: "Light jacket" },
  "cloth.kevyttakki.desc": { fi: "Kevyt takki tai liivi", sv: "Lätt jacka eller väst", en: "Light jacket or vest" },
  "cloth.lenkkarit": { fi: "Lenkkarit", sv: "Sneakers", en: "Sneakers" },
  "cloth.lenkkarit.desc": { fi: "Kevyet kengät", sv: "Lätta skor", en: "Light shoes" },
  "cloth.farkut": { fi: "Farkut", sv: "Jeans", en: "Jeans" },
  "cloth.farkut.desc": { fi: "Farkut tai collegehousut", sv: "Jeans eller mjukisbyxor", en: "Jeans or joggers" },
  "cloth.collegehousut2.desc": { fi: "Collegehousut tai farkut", sv: "Mjukisbyxor eller jeans", en: "Joggers or jeans" },
  "cloth.pitkähihainen2.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", en: "Light long-sleeve" },

  // Warm gear
  "cloth.aurinkohattu": { fi: "Aurinkohattu", sv: "Solhatt", en: "Sun hat" },
  "cloth.aurinkohattu.desc": { fi: "Leveälierinen hattu", sv: "Bredbrättad hatt", en: "Wide-brimmed hat" },
  "cloth.tpaita": { fi: "T-paita", sv: "T-shirt", en: "T-shirt" },
  "cloth.tpaita.desc": { fi: "Kevyt paita", sv: "Lätt tröja", en: "Light shirt" },
  "cloth.shortsit": { fi: "Shortsit", sv: "Shorts", en: "Shorts" },
  "cloth.shortsit.desc": { fi: "Kevyet shortsit", sv: "Lätta shorts", en: "Light shorts" },
  "cloth.sandaalit": { fi: "Sandaalit", sv: "Sandaler", en: "Sandals" },
  "cloth.sandaalit.desc": { fi: "Avoimet kengät", sv: "Öppna skor", en: "Open shoes" },
  "cloth.aurinkohattu2.desc": { fi: "Lippalakki tai hattu", sv: "Keps eller hatt", en: "Cap or hat" },
  "cloth.shortsit2.desc": { fi: "Shortsit tai hame", sv: "Shorts eller kjol", en: "Shorts or skirt" },
  "cloth.lippalakki2.desc": { fi: "Aurinkosuoja", sv: "Solskydd", en: "Sun protection" },
  "cloth.huppari": { fi: "Huppari", sv: "Hoodie", en: "Hoodie" },
  "cloth.huppari.desc": { fi: "Fleece tai huppari", sv: "Fleece eller hoodie", en: "Fleece or hoodie" },
  "cloth.välikausikengät2.desc": { fi: "Vettähylkivät kengät", sv: "Vattenavvisande skor", en: "Water-repellent shoes" },

  // Dual recommendation
  "dual.morning": { fi: "Aamun varustus", sv: "Morgonens utrustning", en: "Morning outfit" },
  "dual.afternoon": { fi: "Iltapäivän varustus", sv: "Eftermiddagens utrustning", en: "Afternoon outfit" },
  "dual.windWarning": { fi: "Kova tuuli ({speed} m/s) lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros.", sv: "Stark vind ({speed} m/s) ökar kylkänslan — välj vindtätt skalplagg.", en: "Strong wind ({speed} m/s) increases wind chill — choose a windproof shell layer." },
  "dual.mudWarning": { fi: "Vaikka nyt on poutaa, maa on vielä märkä yöllisen sateen jäljiltä.", sv: "Även om det är uppehåll nu är marken fortfarande blöt efter nattens regn.", en: "Even though it's dry now, the ground is still wet from overnight rain." },
  "dual.gapInfo": { fi: "Lämpötila muuttuu merkittävästi päivän aikana ({morning}°C → {afternoon}°C). Pakkaa iltapäivän varusteet reppuun!", sv: "Temperaturen förändras betydligt under dagen ({morning}°C → {afternoon}°C). Packa eftermiddagens kläder i ryggsäcken!", en: "Temperature changes significantly during the day ({morning}°C → {afternoon}°C). Pack afternoon outfit in the backpack!" },

  // PWA install banner
  "pwa.title": { fi: "Asenna Säävahti puhelimeesi", sv: "Installera Vädervakten på din telefon", en: "Install Säävahti on your phone" },
  "pwa.instructionIos": { fi: "Paina selaimen \"Jaa\"-painiketta (📤) ja valitse \"Lisää kotivalikkoon\".", sv: "Tryck på webbläsarens \"Dela\"-knapp (📤) och välj \"Lägg till på hemskärmen\".", en: "Tap the browser's \"Share\" button (📤) and select \"Add to Home Screen\"." },
  "pwa.instructionAndroid": { fi: "Paina selaimen valikkoa (⋮) ja valitse \"Lisää aloitusnäytölle\".", sv: "Tryck på webbläsarens meny (⋮) och välj \"Lägg till på startskärmen\".", en: "Tap the browser menu (⋮) and select \"Add to Home Screen\"." },
  "pwa.close": { fi: "Sulje", sv: "Stäng", en: "Close" },

  // Share button
  "share.button": { fi: "Jaa puolison kanssa", sv: "Dela med partner", en: "Share with partner" },
  "share.messageIntro": { fi: "Säävahti-muistutus!", sv: "Vädervakten-påminnelse!", en: "Säävahti reminder!" },
  "share.rememberMud": { fi: "Muista kuravarusteet!", sv: "Kom ihåg smutskläderna!", en: "Remember mud gear!" },
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

// Clothing item translation maps (Finnish → { sv, en })
const clothingNameMap: Record<string, { sv: string; en: string }> = {
  "Kerrospukeutuminen": { sv: "Lagerklädsel", en: "Layering" },
  "Toppapuku ja villasukat": { sv: "Täckoverall och ullstrumpor", en: "Snow overall and wool socks" },
  "Välikausivaatteet": { sv: "Övergångskläder", en: "Mid-season clothing" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter" },
  "Lippalakki": { sv: "Keps", en: "Cap" },
  "Aurinkorasva": { sv: "Solskyddskräm", en: "Sunscreen" },
  "Vuorettomat kurahousut": { sv: "Ofodrade regnbyxor", en: "Unlined rain trousers" },
  "Kumisaappaat": { sv: "Gummistövlar", en: "Rubber boots" },
  "Kumisaappaat + villasukat": { sv: "Gummistövlar + ullstrumpor", en: "Rubber boots + wool socks" },
  "Kurahousut ja kurahanskat": { sv: "Regnbyxor och regnvantar", en: "Rain trousers and rain gloves" },
  "Kurahousut": { sv: "Regnbyxor", en: "Rain trousers" },
  "Lippis/Hattu": { sv: "Keps/Hatt", en: "Cap/Hat" },
  "Aurinkolasit": { sv: "Solglasögon", en: "Sunglasses" },
  "Toppahaalari": { sv: "Täckoverall", en: "Snow overall" },
  "Villakerrastot": { sv: "Ullunderställ", en: "Wool base layers" },
  "Villasukat": { sv: "Ullstrumpor", en: "Wool socks" },
  "Talvitöppöset": { sv: "Vinterskor", en: "Winter booties" },
  "Lapaset": { sv: "Vantar", en: "Mittens" },
  "Pipo": { sv: "Mössa", en: "Beanie" },
  "Toppahousut": { sv: "Täckbyxor", en: "Snow trousers" },
  "Toppatakki": { sv: "Täckjacka", en: "Winter jacket" },
  "Talvisaappaat": { sv: "Vinterstövlar", en: "Winter boots" },
  "Hanskat": { sv: "Handskar", en: "Gloves" },
  "Kauluri": { sv: "Halskrage", en: "Neck warmer" },
  "Välikerrastot": { sv: "Mellanunderställ", en: "Mid base layers" },
  "Talvikengät": { sv: "Vinterskor", en: "Winter shoes" },
  "Välikausihaalari": { sv: "Skaloverall", en: "Mid-season overall" },
  "Sadehaalari": { sv: "Regnoverall", en: "Rain overall" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie" },
  "Välikausihousut": { sv: "Övergångsbyxor", en: "Mid-season trousers" },
  "Kuoritakki": { sv: "Skaljacka", en: "Shell jacket" },
  "Välikausikengät": { sv: "Övergångsskor", en: "Mid-season shoes" },
  "Välikerrasto": { sv: "Mellanskikt", en: "Mid layer" },
  "Body": { sv: "Body", en: "Bodysuit" },
  "Ohut haalari": { sv: "Tunn overall", en: "Thin overall" },
  "Collegehousut": { sv: "Mjukisbyxor", en: "Joggers" },
  "Pitkähihainen paita": { sv: "Långärmad tröja", en: "Long-sleeve shirt" },
  "Kevyt takki": { sv: "Lätt jacka", en: "Light jacket" },
  "Lenkkarit": { sv: "Sneakers", en: "Sneakers" },
  "Farkut": { sv: "Jeans", en: "Jeans" },
  "Aurinkohattu": { sv: "Solhatt", en: "Sun hat" },
  "T-paita": { sv: "T-shirt", en: "T-shirt" },
  "Shortsit": { sv: "Shorts", en: "Shorts" },
  "Kevyet kengät": { sv: "Lätta skor", en: "Lightweight shoes" },
  "Huppari": { sv: "Hoodie", en: "Hoodie" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket" },
  "Vedenpitävät ulkoiluhousut": { sv: "Vattentäta utomhusbyxor", en: "Waterproof outdoor trousers" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes" },
  "Vuorellinen sadehaalari": { sv: "Fodrad regnoverall", en: "Lined rain overall" },
  "Kurahanskat": { sv: "Regnvantar", en: "Rain gloves" },
  "Ohuet kuravarusteet": { sv: "Tunna regnkläder", en: "Thin rain gear" },
  "Sadehaalari tai kurahousut & sadetakki": { sv: "Regnoverall eller regnbyxor & regnjacka", en: "Rain overall or rain trousers & rain jacket" },
  "Tuulenpitävä kuorikerros": { sv: "Vindtätt skallager", en: "Windproof shell layer" },
  "Lämpöpussi / lisäkerros": { sv: "Åkpåse / extra lager", en: "Footmuff / extra layer" },
  "Tekniset kuorivaatteet": { sv: "Tekniska skalkläder", en: "Technical shell clothing" },
  "Rattaissa lisäkerros": { sv: "Extra lager i vagnen", en: "Extra layer in stroller" },
  "Puuvillabody": { sv: "Bomullsbody", en: "Cotton bodysuit" },
  "Puuvillahousut": { sv: "Bomullsbyxor", en: "Cotton trousers" },
  "Kypärämyssy": { sv: "Hjälmhuva", en: "Balaclava cap" },
  "Ohuet sukat": { sv: "Tunna strumpor", en: "Thin socks" },
  "Neuletakki": { sv: "Stickad kofta", en: "Knit cardigan" },
  "Ohuet housut": { sv: "Tunna byxor", en: "Thin trousers" },
  "Kevyet housut": { sv: "Lätta byxor", en: "Light trousers" },
  "Sukat": { sv: "Strumpor", en: "Socks" },
  "Huomio": { sv: "OBS", en: "Note" },
  "Ohut kuorihaalari": { sv: "Tunn skaloverall", en: "Thin shell overall" },
  "Sadeasu": { sv: "Regnställ", en: "Rain suit" },
  "Sadehattu": { sv: "Regnhatt", en: "Rain hat" },
  "Tekniset ulkoiluhousut": { sv: "Tekniska utomhusbyxor", en: "Technical outdoor trousers" },
  "Vedenpitävät kengät": { sv: "Vattentäta skor", en: "Waterproof shoes" },
};

const clothingDescMap: Record<string, { sv: string; en: string }> = {
  "Merinovilla, välikerros ja paksu toppapuku": { sv: "Merinoull, mellanskikt och tjock overall", en: "Merino wool, mid layer and thick snow overall" },
  "Lämpö: 0 … –1 °C — paksu toppapuku ja villasukat": { sv: "Temp: 0 … –1 °C — tjock täckoverall och ullstrumpor", en: "Temp: 0 … –1 °C — thick snow overall and wool socks" },
  "+1 … +12 °C — kuoritakki ja kerroksia": { sv: "+1 … +12 °C — skaljacka och lager", en: "+1 … +12 °C — shell jacket and layers" },
  "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia": { sv: "+1 … +12 °C — tekniska skalkläder och lager", en: "+1 … +12 °C — technical shell clothing and layers" },
  "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle": { sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear" },
  "Tuuli yli 5 m/s — tuubihuivi suojaa": { sv: "Vind över 5 m/s — tubhalsduk skyddar", en: "Wind over 5 m/s — neck gaiter protects" },
  "Aurinkoisella säällä suojaksi": { sv: "Skydd i soligt väder", en: "Protection in sunny weather" },
  "Suojaa iho UV-säteilyltä": { sv: "Skyddar huden mot UV-strålning", en: "Protects skin from UV radiation" },
  "Paksu talvihaalari": { sv: "Tjock vinteroverall", en: "Thick winter overall" },
  "Merinovillaiset aluskerrastot": { sv: "Underställ i merinoull", en: "Merino wool base layers" },
  "Paksut villasukat": { sv: "Tjocka ullstrumpor", en: "Thick wool socks" },
  "Lämpimät vauvan kengät": { sv: "Varma babyskor", en: "Warm baby shoes" },
  "Paksut tumput": { sv: "Tjocka tumvantar", en: "Thick mittens" },
  "Villapipo + kypärämyssy": { sv: "Ullmössa + hjälmhuva", en: "Wool beanie + balaclava" },
  "Talvitoppahousut": { sv: "Vintertäckbyxor", en: "Winter snow trousers" },
  "Paksu talvitakki": { sv: "Tjock vinterjacka", en: "Thick winter jacket" },
  "Aluskerrastot villan päälle": { sv: "Underställ ovanpå ullen", en: "Base layers over wool" },
  "Lämpimät vedenpitävät saappaat": { sv: "Varma vattentäta stövlar", en: "Warm waterproof boots" },
  "Hanskat tai rukkaset": { sv: "Handskar eller vantar", en: "Gloves or mittens" },
  "Tuubihuivi tai kypärämyssy": { sv: "Tubhalsduk eller hjälmhuva", en: "Neck gaiter or balaclava" },
  "Lämmin villapipo": { sv: "Varm ullmössa", en: "Warm wool beanie" },
  "Talvihousut": { sv: "Vinterbyxor", en: "Winter trousers" },
  "Talvitakki": { sv: "Vinterjacka", en: "Winter jacket" },
  "Aluskerrastot": { sv: "Underställ", en: "Base layers" },
  "Lämpimät saappaat": { sv: "Varma stövlar", en: "Warm boots" },
  "Sormikkaat tai lapaset": { sv: "Fingervantar eller vantar", en: "Finger gloves or mittens" },
  "Lämpimä pipo": { sv: "Varm mössa", en: "Warm beanie" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter" },
  "Kerrostettavat alusvaatteet": { sv: "Lagerbara underkläder", en: "Layerable underwear" },
  "Lämpimät kengät": { sv: "Varma skor", en: "Warm shoes" },
  "Pipo": { sv: "Mössa", en: "Beanie" },
  "Kauluri, huivi tai kypärämyssy": { sv: "Halskrage, halsduk eller hjälmhuva", en: "Neck warmer, scarf or balaclava" },
  "Kevyt haalari": { sv: "Lätt overall", en: "Light overall" },
  "Vedenpitävä haalari päälle": { sv: "Vattentät overall ovanpå", en: "Waterproof overall on top" },
  "Pienet kumpparet": { sv: "Små gummistövlar", en: "Small rubber boots" },
  "Puuvillapipo": { sv: "Bomullsmössa", en: "Cotton beanie" },
  "Joustavat välikausihousut": { sv: "Stretchiga övergångsbyxor", en: "Flexible mid-season trousers" },
  "Tuulenpitävä kuoritakki": { sv: "Vindtät skaljacka", en: "Windproof shell jacket" },
  "Vettähylkivät välikausikengät": { sv: "Vattenavvisande övergångsskor", en: "Water-repellent mid-season shoes" },
  "Fleece tai villainen": { sv: "Fleece eller ull", en: "Fleece or wool" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie" },
  "Ohut puuvillabody": { sv: "Tunn bomullsbody", en: "Thin cotton bodysuit" },
  "Kevyt ulkohaalari": { sv: "Lätt utomhusoverall", en: "Light outdoor overall" },
  "Joustavat collegehousut": { sv: "Stretchiga mjukisbyxor", en: "Flexible joggers" },
  "Kevyt pitkähihainen": { sv: "Lätt långärmad", en: "Light long-sleeve" },
  "Kevyt takki tai liivi": { sv: "Lätt jacka eller väst", en: "Light jacket or vest" },
  "Kevyet kengät": { sv: "Lätta skor", en: "Lightweight shoes" },
  "Farkut tai collegehousut": { sv: "Jeans eller mjukisbyxor", en: "Jeans or joggers" },
  "Collegehousut tai farkut": { sv: "Mjukisbyxor eller jeans", en: "Joggers or jeans" },
  "Leveälierinen hattu": { sv: "Bredbrättad hatt", en: "Wide-brimmed hat" },
  "Kevyt paita": { sv: "Lätt tröja", en: "Light shirt" },
  "Kevyet shortsit": { sv: "Lätta shorts", en: "Light shorts" },
  "Lippalakki tai hattu": { sv: "Keps eller hatt", en: "Cap or hat" },
  "Shortsit tai hame": { sv: "Shorts eller kjol", en: "Shorts or skirt" },
  "Aurinkosuoja": { sv: "Solskydd", en: "Sun protection" },
  "T-paita": { sv: "T-shirt", en: "T-shirt" },
  "Fleece tai huppari": { sv: "Fleece eller hoodie", en: "Fleece or hoodie" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes" },
  "Kumisaappaat ohuilla sukilla": { sv: "Gummistövlar med tunna strumpor", en: "Rubber boots with thin socks" },
  "Kumisaappaat ja villasukat suojaavat kylmältä": { sv: "Gummistövlar och ullstrumpor skyddar mot kylan", en: "Rubber boots and wool socks protect against cold" },
  "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!": { sv: "Regnchans över 40 % — ta med vattentät utrustning!", en: "Rain probability over 40% — bring waterproof gear!" },
  "Korkea UV — suojaa pää auringolta": { sv: "Högt UV — skydda huvudet mot solen", en: "High UV — protect head from the sun" },
  "UV-suoja silmille": { sv: "UV-skydd för ögonen", en: "UV protection for eyes" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket" },
  "Vedenpitävä kuoritakki sateelta suojaan": { sv: "Vattentät skaljacka mot regnet", en: "Waterproof shell jacket for rain protection" },
  "Vedenpitävät ulkoiluhousut sadesäälle": { sv: "Vattentäta utomhusbyxor för regnväder", en: "Waterproof outdoor trousers for rainy weather" },
  "Vettä hylkivät kengät pitävät jalat kuivina": { sv: "Vattenavvisande skor håller fötterna torra", en: "Water-repellent shoes keep feet dry" },
  "Vuorellinen sadehaalari tai kuravarusteet välikausipuvun päällä": { sv: "Fodrad regnoverall eller regnkläder ovanpå skaldräkt", en: "Lined rain overall or rain gear over mid-season suit" },
  "Vedenpitävät kurahanskat": { sv: "Vattentäta regnvantar", en: "Waterproof rain gloves" },
  "Ohuet kuravarusteet — kevyet ja ilmavat": { sv: "Tunna regnkläder — lätta och luftiga", en: "Thin rain gear — light and airy" },
  "Kevyet kurahanskat": { sv: "Lätta regnvantar", en: "Light rain gloves" },
  "Kestää päiväkodin hiekkalaatikkoleikkejä": { sv: "Tål sandlådelek på dagis", en: "Withstands daycare sandbox play" },
  "Kevyet sadehousut ilman vuorta": { sv: "Lätta regnbyxor utan foder", en: "Light rain trousers without lining" },
  "Huomenna sataa — vedenpitävät varusteet mukaan": { sv: "Det regnar i morgon — ta med vattentäta kläder", en: "Rain expected tomorrow — bring waterproof gear" },
  "Maa on märkä yöllisen sateen jäljiltä": { sv: "Marken är blöt efter nattens regn", en: "Ground is wet from overnight rain" },
  "Vaikka nyt on poutaa, maa on vielä märkä": { sv: "Även om det är uppehåll nu är marken fortfarande blöt", en: "Even though it's dry now, the ground is still wet" },
  "Kova tuuli lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros": { sv: "Stark vind ökar kylkänslan — välj vindtätt skalplagg", en: "Strong wind increases wind chill — choose a windproof shell layer" },
  "Vauva on paikoillaan — lisää yksi kerros lämpöä": { sv: "Babyn sitter still — lägg till ett extra värmande lager", en: "Baby is stationary — add one extra warm layer" },
  "Aurinkoinen sää — lippis suojaa": { sv: "Soligt väder — keps skyddar", en: "Sunny weather — cap protects" },
  "Paksu pipo kovaan pakkaseen": { sv: "Tjock mössa i hård kyla", en: "Thick beanie for hard frost" },
  "Ohut pipo viileään säähän": { sv: "Tunn mössa i svalt väder", en: "Thin beanie for cool weather" },
  "Ohut, pitkähihainen puuvillabody": { sv: "Tunn, långärmad bomullsbody", en: "Thin, long-sleeve cotton bodysuit" },
  "Ohuet puuvillahousut": { sv: "Tunna bomullsbyxor", en: "Thin cotton trousers" },
  "Ohut puuvillainen kypärämyssy tai aurinkohattu": { sv: "Tunn bomullshjälmhuva eller solhatt", en: "Thin cotton balaclava or sun hat" },
  "Ohuet sukat": { sv: "Tunna strumpor", en: "Thin socks" },
  "Pitkähihainen ohut paita tai t-paita": { sv: "Långärmad tunn tröja eller t-shirt", en: "Long-sleeve thin shirt or t-shirt" },
  "Ohut neuletakki tai huppari": { sv: "Tunn stickad kofta eller hoodie", en: "Thin knit cardigan or hoodie" },
  "Ohuet housut tai leggingsit": { sv: "Tunna byxor eller leggings", en: "Thin trousers or leggings" },
  "Ohut pipo tai lippis": { sv: "Tunn mössa eller keps", en: "Thin beanie or cap" },
  "Sukat": { sv: "Strumpor", en: "Socks" },
  "Ohut pitkähihainen paita tai huppari": { sv: "Tunn långärmad tröja eller hoodie", en: "Thin long-sleeve shirt or hoodie" },
  "Kevyet housut": { sv: "Lätta byxor", en: "Light trousers" },
  "Lippis tai ohut panta": { sv: "Keps eller tunt pannband", en: "Cap or thin headband" },
  "Huppari tai kevyt takki": { sv: "Hoodie eller lätt jacka", en: "Hoodie or light jacket" },
  "Leveälierinen hattu tai kypärämyssy": { sv: "Bredbrättad hatt eller hjälmhuva", en: "Wide-brimmed hat or balaclava" },
  "Suojaa vauva suoralta auringolta ja tuulelta": { sv: "Skydda babyn från direkt sol och vind", en: "Protect baby from direct sunlight and wind" },
  "+1 … +15 °C — kuoritakki ja kerroksia": { sv: "+1 … +15 °C — skaljacka och lager", en: "+1 … +15 °C — shell jacket and layers" },
  "+1 … +15 °C — tekniset kuorivaatteet ja kerroksia": { sv: "+1 … +15 °C — tekniska skalkläder och lager", en: "+1 … +15 °C — technical shell clothing and layers" },
  "Ohut tekninen kuorihaalari sateen varalle": { sv: "Tunn teknisk skaloverall för regn", en: "Thin technical shell overall for rain" },
  "Ohut puuvillainen kypärämyssy": { sv: "Tunn bomullshjälmhuva", en: "Thin cotton balaclava" },
  "Muista vaunujen sadesuoja!": { sv: "Kom ihåg regnskyddet till vagnen!", en: "Remember the stroller rain cover!" },
  "Sadeasu tai tekniset kuorivaatteet": { sv: "Regnställ eller tekniska skalkläder", en: "Rain suit or technical shell clothing" },
  "Pitkähihainen paita alle": { sv: "Långärmad tröja under", en: "Long-sleeve shirt underneath" },
  "Lippis tai sadehattu": { sv: "Keps eller regnhatt", en: "Cap or rain hat" },
  "Vedenpitävä kuoritakki tai sadetakki": { sv: "Vattentät skaljacka eller regnjacka", en: "Waterproof shell jacket or rain jacket" },
  "Farkut tai tekniset ulkoiluhousut": { sv: "Jeans eller tekniska utomhusbyxor", en: "Jeans or technical outdoor trousers" },
  "Vedenpitävät kengät tai tennarit": { sv: "Vattentäta skor eller sneakers", en: "Waterproof shoes or sneakers" },
  "Pakkaa sateenvarjo tai sadeviitta reppuun": { sv: "Packa paraply eller regnponcho i ryggsäcken", en: "Pack an umbrella or rain poncho in the backpack" },
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
