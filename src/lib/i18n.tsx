import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "fi" | "sv";

const LANG_KEY = "saavahti-language";

function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "sv" ? "sv" : "fi";
}

// Flat translation keys
const translations = {
  // Header
  "header.title": { fi: "Säävahti", sv: "Väderpytten" },
  "header.subtitle": { fi: "Lasten pukeutumisavustaja", sv: "Barnens klädassistent" },

  // Location search
  "location.weatherNow": { fi: "Sää nyt", sv: "Väder nu" },
  "location.useCurrentLocation": { fi: "Käytä nykyistä sijaintia", sv: "Använd nuvarande plats" },
  "location.searchPlaceholder": { fi: "Etsi paikkakuntaa (esim. Tampere)...", sv: "Sök ort (t.ex. Stockholm)..." },
  "location.updating": { fi: "Päivitetään säätietoja...", sv: "Uppdaterar väderdata..." },
  "location.notFound": { fi: "Hups! Säätietoja ei löytynyt. Tarkista kirjoitusasu.", sv: "Hoppsan! Väderdata hittades inte. Kontrollera stavningen." },
  "location.geoError": { fi: "Paikannus epäonnistui. Tarkista selaimen asetukset.", sv: "Positionering misslyckades. Kontrollera webbläsarens inställningar." },
  "location.geoNotSupported": { fi: "Selaimesi ei tue paikannusta.", sv: "Din webbläsare stöder inte positionering." },
  "location.noConnection": { fi: "Ei yhteyttä, näytetään viimeisin tallennettu sää.", sv: "Ingen anslutning, visar senast sparad väderdata." },
  "location.testData": { fi: "API ei ole vielä käytettävissä — näytetään testisäätiedot.", sv: "API är inte tillgängligt ännu — visar testväderdata." },
  "location.coordsNotFound": { fi: "Sijaintiin perustuvia säätietoja ei löytynyt.", sv: "Platsbaserad väderdata hittades inte." },

  // Weather card
  "weather.feelsLike": { fi: "Tuntuu kuin", sv: "Känns som" },
  "weather.country": { fi: "Suomi", sv: "Sverige" },
  "weather.justUpdated": { fi: "Juuri päivitetty", sv: "Nyss uppdaterad" },
  "weather.updatedAgo": { fi: "Päivitetty {min} min sitten", sv: "Uppdaterad {min} min sedan" },
  "weather.refreshNow": { fi: "Päivitä nyt", sv: "Uppdatera nu" },
  "weather.rain": { fi: "Sade", sv: "Regn" },

  // Morning summary
  "morning.title": { fi: "☀️ Aamuyhteenveto", sv: "☀️ Morgonsammanfattning" },
  "morning.afternoonRain": { fi: "Tänään klo 14 sataa, muista kurahousut päiväkotiin!", sv: "Det regnar idag kl 14, kom ihåg regnbyxor till dagis!" },

  // Night alert
  "night.title": { fi: "🌙 Ilta-muistutus", sv: "🌙 Kvällspåminnelse" },
  "night.freezing": { fi: "Huomiseksi pakastuu ({from}° → {to}°), etsi toppahousut valmiiksi!", sv: "Det fryser i morgon ({from}° → {to}°), plocka fram täckbyxor!" },
  "night.hardFrost": { fi: "Yöllä kireä pakkanen ({temp}°), jätä vaatteet eteiseen valmiiksi!", sv: "Hård frost i natt ({temp}°), lägg kläderna i hallen!" },

  // Age groups
  "age.title": { fi: "Lapsen ikäryhmä", sv: "Barnets åldersgrupp" },
  "age.vauva": { fi: "Vauva", sv: "Baby" },
  "age.taapero": { fi: "Taapero", sv: "Småbarn" },
  "age.leikki-ikäinen": { fi: "Leikki-ikäinen", sv: "Förskoleålder" },
  "age.koululainen": { fi: "Koululainen", sv: "Skolbarn" },
  "age.vauva.ages": { fi: "0–1 v", sv: "0–1 år" },
  "age.taapero.ages": { fi: "1–3 v", sv: "1–3 år" },
  "age.leikki-ikäinen.ages": { fi: "3–6 v", sv: "3–6 år" },
  "age.koululainen.ages": { fi: "7–10 v", sv: "7–10 år" },

  // Clothing card
  "clothing.title": { fi: "🧥 Pukeutumissuositus", sv: "🧥 Klädrekommendation" },

  // Checklist
  "checklist.title": { fi: "🎒 Päiväkoti-reppu", sv: "🎒 Dagisryggsäck" },
  "checklist.allPacked": { fi: "✅ Kaikki pakattu!", sv: "✅ Allt packat!" },
  "checklist.weatherGear": { fi: "🌦️ Säänmukaiset varusteet", sv: "🌦️ Väderanpassad utrustning" },
  "checklist.spareClothes": { fi: "👕 Varavaatteet (arkisto) — tarkista viikoittain", sv: "👕 Ombyteskläder (arkiv) — kontrollera varje vecka" },
  "checklist.miscItems": { fi: "🎲 Satunnaiset tavarat", sv: "🎲 Övriga saker" },
  "checklist.myNote": { fi: "📝 Oma muistiinpano", sv: "📝 Min anteckning" },
  "checklist.notePlaceholder": { fi: "Kirjoita tähän oma tavara tai muistutus…", sv: "Skriv din egen sak eller påminnelse här…" },
  "checklist.fridayReminder": { fi: "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!", sv: "📋 Kom ihåg att tömma ryggsäcken inför helgen och kontrollera ombyteskläderna!" },
  "checklist.sundayReminder": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till dagis!" },
  "checklist.mondayReminder": { fi: "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till dagis idag!" },

  // Checklist items
  "item.varahousut": { fi: "Varahousut", sv: "Reservbyxor" },
  "item.varapaita": { fi: "Varapaita", sv: "Reservtröja" },
  "item.alusvaatteet": { fi: "Alusvaatteet (2 kpl)", sv: "Underkläder (2 st)" },
  "item.varahanskat": { fi: "Varahanskat", sv: "Reservvantar" },
  "item.vaihtosukat": { fi: "Vaihtosukat", sv: "Reservstrumpor" },
  "item.vaippapaketti": { fi: "Vaippapaketti", sv: "Blöjpaket" },
  "item.tutti": { fi: "Tutti", sv: "Napp" },
  "item.unilelu": { fi: "Unilelu", sv: "Gossedjur" },
  "item.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm" },
  "item.juomapullo": { fi: "Juomapullo", sv: "Vattenflaska" },
  "item.omalelu": { fi: "Oma lelu", sv: "Egen leksak" },
  "item.välipala": { fi: "Välipala", sv: "Mellanmål" },
  "item.avaimet": { fi: "Avaimet", sv: "Nycklar" },
  "item.uikkarit": { fi: "Uikkarit & pyyhe", sv: "Badkläder & handduk" },
  "item.sisäliikunta": { fi: "Sisäliikuntavaatteet & pyyhe", sv: "Inomhusidrottskläder & handduk" },
  "item.lippis": { fi: "Lippis/Hattu", sv: "Keps/Hatt" },
  "item.kuravarusteet": { fi: "Kuravarusteet", sv: "Regnutrustning" },
  "item.vaihtohanskat": { fi: "Vaihtohanskat", sv: "Extravantar" },
  "item.lamminkerrasto": { fi: "Lämmin kerrasto", sv: "Varmt underställ" },
  "item.luistimet": { fi: "Luistimet & kypärä", sv: "Skridskor & hjälm" },

  // Weekdays
  "weekday.0": { fi: "Sunnuntai", sv: "Söndag" },
  "weekday.1": { fi: "Maanantai", sv: "Måndag" },
  "weekday.2": { fi: "Tiistai", sv: "Tisdag" },
  "weekday.3": { fi: "Keskiviikko", sv: "Onsdag" },
  "weekday.4": { fi: "Torstai", sv: "Torsdag" },
  "weekday.5": { fi: "Perjantai", sv: "Fredag" },
  "weekday.6": { fi: "Lauantai", sv: "Lördag" },
  "weather.today": { fi: "Tänään", sv: "Idag" },

  // Tomorrow forecast
  "tomorrow.title": { fi: "Huomisen sää — Ennuste", sv: "Morgondagens väder — Prognos" },
  "tomorrow.rainProb": { fi: "Sateen todennäköisyys", sv: "Regnchans" },
  "tomorrow.prepTitle": { fi: "Valmistele huomiseksi — Poimi valmiiksi:", sv: "Förbered till i morgon — Plocka fram:" },
  "tomorrow.colderWarning": { fi: "Huomiseksi kylmenee, muista lämpimämpi kerrasto.", sv: "Det blir kallare i morgon, kom ihåg varmare underställ." },
  "tomorrow.rainWarning": { fi: "Huomenna sataa, muista viedä kuravarusteet päiväkotiin.", sv: "Det regnar i morgon, kom ihåg att ta med regnutrustning till dagis." },

  // AI Analysis
  "ai.title": { fi: "Säävahdin analyysi", sv: "Väderpyttens analys" },
  "ai.ageGroup": { fi: "Ikäryhmä", sv: "Åldersgrupp" },
  "ai.analyzing": { fi: "Analysoidaan...", sv: "Analyserar..." },
  "ai.updated": { fi: "Päivitetty", sv: "Uppdaterad" },
  "ai.rainTip": { fi: "🌧️ Huomataan lähestyvä sadealue klo 14. Suosittelen kuravarusteita jo aamusta, jotta ulkoilu ei keskeydy.", sv: "🌧️ Vi ser ett regnområde som närmar sig kl 14. Jag rekommenderar regnutrustning redan på morgonen så att utevistelsen inte avbryts." },
  "ai.hardWindTip": { fi: "💨 Tänään on kova tuuli ({speed} m/s). Vaikka mittari näyttää {temp}°C, viima tuntuu pakkaselta. Valitse tuulenpitävä kuorikerros.", sv: "💨 Det blåser kraftigt idag ({speed} m/s). Även om termometern visar {temp}°C känns det kallare med vinden. Välj ett vindtätt skalplagg." },
  "ai.moderateWindTip": { fi: "💨 Kohtalainen tuuli ({speed} m/s) viilentää tuntuvasti. Tuulenpitävä kerros on hyvä valinta.", sv: "💨 Måttlig vind ({speed} m/s) kyler ner märkbart. Ett vindtätt lager är ett bra val." },
  "ai.layeringTip": { fi: "🌡️ Aamu on kylmä ({feelsLike}°C tuntuu), mutta iltapäivällä lämpötila nousee ({temp}°C). Kerrospukeutuminen on tänään avainasemassa.", sv: "🌡️ Morgonen är kall (känns som {feelsLike}°C), men på eftermiddagen stiger temperaturen ({temp}°C). Lagerklädsel är nyckeln idag." },
  "ai.uvTip": { fi: "☀️ UV-indeksi on korkea ({uvi}). Aurinko paistaa voimakkaasti. Suojaa lapsen iho aurinkorasvalla, vaikka tuntuisi viileältä. Lippis ja aurinkolasit mukaan{age}!", sv: "☀️ UV-index är högt ({uvi}). Solen skiner starkt. Skydda barnets hud med solskyddskräm, även om det känns svalt. Ta med keps och solglasögon{age}!" },
  "ai.sunnyUvTip": { fi: "☀️ Korkea UV-indeksi. Muista aurinkorasva ja lippis suojaksi.", sv: "☀️ Högt UV-index. Kom ihåg solskyddskräm och keps som skydd." },
  "ai.calmDay": { fi: "✅ Tänään on rauhallinen sääpäivä ({temp}°C, {desc}). Normaalit kauden vaatteet riittävät hyvin.", sv: "✅ En lugn väderdag idag ({temp}°C, {desc}). Normala säsongskläder räcker bra." },
  "ai.ageLabel.vauva": { fi: " vauvalle", sv: " för babyn" },
  "ai.ageLabel.taapero": { fi: " taaperolle", sv: " för småbarnet" },
  "ai.ageLabel.leikki-ikäinen": { fi: " leikki-ikäiselle", sv: " för förskolebarnet" },
  "ai.ageLabel.koululainen": { fi: " koululaiselle", sv: " för skolbarnet" },

  // UV Alert
  "uv.veryHigh": { fi: "Erittäin korkea", sv: "Mycket högt" },
  "uv.high": { fi: "Korkea", sv: "Högt" },
  "uv.moderate": { fi: "Kohtalainen", sv: "Måttligt" },
  "uv.titleFormat": { fi: "{level} UV-indeksi ({uvi})", sv: "{level} UV-index ({uvi})" },
  "uv.description": { fi: "Muista aurinkorasva ja hattu! Suojaa lapsen iho, silmät ja pää auringolta.", sv: "Kom ihåg solskyddskräm och hatt! Skydda barnets hud, ögon och huvud mot solen." },

  // Schedule
  "schedule.title.vauva": { fi: "Vauvan", sv: "Babyns" },
  "schedule.title.taapero": { fi: "Taaperon", sv: "Småbarnets" },
  "schedule.title.leikki-ikäinen": { fi: "Leikki-ikäisen", sv: "Förskolebarnets" },
  "schedule.title.koululainen": { fi: "Koululaisen", sv: "Skolbarnets" },
  "schedule.weeklySchedule": { fi: "viikko-ohjelma", sv: "veckoschema" },
  "schedule.addImageDesc": { fi: "Lisää kuva lukujärjestyksestä tai päiväkodin viikko-ohjelmasta", sv: "Lägg till bild på schemat eller dagisens veckoprogram" },
  "schedule.saving": { fi: "Tallennetaan...", sv: "Sparar..." },
  "schedule.saved": { fi: "Kuva tallennettu!", sv: "Bilden sparad!" },
  "schedule.saveError": { fi: "Hups! Kuva on liian suuri tai tallennus epäonnistui. Yritä pienemmällä kuvalla.", sv: "Hoppsan! Bilden är för stor eller sparningen misslyckades. Prova med en mindre bild." },
  "schedule.viewLarge": { fi: "Katso isona", sv: "Visa i fullstorlek" },
  "schedule.changeImage": { fi: "Vaihda kuva", sv: "Byt bild" },
  "schedule.removeImage": { fi: "Poista kuva", sv: "Ta bort bild" },
  "schedule.addSchedule": { fi: "Lisää lukujärjestys", sv: "Lägg till schema" },
  "schedule.takeOrSelect": { fi: "Ota kuva tai valitse galleriasta", sv: "Ta en bild eller välj från galleriet" },
  "schedule.doubleTapReset": { fi: "Kaksoisnapautus nollataksesi", sv: "Dubbeltryck för att återställa" },
  "schedule.pinchToZoom": { fi: "Nipistä zoomataksesi", sv: "Nyp för att zooma" },
  "schedule.close": { fi: "Sulje", sv: "Stäng" },

  // Schedule reminder
  "scheduleReminder.text": { fi: "Tarkista päivän ohjelma kuvasta", sv: "Kontrollera dagens program från bilden" },

  // Affiliate
  "affiliate.title": { fi: "Suosittelemme laadukkaita varusteita", sv: "Vi rekommenderar kvalitetsutrustning" },
  "affiliate.reima.desc": { fi: "Säänkestävät ulkovaatteet ja asusteet", sv: "Väderbeständiga ytterkläder och accessoarer" },
  "affiliate.reima.cta": { fi: "Tutustu kauden uutuuksiin", sv: "Se säsongens nyheter" },
  "affiliate.lindex.desc": { fi: "Kestävät ja pehmeät arkivaatteet lapsille", sv: "Hållbara och mjuka vardagskläder för barn" },
  "affiliate.lindex.cta": { fi: "Katso päivän tarjoukset", sv: "Se dagens erbjudanden" },
  "affiliate.disclaimer": {
    fi: "Säävahti on riippumaton palvelu. Suositukset on valittu helpottamaan perheiden arkea ja ne voivat sisältää mainoslinkkejä. Linkkien kautta tehdyistä ostoksista saatava komissio käytetään sovelluksen ylläpitoon ja kehitykseen.",
    sv: "Väderpytten är en oberoende tjänst. Rekommendationerna är utvalda för att underlätta familjers vardag och kan innehålla annonslänkar. Provisionen från köp via länkarna används för appens underhåll och utveckling."
  },

  // Feedback
  "feedback.title": { fi: "Anna palautetta", sv: "Ge feedback" },
  "feedback.placeholder": { fi: "Mitä voisimme parantaa?", sv: "Vad kan vi förbättra?" },
  "feedback.send": { fi: "Lähetä palaute", sv: "Skicka feedback" },
  "feedback.thanks": { fi: "Kiitos palautteestasi!", sv: "Tack för din feedback!" },
  "feedback.thanksDesc": { fi: "Autat meitä tekemään Säävahdista paremman.", sv: "Du hjälper oss att göra Väderpytten bättre." },
  "feedback.emailSubject": { fi: "Säävahti-sovelluksen palaute", sv: "Feedback om Väderpytten-appen" },
  "feedback.emailBody": { fi: "Tähtiarvosana: {stars} ({rating}/5)\n\nPalaute:\n{text}", sv: "Stjärnbetyg: {stars} ({rating}/5)\n\nFeedback:\n{text}" },

  // Footer
  "footer.copyright": { fi: "© 2024 Säävahti", sv: "© 2024 Väderpytten" },
  "footer.privacy": { fi: "Tietosuoja", sv: "Integritetspolicy" },
  "footer.contact": { fi: "Yhteystiedot", sv: "Kontaktuppgifter" },
  "footer.close": { fi: "Sulje", sv: "Stäng" },
  "footer.privacyTitle": { fi: "Tietosuojaseloste", sv: "Integritetspolicy" },
  "footer.contactTitle": { fi: "Yhteystiedot", sv: "Kontaktuppgifter" },
  "footer.privacyS1Title": { fi: "1. Rekisterinpitäjä", sv: "1. Registeransvarig" },
  "footer.privacyS1": { fi: "Säävahti-sovellus", sv: "Väderpytten-appen" },
  "footer.privacyS2Title": { fi: "2. Kerättävät tiedot", sv: "2. Insamlade uppgifter" },
  "footer.privacyS2": { fi: "Sovellus tallentaa paikallisesti (selaimen LocalStorage) käyttäjän valitseman kaupungin, ikäryhmävalinnan sekä viikko-ohjelmakuvan. Tietoja ei lähetetä ulkoisille palvelimille.", sv: "Appen sparar lokalt (webbläsarens LocalStorage) användarens valda stad, åldersgrupp och veckoschemabild. Inga uppgifter skickas till externa servrar." },
  "footer.privacyS3Title": { fi: "3. Tietojen käyttö", sv: "3. Användning av uppgifter" },
  "footer.privacyS3": { fi: "Tallennettuja tietoja käytetään ainoastaan sovelluksen toiminnallisuuden tarjoamiseen, kuten pukeutumissuositusten näyttämiseen ja viikko-ohjelman säilyttämiseen.", sv: "Sparade uppgifter används enbart för att tillhandahålla appens funktionalitet, som att visa klädrekommendationer och spara veckoschemat." },
  "footer.privacyS4Title": { fi: "4. Evästeet ja analytiikka", sv: "4. Cookies och analys" },
  "footer.privacyS4": { fi: "Sovellus ei käytä kolmannen osapuolen evästeitä. Mahdolliset mainoslinkit (affiliate-linkit) voivat ohjata ulkoisille sivustoille, joilla on omat tietosuojakäytäntönsä.", sv: "Appen använder inga tredjepartscookies. Eventuella annonslänkar (affiliatelänkar) kan leda till externa webbplatser med egna integritetspolicyer." },
  "footer.privacyS5Title": { fi: "5. Tietojen poistaminen", sv: "5. Radering av uppgifter" },
  "footer.privacyS5": { fi: "Käyttäjä voi poistaa kaikki tallentamansa tiedot tyhjentämällä selaimen LocalStorage-tiedot selaimen asetuksista.", sv: "Användaren kan radera alla sparade uppgifter genom att rensa webbläsarens LocalStorage-data i webbläsarens inställningar." },
  "footer.privacyS6Title": { fi: "6. Yhteydenotto", sv: "6. Kontakt" },
  "footer.privacyS6": { fi: "Palautetta ja tietosuojaa koskevia kysymyksiä voit lähettää sähköpostitse:", sv: "Feedback och frågor om integritetspolicyn kan skickas via e-post:" },
  "footer.contactIntro": { fi: "Olemme iloisia kuullessamme sinusta! Voit ottaa yhteyttä alla olevilla tavoilla.", sv: "Vi är glada att höra från dig! Du kan kontakta oss på följande sätt." },
  "footer.emailTitle": { fi: "Sähköposti", sv: "E-post" },
  "footer.partnerTitle": { fi: "Yhteistyö & Mainonta", sv: "Samarbete & Annonsering" },
  "footer.partnerDesc": { fi: "Kiinnostaako affiliate-yhteistyö tai mainospaikka? Ota yhteyttä sähköpostitse, niin kerromme lisää mahdollisuuksista.", sv: "Intresserad av affiliatesamarbete eller annonsplats? Kontakta oss via e-post så berättar vi mer om möjligheterna." },

  // Misc
  "misc.windTip": { fi: "💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!", sv: "💡 Kom ihåg att kontrollera vindbyarna innan utevistelsen!" },

  // Clothing items (for weatherData translations)
  "cloth.kerrospukeutuminen": { fi: "Kerrospukeutuminen", sv: "Lagerklädsel" },
  "cloth.kerrospukeutuminen.desc": { fi: "Merinovilla, välikerros ja paksu toppapuku", sv: "Merinoull, mellanskikt och tjock overall" },
  "cloth.toppapuku": { fi: "Toppapuku ja villasukat", sv: "Täckoverall och ullstrumpor" },
  "cloth.toppapuku.desc": { fi: "Lämpö: 0 … –10 °C — paksu toppapuku ja villasukat", sv: "Temp: 0 … –10 °C — tjock täckoverall och ullstrumpor" },
  "cloth.välikausivaatteet": { fi: "Välikausivaatteet", sv: "Övergångskläder" },
  "cloth.välikausivaatteet.desc": { fi: "+5 … +12 °C — kuoritakki ja kerroksia", sv: "+5 … +12 °C — skaljacka och lager" },
  "cloth.tuubihuivi": { fi: "Tuubihuivi", sv: "Tubhalsduk" },
  "cloth.tuubihuivi.desc": { fi: "Tuuli yli 5 m/s — tuubihuivi suojaa", sv: "Vind över 5 m/s — tubhalsduk skyddar" },
  "cloth.lippalakki": { fi: "Lippalakki", sv: "Keps" },
  "cloth.lippalakki.desc": { fi: "Aurinkoisella säällä suojaksi", sv: "Skydd i soligt väder" },
  "cloth.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm" },
  "cloth.aurinkorasva.desc": { fi: "Suojaa iho UV-säteilyltä", sv: "Skyddar huden mot UV-strålning" },
  "cloth.vuorettomat": { fi: "Vuorettomat kurahousut", sv: "Ofodrade regnbyxor" },
  "cloth.vuorettomat.desc": { fi: "Kevyet sadehousut ilman vuorta", sv: "Lätta regnbyxor utan foder" },
  "cloth.kumisaappaat": { fi: "Kumisaappaat", sv: "Gummistövlar" },
  "cloth.kumisaappaat.desc": { fi: "Kumisaappaat ohuilla sukilla", sv: "Gummistövlar med tunna strumpor" },
  "cloth.kurahousut": { fi: "Kurahousut ja kurahanskat", sv: "Regnbyxor och regnvantar" },
  "cloth.kurahousut.desc": { fi: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!", sv: "Regnchans över 40 % — ta med vattentät utrustning!" },
  "cloth.lippisUv": { fi: "Lippis/Hattu", sv: "Keps/Hatt" },
  "cloth.lippisUv.desc": { fi: "Korkea UV — suojaa pää auringolta", sv: "Högt UV — skydda huvudet mot solen" },
  "cloth.aurinkolasit": { fi: "Aurinkolasit", sv: "Solglasögon" },
  "cloth.aurinkolasit.desc": { fi: "UV-suoja silmille", sv: "UV-skydd för ögonen" },

  // Cold gear
  "cloth.toppahaalari": { fi: "Toppahaalari", sv: "Täckoverall" },
  "cloth.toppahaalari.desc": { fi: "Paksu talvihaalari", sv: "Tjock vinteroverall" },
  "cloth.villakerrastot": { fi: "Villakerrastot", sv: "Ullunderställ" },
  "cloth.villakerrastot.desc": { fi: "Merinovillaiset aluskerrastot", sv: "Underställ i merinoull" },
  "cloth.villasukat": { fi: "Villasukat", sv: "Ullstrumpor" },
  "cloth.villasukat.desc": { fi: "Paksut villasukat", sv: "Tjocka ullstrumpor" },
  "cloth.talvitöppöset": { fi: "Talvitöppöset", sv: "Vinterskor" },
  "cloth.talvitöppöset.desc": { fi: "Lämpimät vauvan kengät", sv: "Varma babyskor" },
  "cloth.lapaset": { fi: "Lapaset", sv: "Vantar" },
  "cloth.lapaset.desc": { fi: "Paksut tumput", sv: "Tjocka tumvantar" },
  "cloth.pipo": { fi: "Pipo", sv: "Mössa" },
  "cloth.pipo.desc": { fi: "Villapipo + kypärämyssy", sv: "Ullmössa + hjälmhuva" },
  "cloth.toppahousut": { fi: "Toppahousut", sv: "Täckbyxor" },
  "cloth.toppahousut.desc": { fi: "Talvitoppahousut", sv: "Vintertäckbyxor" },
  "cloth.toppatakki": { fi: "Toppatakki", sv: "Täckjacka" },
  "cloth.toppatakki.desc": { fi: "Paksu talvitakki", sv: "Tjock vinterjacka" },
  "cloth.villakerrastot2.desc": { fi: "Aluskerrastot villan päälle", sv: "Underställ ovanpå ullen" },
  "cloth.talvisaappaat": { fi: "Talvisaappaat", sv: "Vinterstövlar" },
  "cloth.talvisaappaat.desc": { fi: "Lämpimät vedenpitävät saappaat", sv: "Varma vattentäta stövlar" },
  "cloth.hanskat": { fi: "Hanskat", sv: "Handskar" },
  "cloth.hanskat.desc.taapero": { fi: "Hanskat tai rukkaset", sv: "Handskar eller vantar" },
  "cloth.kauluri": { fi: "Kauluri", sv: "Halskrage" },
  "cloth.kauluri.desc.taapero": { fi: "Tuubihuivi tai kypärämyssy", sv: "Tubhalsduk eller hjälmhuva" },
  "cloth.pipo2.desc": { fi: "Lämmin villapipo", sv: "Varm ullmössa" },
  "cloth.hanskat.desc.leikki": { fi: "Sormikkaat tai lapaset", sv: "Fingervantar eller vantar" },
  "cloth.pipo3.desc": { fi: "Lämpimä pipo", sv: "Varm mössa" },
  "cloth.kauluri2.desc": { fi: "Tuubihuivi", sv: "Tubhalsduk" },
  "cloth.välikerrastot": { fi: "Välikerrastot", sv: "Mellanunderställ" },
  "cloth.välikerrastot.desc": { fi: "Kerrostettavat alusvaatteet", sv: "Lagerbara underkläder" },
  "cloth.talvikengät": { fi: "Talvikengät", sv: "Vinterskor" },
  "cloth.talvikengät.desc": { fi: "Lämpimät kengät", sv: "Varma skor" },
  "cloth.kauluri3.desc": { fi: "Kauluri, huivi tai kypärämyssy", sv: "Halskrage, halsduk eller hjälmhuva" },

  // Mild rain gear
  "cloth.välikausihaalari": { fi: "Välikausihaalari", sv: "Skaloverall" },
  "cloth.välikausihaalari.desc": { fi: "Kevyt haalari", sv: "Lätt overall" },
  "cloth.sadehaalari": { fi: "Sadehaalari", sv: "Regnoverall" },
  "cloth.sadehaalari.desc": { fi: "Vedenpitävä haalari päälle", sv: "Vattentät overall ovanpå" },
  "cloth.kumisaappaat2.desc": { fi: "Pienet kumpparet", sv: "Små gummistövlar" },
  "cloth.ohutpipo": { fi: "Ohut pipo", sv: "Tunn mössa" },
  "cloth.ohutpipo.desc": { fi: "Puuvillapipo", sv: "Bomullsmössa" },
  "cloth.välikausihousut": { fi: "Välikausihousut", sv: "Övergångsbyxor" },
  "cloth.välikausihousut.desc": { fi: "Joustavat välikausihousut", sv: "Stretchiga övergångsbyxor" },
  "cloth.kuoritakki": { fi: "Kuoritakki", sv: "Skaljacka" },
  "cloth.kuoritakki.desc": { fi: "Tuulenpitävä kuoritakki", sv: "Vindtät skaljacka" },
  "cloth.välikausikengät": { fi: "Välikausikengät", sv: "Övergångsskor" },
  "cloth.välikausikengät.desc": { fi: "Vettähylkivät välikausikengät", sv: "Vattenavvisande övergångsskor" },
  "cloth.välikerrasto": { fi: "Välikerrasto", sv: "Mellanskikt" },
  "cloth.välikerrasto.desc": { fi: "Fleece tai villainen", sv: "Fleece eller ull" },

  // Warm spring
  "cloth.body": { fi: "Body", sv: "Body" },
  "cloth.body.desc": { fi: "Ohut puuvillabody", sv: "Tunn bomullsbody" },
  "cloth.ohuthaalari": { fi: "Ohut haalari", sv: "Tunn overall" },
  "cloth.ohuthaalari.desc": { fi: "Kevyt ulkohaalari", sv: "Lätt utomhusoverall" },
  "cloth.collegehousut": { fi: "Collegehousut", sv: "Mjukisbyxor" },
  "cloth.collegehousut.desc": { fi: "Joustavat collegehousut", sv: "Stretchiga mjukisbyxor" },
  "cloth.pitkähihainen": { fi: "Pitkähihainen paita", sv: "Långärmad tröja" },
  "cloth.pitkähihainen.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad" },
  "cloth.kevyttakki": { fi: "Kevyt takki", sv: "Lätt jacka" },
  "cloth.kevyttakki.desc": { fi: "Kevyt takki tai liivi", sv: "Lätt jacka eller väst" },
  "cloth.lenkkarit": { fi: "Lenkkarit", sv: "Sneakers" },
  "cloth.lenkkarit.desc": { fi: "Kevyet kengät", sv: "Lätta skor" },
  "cloth.farkut": { fi: "Farkut", sv: "Jeans" },
  "cloth.farkut.desc": { fi: "Farkut tai collegehousut", sv: "Jeans eller mjukisbyxor" },
  "cloth.collegehousut2.desc": { fi: "Collegehousut tai farkut", sv: "Mjukisbyxor eller jeans" },
  "cloth.pitkähihainen2.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad" },

  // Warm gear
  "cloth.aurinkohattu": { fi: "Aurinkohattu", sv: "Solhatt" },
  "cloth.aurinkohattu.desc": { fi: "Leveälierinen hattu", sv: "Bredbrättad hatt" },
  "cloth.tpaita": { fi: "T-paita", sv: "T-shirt" },
  "cloth.tpaita.desc": { fi: "Kevyt paita", sv: "Lätt tröja" },
  "cloth.shortsit": { fi: "Shortsit", sv: "Shorts" },
  "cloth.shortsit.desc": { fi: "Kevyet shortsit", sv: "Lätta shorts" },
  "cloth.sandaalit": { fi: "Sandaalit", sv: "Sandaler" },
  "cloth.sandaalit.desc": { fi: "Avoimet kengät", sv: "Öppna skor" },
  "cloth.aurinkohattu2.desc": { fi: "Lippalakki tai hattu", sv: "Keps eller hatt" },
  "cloth.shortsit2.desc": { fi: "Shortsit tai hame", sv: "Shorts eller kjol" },
  "cloth.lippalakki2.desc": { fi: "Aurinkosuoja", sv: "Solskydd" },
  "cloth.huppari": { fi: "Huppari", sv: "Hoodie" },
  "cloth.huppari.desc": { fi: "Fleece tai huppari", sv: "Fleece eller hoodie" },
  "cloth.välikausikengät2.desc": { fi: "Vettähylkivät kengät", sv: "Vattenavvisande skor" },
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
    let text: string = entry[lang] || entry.fi;
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
