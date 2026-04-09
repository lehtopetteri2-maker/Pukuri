import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type Language = "fi" | "sv" | "en" | "et" | "ar";

const LANG_KEY = "saavahti-language";

function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "sv") return "sv";
  if (saved === "en") return "en";
  if (saved === "et") return "et";
  if (saved === "ar") return "ar";
  return "fi";
}

// Flat translation keys
const translations = {
  // Header
  "header.title": { fi: "Pukuri", sv: "Pukuri", en: "Pukuri", et: "Pukuri", ar: "Pukuri" },
  "header.subtitle": { fi: "Älykäs apu aamun varustevalintoihin", sv: "Intelligent hjälp för morgonens utrustningsval", en: "Smart assistance for morning gear choices", et: "Nutikas abi hommikusteks varustuse valikuteks", ar: "مساعدة ذكية لاختيار معدات الصباح" },

  // Location search
  "location.weatherNow": { fi: "Sää nyt", sv: "Väder nu", en: "Weather now", et: "Ilm praegu", ar: "الطقس الآن" },
  "location.useCurrentLocation": { fi: "Käytä nykyistä sijaintia", sv: "Använd nuvarande plats", en: "Use current location", et: "Kasuta praegust asukohta", ar: "استخدم الموقع الحالي" },
  "location.searchPlaceholder": { fi: "Etsi paikkakuntaa (esim. Tampere)...", sv: "Sök ort (t.ex. Stockholm)...", en: "Search city (e.g. Helsinki)...", et: "Otsi linna (nt Tallinn)...", ar: "ابحث عن مدينة (مثل هلسنكي)..." },
  "location.updating": { fi: "Päivitetään säätietoja...", sv: "Uppdaterar väderdata...", en: "Updating weather data...", et: "Ilmaandmete uuendamine...", ar: "جارٍ تحديث بيانات الطقس..." },
  "location.notFound": { fi: "Hups! Säätietoja ei löytynyt. Tarkista kirjoitusasu.", sv: "Hoppsan! Väderdata hittades inte. Kontrollera stavningen.", en: "Oops! Weather data not found. Check the spelling.", et: "Ups! Ilmaandmeid ei leitud. Kontrolli kirjapilti.", ar: "عذراً! لم يتم العثور على بيانات الطقس. تحقق من الإملاء." },
  "location.geoError": { fi: "Paikannus epäonnistui. Tarkista selaimen asetukset.", sv: "Positionering misslyckades. Kontrollera webbläsarens inställningar.", en: "Geolocation failed. Check browser settings.", et: "Asukoha tuvastamine ebaõnnestus. Kontrolli brauseri seadeid.", ar: "فشل تحديد الموقع. تحقق من إعدادات المتصفح." },
  "location.geoNotSupported": { fi: "Selaimesi ei tue paikannusta.", sv: "Din webbläsare stöder inte positionering.", en: "Your browser does not support geolocation.", et: "Sinu brauser ei toeta asukohateenust.", ar: "متصفحك لا يدعم تحديد الموقع." },
  "location.noConnection": { fi: "Ei yhteyttä, näytetään viimeisin tallennettu sää.", sv: "Ingen anslutning, visar senast sparad väderdata.", en: "No connection, showing last saved weather.", et: "Ühendus puudub, kuvatakse viimati salvestatud ilm.", ar: "لا يوجد اتصال، يتم عرض آخر بيانات طقس محفوظة." },
  "location.testData": { fi: "API ei ole vielä käytettävissä — näytetään testisäätiedot.", sv: "API är inte tillgängligt ännu — visar testväderdata.", en: "API not available yet — showing test weather data.", et: "API pole veel saadaval — kuvatakse testiilmaandmed.", ar: "واجهة API غير متاحة بعد — يتم عرض بيانات طقس تجريبية." },
  "location.coordsNotFound": { fi: "Sijaintiin perustuvia säätietoja ei löytynyt.", sv: "Platsbaserad väderdata hittades inte.", en: "Location-based weather data not found.", et: "Asukohapõhiseid ilmaandmeid ei leitud.", ar: "لم يتم العثور على بيانات الطقس بناءً على الموقع." },

  // Weather card
  "weather.feelsLike": { fi: "Tuntuu kuin", sv: "Känns som", en: "Feels like", et: "Tundub nagu", ar: "يبدو كأنه" },
  "weather.country": { fi: "Suomi", sv: "Sverige", en: "Finland", et: "Soome", ar: "فنلندا" },
  "weather.justUpdated": { fi: "Juuri päivitetty", sv: "Nyss uppdaterad", en: "Just updated", et: "Just uuendatud", ar: "تم التحديث للتو" },
  "weather.updatedAgo": { fi: "Päivitetty {min} min sitten", sv: "Uppdaterad {min} min sedan", en: "Updated {min} min ago", et: "Uuendatud {min} min tagasi", ar: "تم التحديث قبل {min} دقيقة" },
  "weather.refreshNow": { fi: "Päivitä nyt", sv: "Uppdatera nu", en: "Refresh now", et: "Uuenda nüüd", ar: "حدّث الآن" },
  "weather.rain": { fi: "Sade", sv: "Regn", en: "Rain", et: "Vihm", ar: "مطر" },

  // Morning summary
  "morning.title": { fi: "☀️ Vinkki aamuun", sv: "☀️ Morgontips", en: "☀️ Morning tip", et: "☀️ Hommikune nõuanne", ar: "☀️ نصيحة الصباح" },
  "morning.loading": { fi: "Haetaan päivän suosituksia...", sv: "Hämtar dagens rekommendationer...", en: "Fetching today's recommendations...", et: "Päeva soovituste laadimine...", ar: "جارٍ جلب توصيات اليوم..." },
  "morning.rainStart": { fi: "Pukuri huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Pukuri märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", en: "Pukuri noticed: rain starts around {time}. Remember rain gear for daycare!", et: "Pukuri märkas: vihm algab umbes kell {time}. Ära unusta vihmariideid lasteaeda!", ar: "لاحظ Pukuri: المطر يبدأ حوالي الساعة {time}. لا تنسَ ملابس المطر للروضة!" },
  "morning.rainStart.school": { fi: "Pukuri huomasi: sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Pukuri märkte: regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", en: "Pukuri noticed: rain starts around {time}. Remember rain gear for school!", et: "Pukuri märkas: vihm algab umbes kell {time}. Ära unusta vihmariideid kooli!", ar: "لاحظ Pukuri: المطر يبدأ حوالي الساعة {time}. لا تنسَ ملابس المطر للمدرسة!" },
  "morning.rainDaycare": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet päiväkotiin!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till dagis!", en: "Rain starts around {time}. Remember rain gear for daycare!", et: "Vihm algab umbes kell {time}. Ära unusta vihmariideid lasteaeda!", ar: "المطر يبدأ حوالي الساعة {time}. لا تنسَ ملابس المطر للروضة!" },
  "morning.rainDaycare.school": { fi: "Sade alkaa arviolta klo {time}. Muista kuravarusteet kouluun!", sv: "Regn börjar ungefär kl {time}. Kom ihåg regnkläder till skolan!", en: "Rain starts around {time}. Remember rain gear for school!", et: "Vihm algab umbes kell {time}. Ära unusta vihmariideid kooli!", ar: "المطر يبدأ حوالي الساعة {time}. لا تنسَ ملابس المطر للمدرسة!" },
  "morning.freezing": { fi: "Pukuri huomasi: tie on liukas ja aamu on kylmä, valitse lämpimät kengät.", sv: "Pukuri märkte: vägen är hal och morgonen kall, välj varma skor.", en: "Pukuri noticed: roads are slippery and the morning is cold, choose warm shoes.", et: "Pukuri märkas: tee on libe ja hommik on külm, vali soojad jalatsid.", ar: "لاحظ Pukuri: الطرق زلقة والصباح بارد، اختر أحذية دافئة." },
  "morning.uvHigh": { fi: "Pukuri huomasi: UV-indeksi nousee yli 3 tänään. Muista aurinkorasva lapselle!", sv: "Pukuri märkte: UV-index stiger över 3 idag. Kom ihåg solskyddskräm!", en: "Pukuri noticed: UV index rises above 3 today. Remember sunscreen for the child!", et: "Pukuri märkas: UV-indeks tõuseb täna üle 3. Ära unusta päikesekaitsekreemi!", ar: "لاحظ Pukuri: مؤشر الأشعة فوق البنفسجية يرتفع فوق 3 اليوم. لا تنسَ واقي الشمس للطفل!" },
  "morning.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing.", et: "Tuulekülm teeb ilma läbilõikavaks ({speed} m/s), eelista tuulekindlaid riideid.", ar: "الرياح تجعل الطقس لاذعاً ({speed} م/ث)، اختر ملابس مقاومة للرياح." },
  "morning.calmDay": { fi: "Sää on vakaa, nauti päivästä! Normaalit kauden vaatteet riittävät. 🌤️", sv: "Vädret är stabilt, njut av dagen! Normala säsongskläder räcker. 🌤️", en: "Weather is stable, enjoy the day! Normal seasonal clothes will do. 🌤️", et: "Ilm on stabiilne, naudi päeva! Tavalised hooajariided sobivad. 🌤️", ar: "الطقس مستقر، استمتع باليوم! الملابس الموسمية العادية كافية. 🌤️" },

  // Night alert
  "night.title": { fi: "🌙 Ilta-muistutus", sv: "🌙 Kvällspåminnelse", en: "🌙 Evening reminder", et: "🌙 Õhtune meeldetuletus", ar: "🌙 تذكير المساء" },
  "night.freezing": { fi: "Huomiseksi pakastuu ({from}° → {to}°), etsi toppahousut valmiiksi!", sv: "Det fryser i morgon ({from}° → {to}°), plocka fram täckbyxor!", en: "Freezing tomorrow ({from}° → {to}°), get snow trousers ready!", et: "Homme läheb külmaks ({from}° → {to}°), valmista soojad püksid ette!", ar: "تجمد غداً ({from}° → {to}°)، جهّز بنطلون الثلج!" },
  "night.hardFrost": { fi: "Yöllä kireä pakkanen ({temp}°), jätä vaatteet eteiseen valmiiksi!", sv: "Hård frost i natt ({temp}°), lägg kläderna i hallen!", en: "Hard frost tonight ({temp}°), lay out clothes in the hallway!", et: "Öösel kange pakane ({temp}°), jäta riided esikusse valmis!", ar: "صقيع شديد الليلة ({temp}°)، ضع الملابس في الممر!" },
  "night.tomorrowColder": { fi: "Pukuri huomasi: huominen on selvästi kylmempi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Pukuri märkte: i morgon blir det betydligt kallare ({today}° → {tomorrow}°). Förbered klädombyte!", en: "Pukuri noticed: tomorrow is much colder than today ({today}° → {tomorrow}°). Prepare for a clothing change!", et: "Pukuri märkas: homme on tunduvalt külmem ({today}° → {tomorrow}°). Valmistu riidevahetuseks!", ar: "لاحظ Pukuri: غداً أبرد بكثير من اليوم ({today}° → {tomorrow}°). استعد لتغيير الملابس!" },
  "night.tomorrowWarmer": { fi: "Pukuri huomasi: huominen on selvästi lämpimämpi kuin tämä päivä ({today}° → {tomorrow}°). Varaudu vaatevaihtoon!", sv: "Pukuri märkte: i morgon blir det betydligt varmare ({today}° → {tomorrow}°). Förbered klädombyte!", en: "Pukuri noticed: tomorrow is much warmer than today ({today}° → {tomorrow}°). Prepare for a clothing change!", et: "Pukuri märkas: homme on tunduvalt soojem ({today}° → {tomorrow}°). Valmistu riidevahetuseks!", ar: "لاحظ Pukuri: غداً أدفأ بكثير من اليوم ({today}° → {tomorrow}°). استعد لتغيير الملابس!" },
  "night.tomorrowRain": { fi: "Huomenna tarvitaan kuravarusteita, tarkista että ne ovat repussa.", sv: "I morgon behövs regnutrustning, kontrollera att den finns i ryggsäcken.", en: "Rain gear needed tomorrow, check that it's in the backpack.", et: "Homme on vaja vihmariideid, kontrolli et need on kotis.", ar: "ملابس المطر مطلوبة غداً، تأكد أنها في الحقيبة." },
  "night.dryGear": { fi: "Muista ottaa märät varusteet ja kengät kuivumaan! 👟", sv: "Kom ihåg att torka blöta kläder och skor! 👟", en: "Remember to dry wet gear and shoes! 👟", et: "Ära unusta märgi riideid ja jalatseid kuivama panna! 👟", ar: "تذكر تجفيف الملابس والأحذية المبللة! 👟" },
  "night.windChill": { fi: "Viima tekee säästä purevan ({speed} m/s), suosi tuulenpitävää huomenna.", sv: "Blåsten gör vädret bitande ({speed} m/s), välj vindtäta kläder i morgon.", en: "Wind chill makes it feel bitter ({speed} m/s), choose windproof clothing tomorrow.", et: "Tuulekülm teeb ilma läbilõikavaks ({speed} m/s), eelista homme tuulekindlaid riideid.", ar: "الرياح تجعل الطقس لاذعاً ({speed} م/ث)، اختر ملابس مقاومة للرياح غداً." },

  // Age groups
  "age.title": { fi: "Lapsen ikäryhmä", sv: "Barnets åldersgrupp", en: "Child's age group", et: "Lapse vanuserühm", ar: "الفئة العمرية للطفل" },
  "age.vauva": { fi: "Vauva", sv: "Baby", en: "Baby", et: "Beebi", ar: "رضيع" },
  "age.taapero": { fi: "Taapero", sv: "Småbarn", en: "Toddler", et: "Väikelaps", ar: "طفل صغير" },
  "age.leikki-ikäinen": { fi: "Leikki-ikäinen", sv: "Förskoleålder", en: "Preschooler", et: "Eelkooliealine", ar: "ما قبل المدرسة" },
  "age.koululainen": { fi: "Koululainen", sv: "Skolbarn", en: "School age", et: "Koolilaps", ar: "سن المدرسة" },
  "age.vauva.ages": { fi: "0–1 v", sv: "0–1 år", en: "0–1 yr", et: "0–1 a", ar: "0–1 سنة" },
  "age.taapero.ages": { fi: "1–3 v", sv: "1–3 år", en: "1–3 yr", et: "1–3 a", ar: "1–3 سنة" },
  "age.leikki-ikäinen.ages": { fi: "3–6 v", sv: "3–6 år", en: "3–6 yr", et: "3–6 a", ar: "3–6 سنة" },
  "age.koululainen.ages": { fi: "7–10 v", sv: "7–10 år", en: "7–10 yr", et: "7–10 a", ar: "7–10 سنة" },

  // Clothing card
  "clothing.title": { fi: "🧥 Pukeutumissuositus", sv: "🧥 Klädrekommendation", en: "🧥 Clothing recommendation", et: "🧥 Riietussoovitus", ar: "🧥 توصية الملابس" },

  // Checklist
  "checklist.title": { fi: "🎒 Päiväkoti-reppu", sv: "🎒 Dagisryggsäck", en: "🎒 Daycare backpack", et: "🎒 Lasteaia seljakott", ar: "🎒 حقيبة الروضة" },
  "checklist.title.school": { fi: "🎒 Koulureppu", sv: "🎒 Skolryggsäck", en: "🎒 School backpack", et: "🎒 Koolikott", ar: "🎒 حقيبة المدرسة" },
  "checklist.allPacked": { fi: "✅ Kaikki pakattu!", sv: "✅ Allt packat!", en: "✅ All packed!", et: "✅ Kõik pakitud!", ar: "✅ تم تجهيز كل شيء!" },
  "checklist.weatherGear": { fi: "🌦️ Säänmukaiset varusteet", sv: "🌦️ Väderanpassad utrustning", en: "🌦️ Weather-appropriate gear", et: "🌦️ Ilmastikule vastavad varustused", ar: "🌦️ معدات مناسبة للطقس" },
  "checklist.spareClothes": { fi: "👕 Perusvarusteet", sv: "👕 Basutrustning", en: "👕 Essentials", et: "👕 Põhivarustus", ar: "👕 الأساسيات" },
  "checklist.miscItems": { fi: "🎲 Satunnaiset tavarat", sv: "🎲 Övriga saker", en: "🎲 Miscellaneous items", et: "🎲 Muud asjad", ar: "🎲 أغراض متنوعة" },
  "checklist.myNote": { fi: "📝 Oma muistiinpano", sv: "📝 Min anteckning", en: "📝 My note", et: "📝 Minu märkus", ar: "📝 ملاحظتي" },
  "checklist.notePlaceholder": { fi: "Kirjoita tähän oma tavara tai muistutus…", sv: "Skriv din egen sak eller påminnelse här…", en: "Write your own item or reminder here…", et: "Kirjuta siia oma asi või meeldetuletus…", ar: "اكتب غرضك أو تذكيرك هنا…" },
  "checklist.fridayReminder": { fi: "📋 Muista tyhjentää reppu viikonlopuksi ja tarkistaa vaihtovaatteiden määrä!", sv: "📋 Kom ihåg att tömma ryggsäcken inför helgen och kontrollera ombyteskläderna!", en: "📋 Remember to empty the backpack for the weekend and check spare clothes!", et: "📋 Ära unusta kotti nädalavahetuseks tühjendada ja vahetusriideid kontrollida!", ar: "📋 تذكر إفراغ الحقيبة لعطلة نهاية الأسبوع والتحقق من الملابس الاحتياطية!" },
  "checklist.sundayReminder": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet päiväkotiin!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till dagis!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for daycare!", et: "👕 Homme on esmaspäev — ära unusta vahetusriideid lasteaeda pakkida!", ar: "👕 غداً الإثنين — تذكر تجهيز الملابس الاحتياطية للروضة!" },
  "checklist.sundayReminder.school": { fi: "👕 Huomenna on maanantai — muista pakata vaihtovaatteet kouluun!", sv: "👕 I morgon är det måndag — kom ihåg att packa ombyteskläder till skolan!", en: "👕 Tomorrow is Monday — remember to pack spare clothes for school!", et: "👕 Homme on esmaspäev — ära unusta vahetusriideid kooli pakkida!", ar: "👕 غداً الإثنين — تذكر تجهيز الملابس الاحتياطية للمدرسة!" },
  "checklist.mondayReminder": { fi: "👕 Muista viedä vaihtovaatteet takaisin päiväkotiin tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till dagis idag!", en: "👕 Remember to bring spare clothes back to daycare today!", et: "👕 Ära unusta täna vahetusriideid lasteaeda tagasi viia!", ar: "👕 تذكر إعادة الملابس الاحتياطية للروضة اليوم!" },
  "checklist.mondayReminder.school": { fi: "👕 Muista viedä vaihtovaatteet takaisin kouluun tänään!", sv: "👕 Kom ihåg att ta med ombyteskläderna tillbaka till skolan idag!", en: "👕 Remember to bring spare clothes back to school today!", et: "👕 Ära unusta täna vahetusriideid kooli tagasi viia!", ar: "👕 تذكر إعادة الملابس الاحتياطية للمدرسة اليوم!" },

  // Checklist items
  "item.varahousut": { fi: "Varahousut", sv: "Reservbyxor", en: "Spare trousers", et: "Varupüksid", ar: "بنطلون احتياطي" },
  "item.varapaita": { fi: "Varapaita", sv: "Reservtröja", en: "Spare shirt", et: "Varusärk", ar: "قميص احتياطي" },
  "item.alusvaatteet": { fi: "Alusvaatteet", sv: "Underkläder", en: "Underwear", et: "Aluspesu", ar: "ملابس داخلية" },
  "item.heijastin": { fi: "Heijastin tai heijastinliivi", sv: "Reflex eller reflexväst", en: "Reflector or reflector vest", et: "Helkur või helkurvest", ar: "عاكس أو سترة عاكسة" },
  "item.varahanskat": { fi: "Varahanskat", sv: "Reservvantar", en: "Spare gloves", et: "Varukindad", ar: "قفازات احتياطية" },
  "item.vaihtosukat": { fi: "Vaihtosukat", sv: "Reservstrumpor", en: "Spare socks", et: "Varusokid", ar: "جوارب احتياطية" },
  "item.vaippapaketti": { fi: "Vaippapaketti", sv: "Blöjpaket", en: "Diaper pack", et: "Mähkmepakett", ar: "عبوة حفاضات" },
  "item.tutti": { fi: "Tutti", sv: "Napp", en: "Pacifier", et: "Lutt", ar: "لهّاية" },
  "item.unilelu": { fi: "Unilelu", sv: "Gossedjur", en: "Comfort toy", et: "Unemänguasi", ar: "لعبة نوم" },
  "item.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", en: "Sunscreen", et: "Päikesekaitsekreem", ar: "واقي شمس" },
  "item.juomapullo": { fi: "Juomapullo", sv: "Vattenflaska", en: "Water bottle", et: "Joogipudel", ar: "زجاجة ماء" },
  "item.omalelu": { fi: "Oma lelu", sv: "Egen leksak", en: "Own toy", et: "Oma mänguasi", ar: "لعبة خاصة" },
  "item.välipala": { fi: "Välipala", sv: "Mellanmål", en: "Snack", et: "Vahepalake", ar: "وجبة خفيفة" },
  "item.avaimet": { fi: "Avaimet", sv: "Nycklar", en: "Keys", et: "Võtmed", ar: "مفاتيح" },
  "item.uikkarit": { fi: "Uikkarit & pyyhe", sv: "Badkläder & handduk", en: "Swimwear & towel", et: "Ujumisriided ja rätik", ar: "ملابس سباحة ومنشفة" },
  "item.sisäliikunta": { fi: "Sisäliikuntavaatteet & pyyhe", sv: "Inomhusidrottskläder & handduk", en: "Indoor sports clothes & towel", et: "Siseliikumisriided ja rätik", ar: "ملابس رياضة داخلية ومنشفة" },
  "item.lippis": { fi: "Lippis/Hattu", sv: "Keps/Hatt", en: "Cap/Hat", et: "Nokamüts/Kübar", ar: "قبعة" },
  "item.kuravarusteet": { fi: "Kuravarusteet", sv: "Regnutrustning", en: "Rain gear", et: "Vihmariided", ar: "معدات المطر" },
  "item.vaihtohanskat": { fi: "Vaihtohanskat", sv: "Extravantar", en: "Extra gloves", et: "Lisakindad", ar: "قفازات إضافية" },
  "item.lamminkerrasto": { fi: "Lämmin kerrasto", sv: "Varmt underställ", en: "Warm base layer", et: "Soe kiht", ar: "طبقة دافئة" },
  "item.luistimet": { fi: "Luistimet & kypärä", sv: "Skridskor & hjälm", en: "Ice skates & helmet", et: "Uisud ja kiiver", ar: "أحذية تزلج وخوذة" },

  // Weekdays
  "weekday.0": { fi: "Sunnuntai", sv: "Söndag", en: "Sunday", et: "Pühapäev", ar: "الأحد" },
  "weekday.1": { fi: "Maanantai", sv: "Måndag", en: "Monday", et: "Esmaspäev", ar: "الإثنين" },
  "weekday.2": { fi: "Tiistai", sv: "Tisdag", en: "Tuesday", et: "Teisipäev", ar: "الثلاثاء" },
  "weekday.3": { fi: "Keskiviikko", sv: "Onsdag", en: "Wednesday", et: "Kolmapäev", ar: "الأربعاء" },
  "weekday.4": { fi: "Torstai", sv: "Torsdag", en: "Thursday", et: "Neljapäev", ar: "الخميس" },
  "weekday.5": { fi: "Perjantai", sv: "Fredag", en: "Friday", et: "Reede", ar: "الجمعة" },
  "weekday.6": { fi: "Lauantai", sv: "Lördag", en: "Saturday", et: "Laupäev", ar: "السبت" },
  "weather.today": { fi: "Tänään", sv: "Idag", en: "Today", et: "Täna", ar: "اليوم" },

  // Tomorrow forecast
  "tomorrow.title": { fi: "Huomisen sää — Ennuste", sv: "Morgondagens väder — Prognos", en: "Tomorrow's weather — Forecast", et: "Homse ilm — Prognoos", ar: "طقس الغد — التوقعات" },
  "tomorrow.rainProb": { fi: "Sateen todennäköisyys", sv: "Regnchans", en: "Rain probability", et: "Vihma tõenäosus", ar: "احتمال المطر" },
  "tomorrow.prepTitle": { fi: "Valmistele huomiseksi — Poimi valmiiksi:", sv: "Förbered till i morgon — Plocka fram:", en: "Prepare for tomorrow — Get ready:", et: "Valmista homme jaoks — Pane valmis:", ar: "استعد للغد — جهّز:" },
  "tomorrow.colderWarning": { fi: "Huomiseksi kylmenee, muista lämpimämpi kerrasto.", sv: "Det blir kallare i morgon, kom ihåg varmare underställ.", en: "It gets colder tomorrow, remember warmer layers.", et: "Homme läheb külmemaks, ära unusta soojemaid kihte.", ar: "سيكون أبرد غداً، تذكر طبقات أدفأ." },
  "tomorrow.rainWarning": { fi: "Huomenna sataa, muista viedä kuravarusteet päiväkotiin.", sv: "Det regnar i morgon, kom ihåg att ta med regnutrustning till dagis.", en: "Rain expected tomorrow, remember rain gear for daycare.", et: "Homme sajab, ära unusta vihmariideid lasteaeda.", ar: "متوقع مطر غداً، تذكر ملابس المطر للروضة." },
  "tomorrow.morningGear": { fi: "Aamun varusteet", sv: "Morgonens utrustning", en: "Morning gear", et: "Hommikune varustus", ar: "معدات الصباح" },
  "tomorrow.afternoonGear": { fi: "Iltapäivän varusteet", sv: "Eftermiddagens utrustning", en: "Afternoon gear", et: "Pärastlõunane varustus", ar: "معدات بعد الظهر" },

  // AI Analysis
  "ai.title": { fi: "Pukurin analyysi", sv: "Pukuris analys", en: "Pukuri's analysis", et: "Pukuri analüüs", ar: "تحليل Pukuri" },
  "ai.ageGroup": { fi: "Ikäryhmä", sv: "Åldersgrupp", en: "Age group", et: "Vanuserühm", ar: "الفئة العمرية" },
  "ai.analyzing": { fi: "Analysoidaan...", sv: "Analyserar...", en: "Analyzing...", et: "Analüüsimine...", ar: "جارٍ التحليل..." },
  "ai.updated": { fi: "Päivitetty", sv: "Uppdaterad", en: "Updated", et: "Uuendatud", ar: "تم التحديث" },
  "ai.rainTip": { fi: "🌧️ Huomataan lähestyvä sadealue klo 14. Suosittelen kuravarusteita jo aamusta, jotta ulkoilu ei keskeydy.", sv: "🌧️ Vi ser ett regnområde som närmar sig kl 14. Jag rekommenderar regnutrustning redan på morgonen så att utevistelsen inte avbryts.", en: "🌧️ A rain area is approaching around 14:00. I recommend rain gear from the morning so outdoor time isn't interrupted.", et: "🌧️ Vihmatsoon läheneb kella 14 paiku. Soovitan vihmariideid juba hommikust, et õues mängimine ei katkeks.", ar: "🌧️ منطقة مطر تقترب حوالي الساعة 14. أنصح بملابس المطر من الصباح حتى لا ينقطع اللعب في الخارج." },
  "ai.hardWindTip": { fi: "💨 Tänään on kova tuuli ({speed} m/s). Vaikka mittari näyttää {temp}°C, viima tuntuu pakkaselta. Valitse tuulenpitävä kuorikerros.", sv: "💨 Det blåser kraftigt idag ({speed} m/s). Även om termometern visar {temp}°C känns det kallare med vinden. Välj ett vindtätt skalplagg.", en: "💨 Strong wind today ({speed} m/s). Even though it shows {temp}°C, wind chill makes it feel freezing. Choose a windproof shell layer.", et: "💨 Täna on tugev tuul ({speed} m/s). Kuigi termomeeter näitab {temp}°C, tundub tuulekülm külmemana. Vali tuulekindel kiht.", ar: "💨 رياح قوية اليوم ({speed} م/ث). رغم أن الحرارة {temp}°م، الرياح تجعلها تبدو متجمدة. اختر طبقة مقاومة للرياح." },
  "ai.moderateWindTip": { fi: "💨 Kohtalainen tuuli ({speed} m/s) viilentää tuntuvasti. Tuulenpitävä kerros on hyvä valinta.", sv: "💨 Måttlig vind ({speed} m/s) kyler ner märkbart. Ett vindtätt lager är ett bra val.", en: "💨 Moderate wind ({speed} m/s) cools noticeably. A windproof layer is a good choice.", et: "💨 Mõõdukas tuul ({speed} m/s) jahutab märgatavalt. Tuulekindel kiht on hea valik.", ar: "💨 رياح معتدلة ({speed} م/ث) تبرد بشكل ملحوظ. طبقة مقاومة للرياح خيار جيد." },
  "ai.layeringTip": { fi: "🌡️ Aamu on kylmä ({feelsLike}°C tuntuu), mutta iltapäivällä lämpötila nousee ({temp}°C). Kerrospukeutuminen on tänään avainasemassa.", sv: "🌡️ Morgonen är kall (känns som {feelsLike}°C), men på eftermiddagen stiger temperaturen ({temp}°C). Lagerklädsel är nyckeln idag.", en: "🌡️ Morning is cold (feels like {feelsLike}°C), but afternoon warms up ({temp}°C). Layering is key today.", et: "🌡️ Hommik on külm (tundub {feelsLike}°C), aga pärastlõunal temperatuur tõuseb ({temp}°C). Kihiline riietus on täna võtmetähtsusega.", ar: "🌡️ الصباح بارد (يبدو {feelsLike}°م)، لكن بعد الظهر ترتفع الحرارة ({temp}°م). التطبيق الطبقي أساسي اليوم." },
  "ai.uvTip": { fi: "☀️ UV-indeksi on korkea ({uvi}). Aurinko paistaa voimakkaasti. Suojaa lapsen iho aurinkorasvalla, vaikka tuntuisi viileältä. Lippis ja aurinkolasit mukaan{age}!", sv: "☀️ UV-index är högt ({uvi}). Solen skiner starkt. Skydda barnets hud med solskyddskräm, även om det känns svalt. Ta med keps och solglasögon{age}!", en: "☀️ UV index is high ({uvi}). The sun is strong. Protect the child's skin with sunscreen, even if it feels cool. Bring cap and sunglasses{age}!", et: "☀️ UV-indeks on kõrge ({uvi}). Päike paistab tugevalt. Kaitse lapse nahka päikesekaitsekreemiga, isegi kui tundub jahe. Võta kaasa nokamüts ja päikeseprillid{age}!", ar: "☀️ مؤشر UV مرتفع ({uvi}). الشمس قوية. احمِ بشرة الطفل بواقي الشمس حتى لو كان الجو بارداً. خذ قبعة ونظارات شمسية{age}!" },
  "ai.sunnyUvTip": { fi: "☀️ Korkea UV-indeksi. Muista aurinkorasva ja lippis suojaksi.", sv: "☀️ Högt UV-index. Kom ihåg solskyddskräm och keps som skydd.", en: "☀️ High UV index. Remember sunscreen and a cap for protection.", et: "☀️ Kõrge UV-indeks. Ära unusta päikesekaitsekreemi ja nokamütsi.", ar: "☀️ مؤشر UV مرتفع. تذكر واقي الشمس والقبعة للحماية." },
  "ai.calmDay": { fi: "✅ Tänään on rauhallinen sääpäivä ({temp}°C, {desc}). Normaalit kauden vaatteet riittävät hyvin.", sv: "✅ En lugn väderdag idag ({temp}°C, {desc}). Normala säsongskläder räcker bra.", en: "✅ A calm weather day ({temp}°C, {desc}). Normal seasonal clothing will do just fine.", et: "✅ Täna on rahulik ilmapäev ({temp}°C, {desc}). Tavalised hooajariided sobivad hästi.", ar: "✅ يوم طقس هادئ ({temp}°م، {desc}). الملابس الموسمية العادية كافية تماماً." },
  "ai.mudTip": { fi: "💡 Vaikka nyt on poutaa, maa on vielä märkä. Kurahousut ovat hyvä valinta suojaamaan vaatteet hiekkalaatikolla.", sv: "💡 Även om det är uppehåll nu är marken fortfarande blöt. Regnbyxor är ett bra val för att skydda kläderna i sandlådan.", en: "💡 Even though it's dry now, the ground is still wet. Rain trousers are a good choice to protect clothes at the sandbox.", et: "💡 Kuigi praegu on kuiv, on maapind veel märg. Vihmapüksid on hea valik riieteid liivakastis kaitsta.", ar: "💡 رغم أن الجو جاف الآن، الأرض لا تزال مبللة. بنطلون المطر خيار جيد لحماية الملابس في صندوق الرمل." },
  "ai.gapTip": { fi: "🌡️ Aamu on kylmä ({amTemp}°C), mutta iltapäivällä tarkenee vähemmällä ({pmTemp}°C). Muista kerrospukeutuminen ja pakkaa ohuempi paita reppuun.", sv: "🌡️ Morgonen är kall ({amTemp}°C), men på eftermiddagen klarar man sig med mindre ({pmTemp}°C). Kom ihåg lagerklädsel och packa en tunnare tröja i ryggsäcken.", en: "🌡️ Morning is cold ({amTemp}°C), but afternoon is warmer ({pmTemp}°C). Remember layering and pack a lighter shirt in the backpack.", et: "🌡️ Hommik on külm ({amTemp}°C), aga pärastlõunal saab hakkama vähemaga ({pmTemp}°C). Ära unusta kihilist riietumist ja paki õhem särk kotti.", ar: "🌡️ الصباح بارد ({amTemp}°م)، لكن بعد الظهر أدفأ ({pmTemp}°م). تذكر الطبقات وضع قميصاً أخف في الحقيبة." },
  "ai.layerZoneTip": { fi: "🧤 Suosi tänään kerrospukeutumista. Ohut villakerros väliin pitää lapsen lämpimänä ilman hikoilua.", sv: "🧤 Föredra lagerklädsel idag. Ett tunt ullager emellan håller barnet varmt utan att svettas.", en: "🧤 Layer up today. A thin wool layer in between keeps the child warm without sweating.", et: "🧤 Eelista täna kihilist riietumist. Õhuke villakiht vahel hoiab lapse soojana ilma higistamata.", ar: "🧤 ارتدِ طبقات اليوم. طبقة صوف رقيقة بينها تبقي الطفل دافئاً دون تعرق." },
   "ai.windChillTip": { fi: "🌬️ Tuuli tekee säästä purevan ({speed} m/s), suosi tuulenpitävää kuorikerrosta.", sv: "🌬️ Vinden gör vädret bitande ({speed} m/s), välj vindtätt skalplagg.", en: "🌬️ Wind makes the weather biting ({speed} m/s), choose a windproof shell layer.", et: "🌬️ Tuul teeb ilma läbilõikavaks ({speed} m/s), vali tuulekindel kiht.", ar: "🌬️ الرياح تجعل الطقس لاذعاً ({speed} م/ث)، اختر طبقة واقية من الرياح." },
   "ai.uvReminderTip": { fi: "☀️ Aurinko on voimakasta (UV {uvi}). Muista aurinkorasva ja hattu.", sv: "☀️ Solen är stark (UV {uvi}). Kom ihåg solskyddskräm och hatt.", en: "☀️ The sun is strong (UV {uvi}). Remember sunscreen and a hat.", et: "☀️ Päike on tugev (UV {uvi}). Ära unusta päikesekaitsekreemi ja kübarat.", ar: "☀️ الشمس قوية (UV {uvi}). تذكر واقي الشمس والقبعة." },
   "ai.mudTipWet": { fi: "💡 Maa on yhä märkä sateen jäljiltä. Kurahousut suojaavat vaatteet leikeissä.", sv: "💡 Marken är fortfarande blöt efter regnet. Regnbyxor skyddar kläderna under leken.", en: "💡 The ground is still wet from rain. Rain trousers protect clothes during play.", et: "💡 Maapind on veel märg vihma järel. Vihmapüksid kaitsevad riideid mängimise ajal.", ar: "💡 الأرض لا تزال مبللة من المطر. بنطلون المطر يحمي الملابس أثناء اللعب." },
   "ai.morningGapHighlight": { fi: "⭐ Vinkki aamuun: Aamu on kylmä ({amTemp}°C), mutta iltapäivällä lämpenee huomattavasti ({pmTemp}°C). Pakkaa ohuempi paita reppuun ja suosi kerrospukeutumista.", sv: "⭐ Morgontips: Morgonen är kall ({amTemp}°C), men det blir betydligt varmare på eftermiddagen ({pmTemp}°C). Packa en tunnare tröja i ryggsäcken och satsa på lagerklädsel.", en: "⭐ Morning tip: The morning is cold ({amTemp}°C), but it warms up significantly in the afternoon ({pmTemp}°C). Pack a lighter shirt in the backpack and layer up.", et: "⭐ Hommikune nõuanne: Hommik on külm ({amTemp}°C), aga pärastlõunal soojeneb tunduvalt ({pmTemp}°C). Paki õhem särk kotti ja eelista kihilist riietumist.", ar: "⭐ نصيحة الصباح: الصباح بارد ({amTemp}°م)، لكنه يسخن بشكل ملحوظ بعد الظهر ({pmTemp}°م). ضع قميصاً أخف في الحقيبة وارتدِ طبقات." },
   "ai.springTip": { fi: "☀️ Kevätaurinko lämmittää! Vaikka lämpömittari näyttää lievää pakkasta, välikausivaatteet hyvällä välikerroksella ovat nyt paras valinta aktiiviseen ulkoiluun.", sv: "☀️ Vårsolen värmer! Även om termometern visar lätt frost är mellansäsongskläder med ett bra mellanlager nu det bästa valet för aktiv utevistelse.", en: "☀️ The spring sun is warming things up! Even though the thermometer shows a slight frost, mid-season gear with a good mid-layer is now the best choice for active play.", et: "☀️ Kevadpäike soojendab! Kuigi termomeeter näitab kerget külma, on vahehooajariided hea soojuskihiga praegu parim valik aktiivseks väljas viibimiseks.", ar: "☀️ شمس الربيع تدفئ! رغم أن الحرارة تُظهر صقيعاً خفيفاً، ملابس الموسم المتوسط مع طبقة وسطى جيدة هي الخيار الأفضل للعب النشط." },
   "ai.springWindTip": { fi: "💨 Vaikka tuuli on pureva, kevätaurinko lämmittää jo tehokkaasti. Pysytään välikausivaatteissa, mutta muista lisätä lämmin välikerros (villa/fleece) tuulensuojaksi.", sv: "💨 Även om vinden biter, värmer vårsolen redan effektivt. Vi håller oss till skalkläder, men glöm inte ett varmt mellanlager (ull/fleece) som vindskydd.", en: "💨 Even though the wind is biting, the spring sun is already warming effectively. Stick with mid-season gear, but remember to add a warm mid-layer (wool/fleece) for wind protection.", et: "💨 Kuigi tuul on läbilõikav, soojendab kevadpäike juba tõhusalt. Jääme vahehooajariietesse, aga ära unusta lisada sooja vahekihti (vill/fliis) tuulekaitseks.", ar: "💨 رغم أن الرياح لاذعة، شمس الربيع تدفئ بالفعل بفعالية. ابقَ مع ملابس الموسم المتوسط، لكن تذكر إضافة طبقة وسطى دافئة (صوف/فليس) للحماية من الرياح." },
   "ai.hasSpecialTip": { fi: "Erityishuomio", sv: "Specialtips", en: "Special tip", et: "Eritähelepanu", ar: "نصيحة خاصة" },
  "ai.ageLabel.vauva": { fi: " vauvalle", sv: " för babyn", en: " for the baby", et: " beebile", ar: " للرضيع" },
  "ai.ageLabel.taapero": { fi: " taaperolle", sv: " för småbarnet", en: " for the toddler", et: " väikelapsele", ar: " للطفل الصغير" },
  "ai.ageLabel.leikki-ikäinen": { fi: " leikki-ikäiselle", sv: " för förskolebarnet", en: " for the preschooler", et: " eelkooliealisele", ar: " لطفل ما قبل المدرسة" },
  "ai.ageLabel.koululainen": { fi: " koululaiselle", sv: " för skolbarnet", en: " for the school child", et: " koolilapsele", ar: " لطفل المدرسة" },

  // UV Alert
  "uv.veryHigh": { fi: "Erittäin korkea", sv: "Mycket högt", en: "Very high", et: "Väga kõrge", ar: "مرتفع جداً" },
  "uv.high": { fi: "Korkea", sv: "Högt", en: "High", et: "Kõrge", ar: "مرتفع" },
  "uv.moderate": { fi: "Kohtalainen", sv: "Måttligt", en: "Moderate", et: "Mõõdukas", ar: "معتدل" },
  "uv.titleFormat": { fi: "{level} UV-indeksi ({uvi})", sv: "{level} UV-index ({uvi})", en: "{level} UV index ({uvi})", et: "{level} UV-indeks ({uvi})", ar: "مؤشر UV {level} ({uvi})" },
  "uv.description": { fi: "Muista aurinkorasva ja hattu! Suojaa lapsen iho, silmät ja pää auringolta.", sv: "Kom ihåg solskyddskräm och hatt! Skydda barnets hud, ögon och huvud mot solen.", en: "Remember sunscreen and a hat! Protect the child's skin, eyes and head from the sun.", et: "Ära unusta päikesekaitsekreemi ja kübarat! Kaitse lapse nahka, silmi ja pead päikese eest.", ar: "تذكر واقي الشمس والقبعة! احمِ بشرة الطفل وعينيه ورأسه من الشمس." },

  // Schedule
  "schedule.title.vauva": { fi: "Vauvan", sv: "Babyns", en: "Baby's", et: "Beebi", ar: "الرضيع" },
  "schedule.title.taapero": { fi: "Taaperon", sv: "Småbarnets", en: "Toddler's", et: "Väikelapse", ar: "الطفل الصغير" },
  "schedule.title.leikki-ikäinen": { fi: "Leikki-ikäisen", sv: "Förskolebarnets", en: "Preschooler's", et: "Eelkooliealise", ar: "طفل ما قبل المدرسة" },
  "schedule.title.koululainen": { fi: "Koululaisen", sv: "Skolbarnets", en: "School child's", et: "Koolilapse", ar: "طفل المدرسة" },
  "schedule.weeklySchedule": { fi: "viikko-ohjelma", sv: "veckoschema", en: "weekly schedule", et: "nädala ajakava", ar: "الجدول الأسبوعي" },
  "schedule.addImageDesc": { fi: "Lisää kuva lukujärjestyksestä tai päiväkodin viikko-ohjelmasta", sv: "Lägg till bild på schemat eller dagisens veckoprogram", en: "Add a photo of the schedule or daycare weekly program", et: "Lisa pilt tunniplaanist või lasteaia nädala ajakavast", ar: "أضف صورة للجدول أو البرنامج الأسبوعي للروضة" },
  "schedule.saving": { fi: "Tallennetaan...", sv: "Sparar...", en: "Saving...", et: "Salvestamine...", ar: "جارٍ الحفظ..." },
  "schedule.saved": { fi: "Kuva tallennettu!", sv: "Bilden sparad!", en: "Image saved!", et: "Pilt salvestatud!", ar: "تم حفظ الصورة!" },
  "schedule.saveError": { fi: "Hups! Kuva on liian suuri tai tallennus epäonnistui. Yritä pienemmällä kuvalla.", sv: "Hoppsan! Bilden är för stor eller sparningen misslyckades. Prova med en mindre bild.", en: "Oops! Image is too large or saving failed. Try a smaller image.", et: "Ups! Pilt on liiga suur või salvestamine ebaõnnestus. Proovi väiksema pildiga.", ar: "عذراً! الصورة كبيرة جداً أو فشل الحفظ. جرب صورة أصغر." },
  "schedule.viewLarge": { fi: "Katso isona", sv: "Visa i fullstorlek", en: "View full size", et: "Vaata suurelt", ar: "عرض بالحجم الكامل" },
  "schedule.changeImage": { fi: "Vaihda kuva", sv: "Byt bild", en: "Change image", et: "Vaheta pilt", ar: "تغيير الصورة" },
  "schedule.removeImage": { fi: "Poista kuva", sv: "Ta bort bild", en: "Remove image", et: "Eemalda pilt", ar: "إزالة الصورة" },
  "schedule.addSchedule": { fi: "Lisää lukujärjestys", sv: "Lägg till schema", en: "Add schedule", et: "Lisa tunniplaan", ar: "إضافة جدول" },
  "schedule.takeOrSelect": { fi: "Ota kuva tai valitse galleriasta", sv: "Ta en bild eller välj från galleriet", en: "Take a photo or select from gallery", et: "Tee foto või vali galeriist", ar: "التقط صورة أو اختر من المعرض" },
  "schedule.doubleTapReset": { fi: "Kaksoisnapautus nollataksesi", sv: "Dubbeltryck för att återställa", en: "Double tap to reset", et: "Topeltpuudutus lähtestamiseks", ar: "انقر مرتين لإعادة التعيين" },
  "schedule.pinchToZoom": { fi: "Nipistä zoomataksesi", sv: "Nyp för att zooma", en: "Pinch to zoom", et: "Näpista suurendamiseks", ar: "اضغط للتكبير" },
  "schedule.close": { fi: "Sulje", sv: "Stäng", en: "Close", et: "Sulge", ar: "إغلاق" },

  // Schedule reminder
  "scheduleReminder.text": { fi: "Tarkista päivän ohjelma kuvasta", sv: "Kontrollera dagens program från bilden", en: "Check today's program from the image", et: "Kontrolli päeva kava pildilt", ar: "تحقق من برنامج اليوم من الصورة" },

  // Affiliate
  "affiliate.title": { fi: "Suosittelemme laadukkaita varusteita", sv: "Vi rekommenderar kvalitetsutrustning", en: "We recommend quality gear", et: "Soovitame kvaliteetvarustust", ar: "نوصي بمعدات عالية الجودة" },
  "affiliate.polarnopyret.desc": { fi: "Polarn O. Pyret – Laatua, joka kestää lapselta toiselle", sv: "Polarn O. Pyret – Kvalitet som håller från barn till barn", en: "Polarn O. Pyret – Quality that lasts from child to child", et: "Polarn O. Pyret – Kvaliteet, mis kestab lapselt lapsele", ar: "Polarn O. Pyret – جودة تدوم من طفل لآخر" },
  "affiliate.polarnopyret.cta": { fi: "Tutustu ulkoilu- ja arkivaatteisiin", sv: "Upptäck ute- och vardagskläder", en: "Explore outdoor & everyday clothing", et: "Tutvu õue- ja igapäevariietega", ar: "استكشف ملابس الخروج واليومية" },
  "affiliate.lindex.desc": { fi: "Kestävät ja pehmeät arkivaatteet lapsille", sv: "Hållbara och mjuka vardagskläder för barn", en: "Durable and soft everyday clothes for kids", et: "Vastupidavad ja pehmed igapäevariided lastele", ar: "ملابس يومية متينة وناعمة للأطفال" },
  "affiliate.lindex.cta": { fi: "Katso päivän tarjoukset", sv: "Se dagens erbjudanden", en: "See today's deals", et: "Vaata päeva pakkumisi", ar: "شاهد عروض اليوم" },
  "affiliate.disclaimer": {
    fi: "Pukuri suosittelee laadukkaita varusteita arkeen. Linkit ovat mainoslinkkejä, joiden kautta tuet sovelluksen kehitystä.",
    sv: "Pukuri rekommenderar kvalitetsutrustning för vardagen. Länkarna är annonslänkar som stöder utvecklingen av appen.",
    en: "Pukuri recommends quality gear for everyday life. Links are affiliate links that support the app's development.",
    et: "Pukuri soovitab kvaliteetvarustust igapäevaellu. Lingid on reklaamlingid, mis toetavad rakenduse arendust.",
    ar: "يوصي Pukuri بمعدات عالية الجودة للحياة اليومية. الروابط هي روابط تابعة تدعم تطوير التطبيق."
  },
  "affiliate.adtraction": {
    fi: "Tämä sivusto on vahvistettu Adtraction-verkostoon.",
    sv: "Denna webbplats är verifierad i Adtraction-nätverket.",
    en: "This site is verified in the Adtraction network.",
    et: "See sait on kinnitatud Adtraction-võrgustikus.",
    ar: "هذا الموقع موثّق في شبكة Adtraction."
  },

  // Feedback
  "feedback.title": { fi: "Anna palautetta", sv: "Ge feedback", en: "Give feedback", et: "Anna tagasisidet", ar: "أرسل ملاحظاتك" },
  "feedback.placeholder": { fi: "Mitä voisimme parantaa?", sv: "Vad kan vi förbättra?", en: "What could we improve?", et: "Mida saaksime parandada?", ar: "ما الذي يمكننا تحسينه؟" },
  "feedback.send": { fi: "Lähetä palaute", sv: "Skicka feedback", en: "Send feedback", et: "Saada tagasiside", ar: "إرسال الملاحظات" },
  "feedback.sending": { fi: "Lähetetään...", sv: "Skickar...", en: "Sending...", et: "Saatmine...", ar: "جارٍ الإرسال..." },
  "feedback.thanks": { fi: "Kiitos! Palautteesi on vastaanotettu.", sv: "Tack! Din feedback har mottagits.", en: "Thank you! Your feedback has been received.", et: "Aitäh! Sinu tagasiside on vastu võetud.", ar: "شكراً! تم استلام ملاحظاتك." },
  "feedback.thanksDesc": { fi: "Autat meitä tekemään Pukurista paremman.", sv: "Du hjälper oss att göra Pukuri bättre.", en: "You're helping us make Pukuri better.", et: "Sa aitad meil Pukurit paremaks teha.", ar: "أنت تساعدنا في جعل Pukuri أفضل." },
  "feedback.error": { fi: "Lähetys epäonnistui. Yritä uudelleen.", sv: "Sändningen misslyckades. Försök igen.", en: "Sending failed. Please try again.", et: "Saatmine ebaõnnestus. Proovi uuesti.", ar: "فشل الإرسال. يرجى المحاولة مرة أخرى." },

  // Footer
  "footer.copyright": { fi: "© 2024 Pukuri", sv: "© 2024 Pukuri", en: "© 2024 Pukuri", et: "© 2024 Pukuri", ar: "© 2024 Pukuri" },
  "footer.privacy": { fi: "Tietosuoja", sv: "Integritetspolicy", en: "Privacy", et: "Privaatsus", ar: "الخصوصية" },
  "footer.contact": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", en: "Contact", et: "Kontakt", ar: "اتصل بنا" },
  "footer.close": { fi: "Sulje", sv: "Stäng", en: "Close", et: "Sulge", ar: "إغلاق" },
  "footer.privacyTitle": { fi: "Tietosuojaseloste", sv: "Integritetspolicy", en: "Privacy Policy", et: "Privaatsuspoliitika", ar: "سياسة الخصوصية" },
  "footer.contactTitle": { fi: "Yhteystiedot", sv: "Kontaktuppgifter", en: "Contact Information", et: "Kontaktandmed", ar: "معلومات الاتصال" },
  "footer.privacyS1Title": { fi: "1. Rekisterinpitäjä", sv: "1. Registeransvarig", en: "1. Data Controller", et: "1. Vastutav töötleja", ar: "1. مراقب البيانات" },
  "footer.privacyS1": { fi: "Pukuri-sovellus (Yhteystiedot kohdassa 6).", sv: "Pukuri-appen (Kontaktuppgifter i avsnitt 6).", en: "Pukuri app (Contact details in section 6).", et: "Pukuri rakendus (Kontaktandmed punktis 6).", ar: "تطبيق Pukuri (تفاصيل الاتصال في القسم 6)." },
  "footer.privacyS2Title": { fi: "2. Kerättävät tiedot ja sijaintitieto", sv: "2. Insamlade uppgifter och platsdata", en: "2. Collected Data and Location", et: "2. Kogutavad andmed ja asukohainfo", ar: "2. البيانات المجمعة والموقع" },
  "footer.privacyS2": { fi: "Sijaintitieto: Sovellus pyytää lupaa käyttää laitteesi sijaintitietoa (GPS) hakeakseen reaaliaikaisen sääennusteen OpenWeatherMap-palvelusta. Sijaintitietoa käytetään vain sääkyselyyn, eikä sitä tallenneta sovelluksen ulkopuolelle tai jaeta kolmansille osapuolille.\n\nPaikallinen tallennus: Sovellus tallentaa laitteesi muistiin (LocalStorage) käyttäjän valitseman kaupungin, lapsen ikäryhmän, lämpöprofiiliasetukset sekä viikko-ohjelman. Nämä tiedot pysyvät vain omassa laitteessasi.", sv: "Platsdata: Appen begär tillåtelse att använda enhetens platsdata (GPS) för att hämta realtidsväderprognos från OpenWeatherMap. Platsdata används bara för väderfrågor och sparas inte utanför appen eller delas med tredje parter.\n\nLokal lagring: Appen sparar i enhetens minne (LocalStorage) användarens valda stad, barnets åldersgrupp, värmeprofil och veckoschema. Dessa uppgifter finns bara på din enhet.", en: "Location data: The app requests permission to use your device's location (GPS) to fetch real-time weather forecasts from OpenWeatherMap. Location data is only used for weather queries and is not stored outside the app or shared with third parties.\n\nLocal storage: The app stores in your device's memory (LocalStorage) the selected city, child's age group, temperature profile settings, and weekly schedule. This data stays only on your device.", et: "Asukohainfo: Rakendus küsib luba kasutada seadme asukohta (GPS), et hankida reaalajas ilmaennustus OpenWeatherMap teenusest. Asukohainfot kasutatakse ainult ilmapäringuks ega salvestata väljaspool rakendust ega jagata kolmandatele osapooltele.\n\nKohalik salvestus: Rakendus salvestab seadme mällu (LocalStorage) kasutaja valitud linna, lapse vanuserühma, soojusprofiili seaded ja nädala ajakava. Need andmed jäävad ainult teie seadmesse.", ar: "بيانات الموقع: يطلب التطبيق إذناً لاستخدام موقع جهازك (GPS) لجلب توقعات الطقس في الوقت الفعلي من OpenWeatherMap. تُستخدم بيانات الموقع فقط لاستعلامات الطقس ولا يتم تخزينها خارج التطبيق أو مشاركتها مع أطراف ثالثة.\n\nالتخزين المحلي: يخزن التطبيق في ذاكرة جهازك (LocalStorage) المدينة المختارة والفئة العمرية للطفل وإعدادات ملف الحرارة والجدول الأسبوعي. تبقى هذه البيانات فقط على جهازك." },
  "footer.privacyS3Title": { fi: "3. Tietojen käyttö", sv: "3. Användning av uppgifter", en: "3. Use of Data", et: "3. Andmete kasutamine", ar: "3. استخدام البيانات" },
  "footer.privacyS3": { fi: "Tietoja käytetään ainoastaan sovelluksen ydintoimintojen tarjoamiseen: pukeutumissuositusten personointiin ja sääpohjaiseen ohjeistukseen.", sv: "Uppgifterna används enbart för appens kärnfunktioner: personliga klädrekommendationer och väderbaserad vägledning.", en: "Data is used solely for the app's core functions: personalizing clothing recommendations and weather-based guidance.", et: "Andmeid kasutatakse ainult rakenduse põhifunktsioonideks: riietussoovituste isikupärastamiseks ja ilmastikupõhiseks juhendamiseks.", ar: "تُستخدم البيانات فقط للوظائف الأساسية للتطبيق: تخصيص توصيات الملابس والإرشادات المستندة إلى الطقس." },
  "footer.privacyS4Title": { fi: "4. Kolmannet osapuolet ja mainonta", sv: "4. Tredje parter och annonsering", en: "4. Third Parties and Advertising", et: "4. Kolmandad osapooled ja reklaam", ar: "4. الأطراف الثالثة والإعلان" },
  "footer.privacyS4": { fi: "Säädata: Sääennuste haetaan OpenWeatherMap-palvelusta. Palvelulle lähetetään vain sijaintikoordinaatit säähaun suorittamiseksi.\n\nMainoslinkit: Sovellus voi sisältää affiliate-linkkejä (esim. Adtraction). Klikkaamalla linkkiä siirryt ulkoiselle sivustolle, jolla on omat tietosuojakäytäntönsä ja joka voi käyttää evästeitä myynnin seuraamiseen.", sv: "Väderdata: Väderprognosen hämtas från OpenWeatherMap. Bara platskoordinater skickas för vädersökningen.\n\nAnnonslänkar: Appen kan innehålla affiliatelänkar (t.ex. Adtraction). Genom att klicka på en länk överförs du till en extern webbplats med egna integritetspolicyer som kan använda cookies för försäljningsspårning.", en: "Weather data: Forecasts are fetched from OpenWeatherMap. Only location coordinates are sent for the weather query.\n\nAd links: The app may contain affiliate links (e.g. Adtraction). Clicking a link takes you to an external site with its own privacy policies that may use cookies for sales tracking.", et: "Ilmaandmed: Ilmaennustus hangitakse OpenWeatherMap teenusest. Teenusele saadetakse ainult asukohakoordinaadid.\n\nReklaamlingid: Rakendus võib sisaldada affiliate-linke (nt Adtraction). Lingile klõpsates suunatakse teid välisele saidile, millel on oma privaatsuspoliitika ja mis võib kasutada küpsiseid müügijälgimiseks.", ar: "بيانات الطقس: يتم جلب التوقعات من OpenWeatherMap. يتم إرسال إحداثيات الموقع فقط لاستعلام الطقس.\n\nروابط إعلانية: قد يحتوي التطبيق على روابط تابعة (مثل Adtraction). بالنقر على الرابط تنتقل إلى موقع خارجي له سياسات خصوصية خاصة وقد يستخدم ملفات تعريف الارتباط لتتبع المبيعات." },
  "footer.privacyS5Title": { fi: "5. Tietojen poistaminen ja hallinta", sv: "5. Radering och hantering av uppgifter", en: "5. Data Deletion and Management", et: "5. Andmete kustutamine ja haldamine", ar: "5. حذف البيانات وإدارتها" },
  "footer.privacyS5": { fi: "Käyttäjä voi poistaa kaikki tallennetut tiedot poistamalla sovelluksen asennuksen tai tyhjentämällä sovelluksen tiedot laitteen asetuksista. Sijaintiluvan voi peruuttaa milloin tahansa laitteen käyttöjärjestelmän asetuksista.", sv: "Användaren kan radera alla sparade uppgifter genom att avinstallera appen eller rensa appdata i enhetens inställningar. Platstillståndet kan återkallas när som helst i enhetens operativsystems inställningar.", en: "Users can delete all stored data by uninstalling the app or clearing app data in device settings. Location permission can be revoked at any time in the device's operating system settings.", et: "Kasutaja saab kõik salvestatud andmed kustutada, eemaldades rakenduse või tühjendades rakenduse andmed seadme seadetes. Asukohaloale saab igal ajal seadme operatsioonisüsteemi seadetes tühistada.", ar: "يمكن للمستخدم حذف جميع البيانات المخزنة عن طريق إلغاء تثبيت التطبيق أو مسح بيانات التطبيق في إعدادات الجهاز. يمكن إلغاء إذن الموقع في أي وقت من إعدادات نظام تشغيل الجهاز." },
  "footer.privacyS6Title": { fi: "6. Yhteydenotto", sv: "6. Kontakt", en: "6. Contact", et: "6. Kontakt", ar: "6. الاتصال" },
  "footer.privacyS6": { fi: "Tietosuojaa koskevat kysymykset:", sv: "Frågor om integritetspolicyn:", en: "Privacy-related questions:", et: "Privaatsusküsimused:", ar: "أسئلة متعلقة بالخصوصية:" },
  "footer.contactIntro": { fi: "Olemme iloisia kuullessamme sinusta! Voit ottaa yhteyttä alla olevilla tavoilla.", sv: "Vi är glada att höra från dig! Du kan kontakta oss på följande sätt.", en: "We'd love to hear from you! You can reach us in the following ways.", et: "Meil on hea meel sinust kuulda! Saad meiega ühendust võtta järgmistel viisidel.", ar: "يسعدنا سماعك! يمكنك التواصل معنا بالطرق التالية." },
  "footer.emailTitle": { fi: "Sähköposti", sv: "E-post", en: "Email", et: "E-post", ar: "البريد الإلكتروني" },
  "footer.partnerTitle": { fi: "Yhteistyö & Mainonta", sv: "Samarbete & Annonsering", en: "Partnership & Advertising", et: "Koostöö ja reklaam", ar: "الشراكة والإعلان" },
  "footer.partnerDesc": { fi: "Kiinnostaako affiliate-yhteistyö tai mainospaikka? Ota yhteyttä sähköpostitse, niin kerromme lisää mahdollisuuksista.", sv: "Intresserad av affiliatesamarbete eller annonsplats? Kontakta oss via e-post så berättar vi mer om möjligheterna.", en: "Interested in affiliate partnerships or ad placements? Contact us by email and we'll share more about the opportunities.", et: "Huvitab affiliate-koostöö või reklaamipind? Võta ühendust e-postiga ja räägime võimalustest lähemalt.", ar: "مهتم بشراكات الانتساب أو مواضع الإعلانات؟ تواصل معنا عبر البريد الإلكتروني وسنشارك المزيد عن الفرص." },

  // Misc
  "misc.windTip": { fi: "💡 Muista tarkistaa tuulenpuuskat ennen ulkoilua!", sv: "💡 Kom ihåg att kontrollera vindbyarna innan utevistelsen!", en: "💡 Remember to check wind gusts before going outside!", et: "💡 Ära unusta enne õue minekut tuulepuhanguid kontrollida!", ar: "💡 تذكر التحقق من هبات الرياح قبل الخروج!" },

  // Clothing items (for weatherData translations)
  "cloth.kerrospukeutuminen": { fi: "Kerrospukeutuminen", sv: "Lagerklädsel", en: "Layering", et: "Kihiline riietus", ar: "ارتداء طبقات" },
  "cloth.kerrospukeutuminen.desc": { fi: "Merinovilla, välikerros ja paksu toppapuku", sv: "Merinoull, mellanskikt och tjock overall", en: "Merino wool, mid layer and thick snow overall", et: "Meriinovill, soojuskiht ja paks talvekombinesoon", ar: "صوف مرينو، طبقة وسطى وبذلة ثلج سميكة" },
  "cloth.toppapuku": { fi: "Toppapuku ja villasukat", sv: "Täckoverall och ullstrumpor", en: "Snow overall and wool socks", et: "Talvekombinesoon ja villasokid", ar: "بذلة ثلج وجوارب صوف" },
  "cloth.toppapuku.desc": { fi: "Lämpö: 0 … –10 °C — paksu toppapuku ja villasukat", sv: "Temp: 0 … –10 °C — tjock täckoverall och ullstrumpor", en: "Temp: 0 … –10 °C — thick snow overall and wool socks", et: "Temp: 0 … –10 °C — paks talvekombinesoon ja villasokid", ar: "الحرارة: 0 … –10 °م — بذلة ثلج سميكة وجوارب صوف" },
  "cloth.välikausivaatteet": { fi: "Välikausivaatteet", sv: "Övergångskläder", en: "Mid-season clothing", et: "Vahehooajariided", ar: "ملابس الموسم المتوسط" },
  "cloth.välikausivaatteet.desc": { fi: "+1 … +12 °C — kuoritakki ja kerroksia", sv: "+1 … +12 °C — skaljacka och lager", en: "+1 … +12 °C — shell jacket and layers", et: "+1 … +12 °C — koorikjope ja kihid", ar: "+1 … +12 °م — جاكيت واقٍ وطبقات" },
  "cloth.teknisetkuorivaatteet": { fi: "Tekniset kuorivaatteet", sv: "Tekniska skalkläder", en: "Technical shell clothing", et: "Tehnilised kooriklõuad", ar: "ملابس واقية تقنية" },
  "cloth.teknisetkuorivaatteet.desc": { fi: "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia", sv: "+1 … +12 °C — tekniska skalkläder och lager", en: "+1 … +12 °C — technical shell clothing and layers", et: "+1 … +12 °C — tehnilised kooriklõuad ja kihid", ar: "+1 … +12 °م — ملابس واقية تقنية وطبقات" },
  "cloth.rattaissalisakerros": { fi: "Rattaissa lisäkerros", sv: "Extra lager i vagnen", en: "Extra layer in stroller", et: "Lisakiht vankris", ar: "طبقة إضافية في العربة" },
  "cloth.rattaissalisakerros.desc": { fi: "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle", sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear", et: "Kui laps istub vankris paigal, kasuta sooja jalamutti või lisa villakiht vahehooajariietuse alla", ar: "إذا كان الطفل جالساً في العربة، استخدم كيس قدم دافئ أو أضف طبقة صوف تحت ملابس الموسم المتوسط" },
  "cloth.tuubihuivi": { fi: "Tuubihuivi", sv: "Tubhalsduk", en: "Neck gaiter", et: "Torukaelasall", ar: "واقي الرقبة" },
  "cloth.tuubihuivi.desc": { fi: "Tuuli yli 5 m/s — tuubihuivi suojaa", sv: "Vind över 5 m/s — tubhalsduk skyddar", en: "Wind over 5 m/s — neck gaiter protects", et: "Tuul üle 5 m/s — torukaelasall kaitseb", ar: "رياح أكثر من 5 م/ث — واقي الرقبة يحمي" },
  "cloth.lippalakki": { fi: "Lippalakki", sv: "Keps", en: "Cap", et: "Nokamüts", ar: "قبعة" },
  "cloth.lippalakki.desc": { fi: "Aurinkoisella säällä suojaksi", sv: "Skydd i soligt väder", en: "Protection in sunny weather", et: "Kaitseks päikesepaistel", ar: "حماية في الطقس المشمس" },
  "cloth.aurinkorasva": { fi: "Aurinkorasva", sv: "Solskyddskräm", en: "Sunscreen", et: "Päikesekaitsekreem", ar: "واقي شمس" },
  "cloth.aurinkorasva.desc": { fi: "Suojaa iho UV-säteilyltä", sv: "Skyddar huden mot UV-strålning", en: "Protects skin from UV radiation", et: "Kaitseb nahka UV-kiirguse eest", ar: "يحمي البشرة من الأشعة فوق البنفسجية" },
  "cloth.vuorettomat": { fi: "Vuorettomat kurahousut", sv: "Ofodrade regnbyxor", en: "Unlined rain trousers", et: "Voodrita vihmapüksid", ar: "بنطلون مطر بدون بطانة" },
  "cloth.vuorettomat.desc": { fi: "Kevyet sadehousut ilman vuorta", sv: "Lätta regnbyxor utan foder", en: "Light rain trousers without lining", et: "Kerged vihmapüksid ilma voodrita", ar: "بنطلون مطر خفيف بدون بطانة" },
  "cloth.kumisaappaat": { fi: "Kumisaappaat", sv: "Gummistövlar", en: "Rubber boots", et: "Kummikud", ar: "أحذية مطاطية" },
  "cloth.kumisaappaat.desc": { fi: "Kumisaappaat ohuilla sukilla", sv: "Gummistövlar med tunna strumpor", en: "Rubber boots with thin socks", et: "Kummikud õhukeste sokkidega", ar: "أحذية مطاطية مع جوارب رقيقة" },
  "cloth.kumisaappaat.wool": { fi: "+ villasukat", sv: "+ yllesockor", en: "+ wool socks", et: "+ villasokid", ar: "+ جوارب صوف" },
  "cloth.kumisaappaat.wool.desc": { fi: "Kumisaappaat ja villasukat suojaavat kylmältä", sv: "Gummistövlar och ullstrumpor skyddar mot kylan", en: "Rubber boots and wool socks protect against cold", et: "Kummikud ja villasokid kaitsevad külma eest", ar: "الأحذية المطاطية وجوارب الصوف تحمي من البرد" },
  "cloth.kurahousut": { fi: "Kurahousut ja kurahanskat", sv: "Regnbyxor och regnvantar", en: "Rain trousers and rain gloves", et: "Vihmapüksid ja vihmakindad", ar: "بنطلون مطر وقفازات مطر" },
  "cloth.kurahousut.desc": { fi: "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!", sv: "Regnchans över 40 % — ta med vattentät utrustning!", en: "Rain probability over 40% — bring waterproof gear!", et: "Vihma tõenäosus üle 40% — veekindlad varustused kaasa!", ar: "احتمال المطر فوق 40% — خذ معدات مقاومة للماء!" },
  "cloth.lippisUv": { fi: "Lippis/Hattu", sv: "Keps/Hatt", en: "Cap/Hat", et: "Nokamüts/Kübar", ar: "قبعة" },
  "cloth.lippisUv.desc": { fi: "Korkea UV — suojaa pää auringolta", sv: "Högt UV — skydda huvudet mot solen", en: "High UV — protect head from the sun", et: "Kõrge UV — kaitse pead päikese eest", ar: "أشعة UV عالية — احمِ الرأس من الشمس" },
  "cloth.aurinkolasit": { fi: "Aurinkolasit", sv: "Solglasögon", en: "Sunglasses", et: "Päikeseprillid", ar: "نظارات شمسية" },
  "cloth.aurinkolasit.desc": { fi: "UV-suoja silmille", sv: "UV-skydd för ögonen", en: "UV protection for eyes", et: "UV-kaitse silmadele", ar: "حماية UV للعينين" },

  // Cold gear
  "cloth.toppahaalari": { fi: "Toppahaalari", sv: "Täckoverall", en: "Snow overall", et: "Talvekombinesoon", ar: "بذلة ثلج" },
  "cloth.toppahaalari.desc": { fi: "Paksu talvihaalari", sv: "Tjock vinteroverall", en: "Thick winter overall", et: "Paks talvekombinesoon", ar: "بذلة شتوية سميكة" },
  "cloth.villakerrastot": { fi: "Villakerrastot", sv: "Ullunderställ", en: "Wool base layers", et: "Villased alusriided", ar: "طبقات صوف أساسية" },
  "cloth.villakerrastot.desc": { fi: "Merinovillaiset aluskerrastot", sv: "Underställ i merinoull", en: "Merino wool base layers", et: "Meriinovillased alusriided", ar: "طبقات أساسية من صوف المرينو" },
  "cloth.villasukat": { fi: "Villasukat", sv: "Ullstrumpor", en: "Wool socks", et: "Villasokid", ar: "جوارب صوف" },
  "cloth.villasukat.desc": { fi: "Paksut villasukat", sv: "Tjocka ullstrumpor", en: "Thick wool socks", et: "Paksud villasokid", ar: "جوارب صوف سميكة" },
  "cloth.talvitöppöset": { fi: "Talvitöppöset", sv: "Vinterskor", en: "Winter booties", et: "Talvejalanõud", ar: "أحذية شتوية للرضع" },
  "cloth.talvitöppöset.desc": { fi: "Lämpimät vauvan kengät", sv: "Varma babyskor", en: "Warm baby shoes", et: "Soojad beebijalatsid", ar: "أحذية رضع دافئة" },
  "cloth.lapaset": { fi: "Lapaset", sv: "Vantar", en: "Mittens", et: "Labakindad", ar: "قفازات" },
  "cloth.lapaset.desc": { fi: "Paksut tumput", sv: "Tjocka tumvantar", en: "Thick mittens", et: "Paksud labakindad", ar: "قفازات سميكة" },
  "cloth.pipo": { fi: "Pipo", sv: "Mössa", en: "Beanie", et: "Müts", ar: "قبعة صوف" },
  "cloth.pipo.desc": { fi: "Villapipo + kypärämyssy", sv: "Ullmössa + hjälmhuva", en: "Wool beanie + balaclava", et: "Villamüts + kiivrimüts", ar: "قبعة صوف + بالاكلافا" },
  "cloth.toppahousut": { fi: "Toppahousut", sv: "Täckbyxor", en: "Snow trousers", et: "Talvepüksid", ar: "بنطلون ثلج" },
  "cloth.toppahousut.desc": { fi: "Talvitoppahousut", sv: "Vintertäckbyxor", en: "Winter snow trousers", et: "Talve soojendusega püksid", ar: "بنطلون ثلج شتوي" },
  "cloth.toppatakki": { fi: "Toppatakki", sv: "Täckjacka", en: "Winter jacket", et: "Talvejope", ar: "جاكيت شتوي" },
  "cloth.toppatakki.desc": { fi: "Paksu talvitakki", sv: "Tjock vinterjacka", en: "Thick winter jacket", et: "Paks talvejope", ar: "جاكيت شتوي سميك" },
  "cloth.villakerrastot2.desc": { fi: "Aluskerrastot villan päälle", sv: "Underställ ovanpå ullen", en: "Base layers over wool", et: "Alusriided villa peale", ar: "طبقات أساسية فوق الصوف" },
  "cloth.talvisaappaat": { fi: "Talvisaappaat", sv: "Vinterstövlar", en: "Winter boots", et: "Talvesaapad", ar: "أحذية شتوية" },
  "cloth.talvisaappaat.desc": { fi: "Lämpimät vedenpitävät saappaat", sv: "Varma vattentäta stövlar", en: "Warm waterproof boots", et: "Soojad veekindlad saapad", ar: "أحذية شتوية دافئة مقاومة للماء" },
  "cloth.hanskat": { fi: "Hanskat", sv: "Handskar", en: "Gloves", et: "Kindad", ar: "قفازات" },
  "cloth.hanskat.desc.taapero": { fi: "Hanskat tai rukkaset", sv: "Handskar eller vantar", en: "Gloves or mittens", et: "Kindad või labakindad", ar: "قفازات أو قفازات بدون أصابع" },
  "cloth.kauluri": { fi: "Kauluri", sv: "Halskrage", en: "Neck warmer", et: "Kaelasall", ar: "واقي الرقبة" },
  "cloth.kauluri.desc.taapero": { fi: "Tuubihuivi tai kypärämyssy", sv: "Tubhalsduk eller hjälmhuva", en: "Neck gaiter or balaclava", et: "Torukaelasall või kiivrimüts", ar: "واقي رقبة أو بالاكلافا" },
  "cloth.pipo2.desc": { fi: "Lämmin villapipo", sv: "Varm ullmössa", en: "Warm wool beanie", et: "Soe villamüts", ar: "قبعة صوف دافئة" },
  "cloth.hanskat.desc.leikki": { fi: "Sormikkaat tai lapaset", sv: "Fingervantar eller vantar", en: "Finger gloves or mittens", et: "Sõrmkindad või labakindad", ar: "قفازات أصابع أو قفازات" },
  "cloth.pipo3.desc": { fi: "Lämpimä pipo", sv: "Varm mössa", en: "Warm beanie", et: "Soe müts", ar: "قبعة دافئة" },
  "cloth.kauluri2.desc": { fi: "Tuubihuivi", sv: "Tubhalsduk", en: "Neck gaiter", et: "Torukaelasall", ar: "واقي الرقبة" },
  "cloth.välikerrastot": { fi: "Välikerrastot", sv: "Mellanunderställ", en: "Mid base layers", et: "Soojuskiht", ar: "طبقة وسطى" },
  "cloth.välikerrastot.desc": { fi: "Kerrostettavat alusvaatteet", sv: "Lagerbara underkläder", en: "Layerable underwear", et: "Kihitavad alusriided", ar: "ملابس داخلية متعددة الطبقات" },
  "cloth.talvikengät": { fi: "Talvikengät", sv: "Vinterskor", en: "Winter shoes", et: "Talvejalanõud", ar: "أحذية شتوية" },
  "cloth.talvikengät.desc": { fi: "Lämpimät kengät", sv: "Varma skor", en: "Warm shoes", et: "Soojad jalanõud", ar: "أحذية دافئة" },
  "cloth.kauluri3.desc": { fi: "Kauluri, huivi tai kypärämyssy", sv: "Halskrage, halsduk eller hjälmhuva", en: "Neck warmer, scarf or balaclava", et: "Kaelasall, sall või kiivrimüts", ar: "واقي رقبة، وشاح أو بالاكلافا" },

  // Mild rain gear
  "cloth.välikausihaalari": { fi: "Välikausihaalari", sv: "Skaloverall", en: "Mid-season overall", et: "Vahehooaja kombinesoon", ar: "بذلة الموسم المتوسط" },
  "cloth.välikausihaalari.desc": { fi: "Kevyt haalari", sv: "Lätt overall", en: "Light overall", et: "Kerge kombinesoon", ar: "بذلة خفيفة" },
  "cloth.sadehaalari": { fi: "Sadehaalari", sv: "Regnoverall", en: "Rain overall", et: "Vihmakombinesoon", ar: "بذلة مطر" },
  "cloth.sadehaalari.desc": { fi: "Vedenpitävä haalari päälle", sv: "Vattentät overall ovanpå", en: "Waterproof overall on top", et: "Veekindel kombinesoon peale", ar: "بذلة مقاومة للماء فوق الملابس" },
  "cloth.kumisaappaat2.desc": { fi: "Pienet kumpparet", sv: "Små gummistövlar", en: "Small rubber boots", et: "Väikesed kummikud", ar: "أحذية مطاطية صغيرة" },
  "cloth.ohutpipo": { fi: "Ohut pipo", sv: "Tunn mössa", en: "Thin beanie", et: "Õhuke müts", ar: "قبعة رقيقة" },
  "cloth.ohutpipo.desc": { fi: "Puuvillapipo", sv: "Bomullsmössa", en: "Cotton beanie", et: "Puuvillamüts", ar: "قبعة قطنية" },
  "cloth.välikausihousut": { fi: "Välikausihousut", sv: "Övergångsbyxor", en: "Mid-season trousers", et: "Vahehooaja püksid", ar: "بنطلون الموسم المتوسط" },
  "cloth.välikausihousut.desc": { fi: "Joustavat välikausihousut", sv: "Stretchiga övergångsbyxor", en: "Flexible mid-season trousers", et: "Venivad vahehooaja püksid", ar: "بنطلون موسم متوسط مرن" },
  "cloth.kuoritakki": { fi: "Kuoritakki", sv: "Skaljacka", en: "Shell jacket", et: "Koorikjope", ar: "جاكيت واقٍ" },
  "cloth.kuoritakki.desc": { fi: "Tuulenpitävä kuoritakki", sv: "Vindtät skaljacka", en: "Windproof shell jacket", et: "Tuulekindel koorikjope", ar: "جاكيت واقٍ من الرياح" },
  "cloth.välikausikengät": { fi: "Välikausikengät", sv: "Övergångsskor", en: "Mid-season shoes", et: "Vahehooaja jalanõud", ar: "أحذية الموسم المتوسط" },
  "cloth.välikausikengät.desc": { fi: "Vettähylkivät välikausikengät", sv: "Vattenavvisande övergångsskor", en: "Water-repellent mid-season shoes", et: "Vett tõrjuvad vahehooaja jalanõud", ar: "أحذية الموسم المتوسط مقاومة للماء" },
  "cloth.välikerrasto": { fi: "Välikerrasto", sv: "Mellanskikt", en: "Mid layer", et: "Soojuskiht", ar: "طبقة وسطى" },
  "cloth.välikerrasto.desc": { fi: "Fleece tai villainen", sv: "Fleece eller ull", en: "Fleece or wool", et: "Fliis või vill", ar: "فليس أو صوف" },

  // Warm spring
  "cloth.body": { fi: "Body", sv: "Body", en: "Bodysuit", et: "Bodüsuits", ar: "بذلة جسم" },
  "cloth.body.desc": { fi: "Ohut puuvillabody", sv: "Tunn bomullsbody", en: "Thin cotton bodysuit", et: "Õhuke puuvillane bodüsuits", ar: "بذلة جسم قطنية رقيقة" },
  "cloth.ohuthaalari": { fi: "Ohut haalari", sv: "Tunn overall", en: "Thin overall", et: "Õhuke kombinesoon", ar: "بذلة رقيقة" },
  "cloth.ohuthaalari.desc": { fi: "Kevyt ulkohaalari", sv: "Lätt utomhusoverall", en: "Light outdoor overall", et: "Kerge õuekombinesoon", ar: "بذلة خارجية خفيفة" },
  "cloth.collegehousut": { fi: "Collegehousut", sv: "Mjukisbyxor", en: "Joggers", et: "Dressipüksid", ar: "بنطلون رياضي" },
  "cloth.collegehousut.desc": { fi: "Joustavat collegehousut", sv: "Stretchiga mjukisbyxor", en: "Flexible joggers", et: "Venivad dressipüksid", ar: "بنطلون رياضي مرن" },
  "cloth.pitkähihainen": { fi: "Pitkähihainen paita", sv: "Långärmad tröja", en: "Long-sleeve shirt", et: "Pikkade varrukatega särk", ar: "قميص بأكمام طويلة" },
  "cloth.pitkähihainen.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", en: "Light long-sleeve", et: "Kerge pikkade varrukatega", ar: "أكمام طويلة خفيفة" },
  "cloth.kevyttakki": { fi: "Kevyt takki", sv: "Lätt jacka", en: "Light jacket", et: "Kerge jope", ar: "جاكيت خفيف" },
  "cloth.kevyttakki.desc": { fi: "Kevyt takki tai liivi", sv: "Lätt jacka eller väst", en: "Light jacket or vest", et: "Kerge jope või vest", ar: "جاكيت خفيف أو صديري" },
  "cloth.lenkkarit": { fi: "Lenkkarit", sv: "Sneakers", en: "Sneakers", et: "Tossud", ar: "أحذية رياضية" },
  "cloth.lenkkarit.desc": { fi: "Kevyet kengät", sv: "Lätta skor", en: "Light shoes", et: "Kerged jalanõud", ar: "أحذية خفيفة" },
  "cloth.farkut": { fi: "Farkut", sv: "Jeans", en: "Jeans", et: "Teksapüksid", ar: "جينز" },
  "cloth.farkut.desc": { fi: "Farkut tai collegehousut", sv: "Jeans eller mjukisbyxor", en: "Jeans or joggers", et: "Teksapüksid või dressipüksid", ar: "جينز أو بنطلون رياضي" },
  "cloth.collegehousut2.desc": { fi: "Collegehousut tai farkut", sv: "Mjukisbyxor eller jeans", en: "Joggers or jeans", et: "Dressipüksid või teksapüksid", ar: "بنطلون رياضي أو جينز" },
  "cloth.pitkähihainen2.desc": { fi: "Kevyt pitkähihainen", sv: "Lätt långärmad", en: "Light long-sleeve", et: "Kerge pikkade varrukatega", ar: "أكمام طويلة خفيفة" },

  // Warm gear
  "cloth.aurinkohattu": { fi: "Aurinkohattu", sv: "Solhatt", en: "Sun hat", et: "Päikesekübar", ar: "قبعة شمسية" },
  "cloth.aurinkohattu.desc": { fi: "Leveälierinen hattu", sv: "Bredbrättad hatt", en: "Wide-brimmed hat", et: "Laia äärega kübar", ar: "قبعة عريضة الحافة" },
  "cloth.tpaita": { fi: "T-paita", sv: "T-shirt", en: "T-shirt", et: "T-särk", ar: "تي شيرت" },
  "cloth.tpaita.desc": { fi: "Kevyt paita", sv: "Lätt tröja", en: "Light shirt", et: "Kerge särk", ar: "قميص خفيف" },
  "cloth.shortsit": { fi: "Shortsit", sv: "Shorts", en: "Shorts", et: "Lühikesed püksid", ar: "شورت" },
  "cloth.shortsit.desc": { fi: "Kevyet shortsit", sv: "Lätta shorts", en: "Light shorts", et: "Kerged lühikesed püksid", ar: "شورت خفيف" },
  "cloth.sandaalit": { fi: "Sandaalit", sv: "Sandaler", en: "Sandals", et: "Sandaalid", ar: "صنادل" },
  "cloth.sandaalit.desc": { fi: "Avoimet kengät", sv: "Öppna skor", en: "Open shoes", et: "Lahtised jalanõud", ar: "أحذية مفتوحة" },
  "cloth.aurinkohattu2.desc": { fi: "Lippalakki tai hattu", sv: "Keps eller hatt", en: "Cap or hat", et: "Nokamüts või kübar", ar: "قبعة" },
  "cloth.shortsit2.desc": { fi: "Shortsit tai hame", sv: "Shorts eller kjol", en: "Shorts or skirt", et: "Lühikesed püksid või seelik", ar: "شورت أو تنورة" },
  "cloth.lippalakki2.desc": { fi: "Aurinkosuoja", sv: "Solskydd", en: "Sun protection", et: "Päikesekaitse", ar: "حماية من الشمس" },
  "cloth.huppari": { fi: "Huppari", sv: "Hoodie", en: "Hoodie", et: "Kapuutsiga dressipluus", ar: "هودي" },
  "cloth.huppari.desc": { fi: "Fleece tai huppari", sv: "Fleece eller hoodie", en: "Fleece or hoodie", et: "Fliis või kapuutsiga dressipluus", ar: "فليس أو هودي" },
  "cloth.välikausikengät2.desc": { fi: "Vettähylkivät kengät", sv: "Vattenavvisande skor", en: "Water-repellent shoes", et: "Vett tõrjuvad jalanõud", ar: "أحذية مقاومة للماء" },

  // Dual recommendation
  "dual.morning": { fi: "Aamun varustus", sv: "Morgonens utrustning", en: "Morning outfit", et: "Hommikune varustus", ar: "ملابس الصباح" },
  "dual.afternoon": { fi: "Iltapäivän varustus", sv: "Eftermiddagens utrustning", en: "Afternoon outfit", et: "Pärastlõunane varustus", ar: "ملابس بعد الظهر" },
  "dual.windWarning": { fi: "Kova tuuli ({speed} m/s) lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros.", sv: "Stark vind ({speed} m/s) ökar kylkänslan — välj vindtätt skalplagg.", en: "Strong wind ({speed} m/s) increases wind chill — choose a windproof shell layer.", et: "Tugev tuul ({speed} m/s) suurendab külmatunnet — vali tuulekindel kiht.", ar: "رياح قوية ({speed} م/ث) تزيد الشعور بالبرد — اختر طبقة مقاومة للرياح." },
  "dual.mudWarning": { fi: "Vaikka nyt on poutaa, maa on vielä märkä yöllisen sateen jäljiltä.", sv: "Även om det är uppehåll nu är marken fortfarande blöt efter nattens regn.", en: "Even though it's dry now, the ground is still wet from overnight rain.", et: "Kuigi praegu on kuiv, on maapind veel märg öise vihma järel.", ar: "رغم أن الجو جاف الآن، الأرض لا تزال مبللة من مطر الليل." },
  "dual.gapInfo": { fi: "Lämpötila muuttuu merkittävästi päivän aikana ({morning}°C → {afternoon}°C). Pakkaa iltapäivän varusteet reppuun!", sv: "Temperaturen förändras betydligt under dagen ({morning}°C → {afternoon}°C). Packa eftermiddagens kläder i ryggsäcken!", en: "Temperature changes significantly during the day ({morning}°C → {afternoon}°C). Pack afternoon outfit in the backpack!", et: "Temperatuur muutub oluliselt päeva jooksul ({morning}°C → {afternoon}°C). Paki pärastlõuna varustus kotti!", ar: "الحرارة تتغير بشكل ملحوظ خلال اليوم ({morning}°م → {afternoon}°م). ضع ملابس بعد الظهر في الحقيبة!" },

  // PWA install banner
  "pwa.title": { fi: "Asenna Pukuri puhelimeesi", sv: "Installera Pukuri på din telefon", en: "Install Pukuri on your phone", et: "Paigalda Pukuri oma telefoni", ar: "ثبّت Pukuri على هاتفك" },
  "pwa.instructionIos": { fi: "Paina selaimen \"Jaa\"-painiketta (📤) ja valitse \"Lisää kotivalikkoon\".", sv: "Tryck på webbläsarens \"Dela\"-knapp (📤) och välj \"Lägg till på hemskärmen\".", en: "Tap the browser's \"Share\" button (📤) and select \"Add to Home Screen\".", et: "Vajuta brauseri \"Jaga\" nuppu (📤) ja vali \"Lisa avakuvale\".", ar: "اضغط على زر \"مشاركة\" في المتصفح (📤) واختر \"إضافة إلى الشاشة الرئيسية\"." },
  "pwa.instructionAndroid": { fi: "Paina selaimen valikkoa (⋮) ja valitse \"Lisää aloitusnäytölle\".", sv: "Tryck på webbläsarens meny (⋮) och välj \"Lägg till på startskärmen\".", en: "Tap the browser menu (⋮) and select \"Add to Home Screen\".", et: "Vajuta brauseri menüüd (⋮) ja vali \"Lisa avakuvale\".", ar: "اضغط على قائمة المتصفح (⋮) واختر \"إضافة إلى الشاشة الرئيسية\"." },
  "pwa.close": { fi: "Sulje", sv: "Stäng", en: "Close", et: "Sulge", ar: "إغلاق" },

  // Share button
  "share.button": { fi: "Jaa puolison kanssa", sv: "Dela med partner", en: "Share with partner", et: "Jaga partneriga", ar: "شارك مع الشريك" },
  "share.messageIntro": { fi: "Pukuri-muistutus!", sv: "Pukuri-påminnelse!", en: "Pukuri reminder!", et: "Pukuri meeldetuletus!", ar: "تذكير من Pukuri!" },
  "share.rememberMud": { fi: "Muista kuravarusteet!", sv: "Kom ihåg smutskläderna!", en: "Remember mud gear!", et: "Ära unusta vihmariideid!", ar: "تذكر ملابس الوحل!" },
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

  // Set RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

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

// Clothing item translation maps (Finnish → { sv, en, et, ar })
const clothingNameMap: Record<string, { sv: string; en: string; et: string; ar: string }> = {
  "Kerrospukeutuminen": { sv: "Lagerklädsel", en: "Layering", et: "Kihiline riietus", ar: "ارتداء طبقات" },
  "Toppapuku ja villasukat": { sv: "Täckoverall och ullstrumpor", en: "Snow overall and wool socks", et: "Talvekombinesoon ja villasokid", ar: "بذلة ثلج وجوارب صوف" },
  "Välikausivaatteet": { sv: "Övergångskläder", en: "Mid-season clothing", et: "Vahehooajariided", ar: "ملابس الموسم المتوسط" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter", et: "Torukaelasall", ar: "واقي الرقبة" },
  "Lippalakki": { sv: "Keps", en: "Cap", et: "Nokamüts", ar: "قبعة" },
  "Aurinkorasva": { sv: "Solskyddskräm", en: "Sunscreen", et: "Päikesekaitsekreem", ar: "واقي شمس" },
  "Vuorettomat kurahousut": { sv: "Ofodrade regnbyxor", en: "Unlined rain trousers", et: "Voodrita vihmapüksid", ar: "بنطلون مطر بدون بطانة" },
  "Kumisaappaat": { sv: "Gummistövlar", en: "Rubber boots", et: "Kummikud", ar: "أحذية مطاطية" },
  "Kumisaappaat + villasukat": { sv: "Gummistövlar + ullstrumpor", en: "Rubber boots + wool socks", et: "Kummikud + villasokid", ar: "أحذية مطاطية + جوارب صوف" },
  "Kurahousut ja kurahanskat": { sv: "Regnbyxor och regnvantar", en: "Rain trousers and rain gloves", et: "Vihmapüksid ja vihmakindad", ar: "بنطلون مطر وقفازات مطر" },
  "Kurahousut": { sv: "Regnbyxor", en: "Rain trousers", et: "Vihmapüksid", ar: "بنطلون مطر" },
  "Lippis/Hattu": { sv: "Keps/Hatt", en: "Cap/Hat", et: "Nokamüts/Kübar", ar: "قبعة" },
  "Aurinkolasit": { sv: "Solglasögon", en: "Sunglasses", et: "Päikeseprillid", ar: "نظارات شمسية" },
  "Toppahaalari": { sv: "Täckoverall", en: "Snow overall", et: "Talvekombinesoon", ar: "بذلة ثلج" },
  "Villakerrastot": { sv: "Ullunderställ", en: "Wool base layers", et: "Villased alusriided", ar: "طبقات صوف أساسية" },
  "Villasukat": { sv: "Ullstrumpor", en: "Wool socks", et: "Villasokid", ar: "جوارب صوف" },
  "Talvitöppöset": { sv: "Vinterskor", en: "Winter booties", et: "Talvejalanõud", ar: "أحذية شتوية للرضع" },
  "Lapaset": { sv: "Vantar", en: "Mittens", et: "Labakindad", ar: "قفازات" },
  "Pipo": { sv: "Mössa", en: "Beanie", et: "Müts", ar: "قبعة صوف" },
  "Toppahousut": { sv: "Täckbyxor", en: "Snow trousers", et: "Talvepüksid", ar: "بنطلون ثلج" },
  "Toppatakki": { sv: "Täckjacka", en: "Winter jacket", et: "Talvejope", ar: "جاكيت شتوي" },
  "Talvisaappaat": { sv: "Vinterstövlar", en: "Winter boots", et: "Talvesaapad", ar: "أحذية شتوية" },
  "Hanskat": { sv: "Handskar", en: "Gloves", et: "Kindad", ar: "قفازات" },
  "Kauluri": { sv: "Halskrage", en: "Neck warmer", et: "Kaelasall", ar: "واقي الرقبة" },
  "Välikerrastot": { sv: "Mellanunderställ", en: "Mid base layers", et: "Soojuskiht", ar: "طبقة وسطى" },
  "Talvikengät": { sv: "Vinterskor", en: "Winter shoes", et: "Talvejalanõud", ar: "أحذية شتوية" },
  "Välikausihaalari": { sv: "Skaloverall", en: "Mid-season overall", et: "Vahehooaja kombinesoon", ar: "بذلة الموسم المتوسط" },
  "Sadehaalari": { sv: "Regnoverall", en: "Rain overall", et: "Vihmakombinesoon", ar: "بذلة مطر" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie", et: "Õhuke müts", ar: "قبعة رقيقة" },
  "Välikausihousut": { sv: "Övergångsbyxor", en: "Mid-season trousers", et: "Vahehooaja püksid", ar: "بنطلون الموسم المتوسط" },
  "Kuoritakki": { sv: "Skaljacka", en: "Shell jacket", et: "Koorikjope", ar: "جاكيت واقٍ" },
  "Välikausikengät": { sv: "Övergångsskor", en: "Mid-season shoes", et: "Vahehooaja jalanõud", ar: "أحذية الموسم المتوسط" },
  "Välikerrasto": { sv: "Mellanskikt", en: "Mid layer", et: "Soojuskiht", ar: "طبقة وسطى" },
  "Body": { sv: "Body", en: "Bodysuit", et: "Bodüsuits", ar: "بذلة جسم" },
  "Ohut haalari": { sv: "Tunn overall", en: "Thin overall", et: "Õhuke kombinesoon", ar: "بذلة رقيقة" },
  "Collegehousut": { sv: "Mjukisbyxor", en: "Joggers", et: "Dressipüksid", ar: "بنطلون رياضي" },
  "Pitkähihainen paita": { sv: "Långärmad tröja", en: "Long-sleeve shirt", et: "Pikkade varrukatega särk", ar: "قميص بأكمام طويلة" },
  "Kevyt takki": { sv: "Lätt jacka", en: "Light jacket", et: "Kerge jope", ar: "جاكيت خفيف" },
  "Lenkkarit": { sv: "Sneakers", en: "Sneakers", et: "Tossud", ar: "أحذية رياضية" },
  "Farkut": { sv: "Jeans", en: "Jeans", et: "Teksapüksid", ar: "جينز" },
  "Aurinkohattu": { sv: "Solhatt", en: "Sun hat", et: "Päikesekübar", ar: "قبعة شمسية" },
  "T-paita": { sv: "T-shirt", en: "T-shirt", et: "T-särk", ar: "تي شيرت" },
  "Shortsit": { sv: "Shorts", en: "Shorts", et: "Lühikesed püksid", ar: "شورت" },
  "Kevyet kengät": { sv: "Lätta skor", en: "Lightweight shoes", et: "Kerged jalanõud", ar: "أحذية خفيفة" },
  "Huppari": { sv: "Hoodie", en: "Hoodie", et: "Kapuutsiga dressipluus", ar: "هودي" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket", et: "Veekindel koorikjope", ar: "جاكيت واقٍ مقاوم للماء" },
  "Vedenpitävät ulkoiluhousut": { sv: "Vattentäta utomhusbyxor", en: "Waterproof outdoor trousers", et: "Veekindlad õuepüksid", ar: "بنطلون خارجي مقاوم للماء" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes", et: "Vett tõrjuvad jalanõud", ar: "أحذية مقاومة للماء" },
  "Vuorellinen sadehaalari": { sv: "Fodrad regnoverall", en: "Lined rain overall", et: "Vooderdatud vihmakombinesoon", ar: "بذلة مطر مبطنة" },
  "Kurahanskat": { sv: "Regnvantar", en: "Rain gloves", et: "Vihmakindad", ar: "قفازات مطر" },
  "Ohuet kuravarusteet": { sv: "Tunna regnkläder", en: "Thin rain gear", et: "Õhukesed vihmariided", ar: "معدات مطر رقيقة" },
  "Sadehaalari tai kurahousut & sadetakki": { sv: "Regnoverall eller regnbyxor & regnjacka", en: "Rain overall or rain trousers & rain jacket", et: "Vihmakombinesoon või vihmapüksid ja vihmajope", ar: "بذلة مطر أو بنطلون مطر وجاكيت مطر" },
  "Tuulenpitävä kuorikerros": { sv: "Vindtätt skallager", en: "Windproof shell layer", et: "Tuulekindel koorikjope", ar: "طبقة واقية من الرياح" },
  "Lämpöpussi / lisäkerros": { sv: "Åkpåse / extra lager", en: "Footmuff / extra layer", et: "Jalamutt / lisakiht", ar: "كيس قدم / طبقة إضافية" },
  "Tekniset kuorivaatteet": { sv: "Tekniska skalkläder", en: "Technical shell clothing", et: "Tehnilised kooriklõuad", ar: "ملابس واقية تقنية" },
  "Rattaissa lisäkerros": { sv: "Extra lager i vagnen", en: "Extra layer in stroller", et: "Lisakiht vankris", ar: "طبقة إضافية في العربة" },
  "Puuvillabody": { sv: "Bomullsbody", en: "Cotton bodysuit", et: "Puuvillane bodüsuits", ar: "بذلة جسم قطنية" },
  "Puuvillahousut": { sv: "Bomullsbyxor", en: "Cotton trousers", et: "Puuvillapüksid", ar: "بنطلون قطني" },
  "Kypärämyssy": { sv: "Hjälmhuva", en: "Balaclava cap", et: "Kiivrimüts", ar: "قبعة بالاكلافا" },
  "Ohuet sukat": { sv: "Tunna strumpor", en: "Thin socks", et: "Õhukesed sokid", ar: "جوارب رقيقة" },
  "Neuletakki": { sv: "Stickad kofta", en: "Knit cardigan", et: "Kootud kampsun", ar: "كارديجان محبوك" },
  "Ohuet housut": { sv: "Tunna byxor", en: "Thin trousers", et: "Õhukesed püksid", ar: "بنطلون رقيق" },
  "Kevyet housut": { sv: "Lätta byxor", en: "Light trousers", et: "Kerged püksid", ar: "بنطلون خفيف" },
  "Sukat": { sv: "Strumpor", en: "Socks", et: "Sokid", ar: "جوارب" },
  "Huomio": { sv: "OBS", en: "Note", et: "Tähelepanu", ar: "ملاحظة" },
  "Ohut kuorihaalari": { sv: "Tunn skaloverall", en: "Thin shell overall", et: "Õhuke koorikkombinesoon", ar: "بذلة واقية رقيقة" },
  "Sadeasu": { sv: "Regnställ", en: "Rain suit", et: "Vihmakomplekt", ar: "بدلة مطر" },
  "Sadehattu": { sv: "Regnhatt", en: "Rain hat", et: "Vihmakübar", ar: "قبعة مطر" },
  "Tekniset ulkoiluhousut": { sv: "Tekniska utomhusbyxor", en: "Technical outdoor trousers", et: "Tehnilised õuepüksid", ar: "بنطلون خارجي تقني" },
  "Vedenpitävät kengät": { sv: "Vattentäta skor", en: "Waterproof shoes", et: "Veekindlad jalanõud", ar: "أحذية مقاومة للماء" },
  "Pehmeät tossut": { sv: "Mjuka tossor", en: "Soft booties", et: "Pehmed tossud", ar: "أحذية ناعمة" },
  "Lämmin välikerros": { sv: "Varmt mellanskikt", en: "Warm mid layer", et: "Soe soojuskiht", ar: "طبقة وسطى دافئة" },
  "Fleece": { sv: "Fleece", en: "Fleece", et: "Fliis", ar: "فليس" },
  "Villapaita": { sv: "Ulltröja", en: "Wool sweater", et: "Villane kampsun", ar: "سترة صوف" },
  "Fleecetakki": { sv: "Fleecejacka", en: "Fleece jacket", et: "Fliiskjope", ar: "جاكيت فليس" },
};

const clothingDescMap: Record<string, { sv: string; en: string; et: string; ar: string }> = {
  "Merinovilla, välikerros ja paksu toppapuku": { sv: "Merinoull, mellanskikt och tjock overall", en: "Merino wool, mid layer and thick snow overall", et: "Meriinovill, soojuskiht ja paks talvekombinesoon", ar: "صوف مرينو، طبقة وسطى وبذلة ثلج سميكة" },
  "Lämpö: 0 … –1 °C — paksu toppapuku ja villasukat": { sv: "Temp: 0 … –1 °C — tjock täckoverall och ullstrumpor", en: "Temp: 0 … –1 °C — thick snow overall and wool socks", et: "Temp: 0 … –1 °C — paks talvekombinesoon ja villasokid", ar: "الحرارة: 0 … –1 °م — بذلة ثلج سميكة وجوارب صوف" },
  "+1 … +12 °C — kuoritakki ja kerroksia": { sv: "+1 … +12 °C — skaljacka och lager", en: "+1 … +12 °C — shell jacket and layers", et: "+1 … +12 °C — koorikjope ja kihid", ar: "+1 … +12 °م — جاكيت واقٍ وطبقات" },
  "+1 … +12 °C — tekniset kuorivaatteet ja kerroksia": { sv: "+1 … +12 °C — tekniska skalkläder och lager", en: "+1 … +12 °C — technical shell clothing and layers", et: "+1 … +12 °C — tehnilised kooriklõuad ja kihid", ar: "+1 … +12 °م — ملابس واقية تقنية وطبقات" },
  "Jos lapsi on paikoillaan rattaissa, käytä lämmintä makuupussia tai lisää villakerros välikausiasun alle": { sv: "Om barnet sitter stilla i vagnen, använd en varm åkpåse eller lägg till ett ullskikt under skalkläder", en: "If the child is stationary in a stroller, use a warm footmuff or add a wool layer under mid-season gear", et: "Kui laps istub vankris paigal, kasuta sooja jalamutti või lisa villakiht vahehooajariietuse alla", ar: "إذا كان الطفل جالساً في العربة، استخدم كيس قدم دافئ أو أضف طبقة صوف تحت ملابس الموسم المتوسط" },
  "Tuuli yli 5 m/s — tuubihuivi suojaa": { sv: "Vind över 5 m/s — tubhalsduk skyddar", en: "Wind over 5 m/s — neck gaiter protects", et: "Tuul üle 5 m/s — torukaelasall kaitseb", ar: "رياح أكثر من 5 م/ث — واقي الرقبة يحمي" },
  "Aurinkoisella säällä suojaksi": { sv: "Skydd i soligt väder", en: "Protection in sunny weather", et: "Kaitseks päikesepaistel", ar: "حماية في الطقس المشمس" },
  "Suojaa iho UV-säteilyltä": { sv: "Skyddar huden mot UV-strålning", en: "Protects skin from UV radiation", et: "Kaitseb nahka UV-kiirguse eest", ar: "يحمي البشرة من الأشعة فوق البنفسجية" },
  "Paksu talvihaalari": { sv: "Tjock vinteroverall", en: "Thick winter overall", et: "Paks talvekombinesoon", ar: "بذلة شتوية سميكة" },
  "Merinovillaiset aluskerrastot": { sv: "Underställ i merinoull", en: "Merino wool base layers", et: "Meriinovillased alusriided", ar: "طبقات أساسية من صوف المرينو" },
  "Paksut villasukat": { sv: "Tjocka ullstrumpor", en: "Thick wool socks", et: "Paksud villasokid", ar: "جوارب صوف سميكة" },
  "Lämpimät vauvan kengät": { sv: "Varma babyskor", en: "Warm baby shoes", et: "Soojad beebijalatsid", ar: "أحذية رضع دافئة" },
  "Paksut tumput": { sv: "Tjocka tumvantar", en: "Thick mittens", et: "Paksud labakindad", ar: "قفازات سميكة" },
  "Villapipo + kypärämyssy": { sv: "Ullmössa + hjälmhuva", en: "Wool beanie + balaclava", et: "Villamüts + kiivrimüts", ar: "قبعة صوف + بالاكلافا" },
  "Talvitoppahousut": { sv: "Vintertäckbyxor", en: "Winter snow trousers", et: "Talve soojendusega püksid", ar: "بنطلون ثلج شتوي" },
  "Paksu talvitakki": { sv: "Tjock vinterjacka", en: "Thick winter jacket", et: "Paks talvejope", ar: "جاكيت شتوي سميك" },
  "Aluskerrastot villan päälle": { sv: "Underställ ovanpå ullen", en: "Base layers over wool", et: "Alusriided villa peale", ar: "طبقات أساسية فوق الصوف" },
  "Lämpimät vedenpitävät saappaat": { sv: "Varma vattentäta stövlar", en: "Warm waterproof boots", et: "Soojad veekindlad saapad", ar: "أحذية شتوية دافئة مقاومة للماء" },
  "Hanskat tai rukkaset": { sv: "Handskar eller vantar", en: "Gloves or mittens", et: "Kindad või labakindad", ar: "قفازات أو قفازات بدون أصابع" },
  "Tuubihuivi tai kypärämyssy": { sv: "Tubhalsduk eller hjälmhuva", en: "Neck gaiter or balaclava", et: "Torukaelasall või kiivrimüts", ar: "واقي رقبة أو بالاكلافا" },
  "Lämmin villapipo": { sv: "Varm ullmössa", en: "Warm wool beanie", et: "Soe villamüts", ar: "قبعة صوف دافئة" },
  "Talvihousut": { sv: "Vinterbyxor", en: "Winter trousers", et: "Talvepüksid", ar: "بنطلون شتوي" },
  "Talvitakki": { sv: "Vinterjacka", en: "Winter jacket", et: "Talvejope", ar: "جاكيت شتوي" },
  "Aluskerrastot": { sv: "Underställ", en: "Base layers", et: "Alusriided", ar: "طبقات أساسية" },
  "Lämpimät saappaat": { sv: "Varma stövlar", en: "Warm boots", et: "Soojad saapad", ar: "أحذية دافئة" },
  "Sormikkaat tai lapaset": { sv: "Fingervantar eller vantar", en: "Finger gloves or mittens", et: "Sõrmkindad või labakindad", ar: "قفازات أصابع أو قفازات" },
  "Lämpimä pipo": { sv: "Varm mössa", en: "Warm beanie", et: "Soe müts", ar: "قبعة دافئة" },
  "Tuubihuivi": { sv: "Tubhalsduk", en: "Neck gaiter", et: "Torukaelasall", ar: "واقي الرقبة" },
  "Kerrostettavat alusvaatteet": { sv: "Lagerbara underkläder", en: "Layerable underwear", et: "Kihitavad alusriided", ar: "ملابس داخلية متعددة الطبقات" },
  "Lämpimät kengät": { sv: "Varma skor", en: "Warm shoes", et: "Soojad jalanõud", ar: "أحذية دافئة" },
  "Pipo": { sv: "Mössa", en: "Beanie", et: "Müts", ar: "قبعة صوف" },
  "Kauluri, huivi tai kypärämyssy": { sv: "Halskrage, halsduk eller hjälmhuva", en: "Neck warmer, scarf or balaclava", et: "Kaelasall, sall või kiivrimüts", ar: "واقي رقبة، وشاح أو بالاكلافا" },
  "Kevyt haalari": { sv: "Lätt overall", en: "Light overall", et: "Kerge kombinesoon", ar: "بذلة خفيفة" },
  "Vedenpitävä haalari päälle": { sv: "Vattentät overall ovanpå", en: "Waterproof overall on top", et: "Veekindel kombinesoon peale", ar: "بذلة مقاومة للماء فوق الملابس" },
  "Pienet kumpparet": { sv: "Små gummistövlar", en: "Small rubber boots", et: "Väikesed kummikud", ar: "أحذية مطاطية صغيرة" },
  "Puuvillapipo": { sv: "Bomullsmössa", en: "Cotton beanie", et: "Puuvillamüts", ar: "قبعة قطنية" },
  "Joustavat välikausihousut": { sv: "Stretchiga övergångsbyxor", en: "Flexible mid-season trousers", et: "Venivad vahehooaja püksid", ar: "بنطلون موسم متوسط مرن" },
  "Tuulenpitävä kuoritakki": { sv: "Vindtät skaljacka", en: "Windproof shell jacket", et: "Tuulekindel koorikjope", ar: "جاكيت واقٍ من الرياح" },
  "Vettähylkivät välikausikengät": { sv: "Vattenavvisande övergångsskor", en: "Water-repellent mid-season shoes", et: "Vett tõrjuvad vahehooaja jalanõud", ar: "أحذية الموسم المتوسط مقاومة للماء" },
  "Fleece tai villainen": { sv: "Fleece eller ull", en: "Fleece or wool", et: "Fliis või vill", ar: "فليس أو صوف" },
  "Ohut pipo": { sv: "Tunn mössa", en: "Thin beanie", et: "Õhuke müts", ar: "قبعة رقيقة" },
  "Ohut puuvillabody": { sv: "Tunn bomullsbody", en: "Thin cotton bodysuit", et: "Õhuke puuvillane bodüsuits", ar: "بذلة جسم قطنية رقيقة" },
  "Kevyt ulkohaalari": { sv: "Lätt utomhusoverall", en: "Light outdoor overall", et: "Kerge õuekombinesoon", ar: "بذلة خارجية خفيفة" },
  "Joustavat collegehousut": { sv: "Stretchiga mjukisbyxor", en: "Flexible joggers", et: "Venivad dressipüksid", ar: "بنطلون رياضي مرن" },
  "Kevyt pitkähihainen": { sv: "Lätt långärmad", en: "Light long-sleeve", et: "Kerge pikkade varrukatega", ar: "أكمام طويلة خفيفة" },
  "Kevyt takki tai liivi": { sv: "Lätt jacka eller väst", en: "Light jacket or vest", et: "Kerge jope või vest", ar: "جاكيت خفيف أو صديري" },
  "Kevyet kengät": { sv: "Lätta skor", en: "Lightweight shoes", et: "Kerged jalanõud", ar: "أحذية خفيفة" },
  "Farkut tai collegehousut": { sv: "Jeans eller mjukisbyxor", en: "Jeans or joggers", et: "Teksapüksid või dressipüksid", ar: "جينز أو بنطلون رياضي" },
  "Collegehousut tai farkut": { sv: "Mjukisbyxor eller jeans", en: "Joggers or jeans", et: "Dressipüksid või teksapüksid", ar: "بنطلون رياضي أو جينز" },
  "Leveälierinen hattu": { sv: "Bredbrättad hatt", en: "Wide-brimmed hat", et: "Laia äärega kübar", ar: "قبعة عريضة الحافة" },
  "Kevyt paita": { sv: "Lätt tröja", en: "Light shirt", et: "Kerge särk", ar: "قميص خفيف" },
  "Kevyet shortsit": { sv: "Lätta shorts", en: "Light shorts", et: "Kerged lühikesed püksid", ar: "شورت خفيف" },
  "Lippalakki tai hattu": { sv: "Keps eller hatt", en: "Cap or hat", et: "Nokamüts või kübar", ar: "قبعة" },
  "Shortsit tai hame": { sv: "Shorts eller kjol", en: "Shorts or skirt", et: "Lühikesed püksid või seelik", ar: "شورت أو تنورة" },
  "Aurinkosuoja": { sv: "Solskydd", en: "Sun protection", et: "Päikesekaitse", ar: "حماية من الشمس" },
  "T-paita": { sv: "T-shirt", en: "T-shirt", et: "T-särk", ar: "تي شيرت" },
  "Fleece tai huppari": { sv: "Fleece eller hoodie", en: "Fleece or hoodie", et: "Fliis või kapuutsiga dressipluus", ar: "فليس أو هودي" },
  "Vettä hylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes", et: "Vett tõrjuvad jalanõud", ar: "أحذية مقاومة للماء" },
  "Kumisaappaat ohuilla sukilla": { sv: "Gummistövlar med tunna strumpor", en: "Rubber boots with thin socks", et: "Kummikud õhukeste sokkidega", ar: "أحذية مطاطية مع جوارب رقيقة" },
  "Kumisaappaat ja villasukat suojaavat kylmältä": { sv: "Gummistövlar och ullstrumpor skyddar mot kylan", en: "Rubber boots and wool socks protect against cold", et: "Kummikud ja villasokid kaitsevad külma eest", ar: "الأحذية المطاطية وجوارب الصوف تحمي من البرد" },
  "Sateen todennäköisyys yli 40 % — vedenpitävät varusteet mukaan!": { sv: "Regnchans över 40 % — ta med vattentät utrustning!", en: "Rain probability over 40% — bring waterproof gear!", et: "Vihma tõenäosus üle 40% — veekindlad varustused kaasa!", ar: "احتمال المطر فوق 40% — خذ معدات مقاومة للماء!" },
  "Korkea UV — suojaa pää auringolta": { sv: "Högt UV — skydda huvudet mot solen", en: "High UV — protect head from the sun", et: "Kõrge UV — kaitse pead päikese eest", ar: "أشعة UV عالية — احمِ الرأس من الشمس" },
  "UV-suoja silmille": { sv: "UV-skydd för ögonen", en: "UV protection for eyes", et: "UV-kaitse silmadele", ar: "حماية UV للعينين" },
  "Vedenpitävä kuoritakki": { sv: "Vattentät skaljacka", en: "Waterproof shell jacket", et: "Veekindel koorikjope", ar: "جاكيت واقٍ مقاوم للماء" },
  "Vedenpitävä kuoritakki sateelta suojaan": { sv: "Vattentät skaljacka mot regnet", en: "Waterproof shell jacket for rain protection", et: "Veekindel koorikjope vihma eest", ar: "جاكيت واقٍ مقاوم للماء للحماية من المطر" },
  "Vedenpitävät ulkoiluhousut sadesäälle": { sv: "Vattentäta utomhusbyxor för regnväder", en: "Waterproof outdoor trousers for rainy weather", et: "Veekindlad õuepüksid vihmase ilma jaoks", ar: "بنطلون خارجي مقاوم للماء للطقس الماطر" },
  "Vettä hylkivät kengät pitävät jalat kuivina": { sv: "Vattenavvisande skor håller fötterna torra", en: "Water-repellent shoes keep feet dry", et: "Vett tõrjuvad jalanõud hoiavad jalad kuivana", ar: "الأحذية المقاومة للماء تبقي القدمين جافتين" },
  "Vuorellinen sadehaalari tai kuravarusteet välikausipuvun päällä": { sv: "Fodrad regnoverall eller regnkläder ovanpå skaldräkt", en: "Lined rain overall or rain gear over mid-season suit", et: "Vooderdatud vihmakombinesoon või vihmariided vahehooaja riietuse peal", ar: "بذلة مطر مبطنة أو معدات مطر فوق بدلة الموسم المتوسط" },
  "Vedenpitävät kurahanskat": { sv: "Vattentäta regnvantar", en: "Waterproof rain gloves", et: "Veekindlad vihmakindad", ar: "قفازات مطر مقاومة للماء" },
  "Ohuet kuravarusteet — kevyet ja ilmavat": { sv: "Tunna regnkläder — lätta och luftiga", en: "Thin rain gear — light and airy", et: "Õhukesed vihmariided — kerged ja õhulised", ar: "معدات مطر رقيقة — خفيفة ومهواة" },
  "Kevyet kurahanskat": { sv: "Lätta regnvantar", en: "Light rain gloves", et: "Kerged vihmakindad", ar: "قفازات مطر خفيفة" },
  "Kestää päiväkodin hiekkalaatikkoleikkejä": { sv: "Tål sandlådelek på dagis", en: "Withstands daycare sandbox play", et: "Peab vastu lasteaia liivakastimängudele", ar: "يتحمل اللعب في صندوق الرمل بالروضة" },
  "Kevyet sadehousut ilman vuorta": { sv: "Lätta regnbyxor utan foder", en: "Light rain trousers without lining", et: "Kerged vihmapüksid ilma voodrita", ar: "بنطلون مطر خفيف بدون بطانة" },
  "Huomenna sataa — vedenpitävät varusteet mukaan": { sv: "Det regnar i morgon — ta med vattentäta kläder", en: "Rain expected tomorrow — bring waterproof gear", et: "Homme sajab — veekindlad varustused kaasa", ar: "متوقع مطر غداً — خذ معدات مقاومة للماء" },
  "Maa on märkä yöllisen sateen jäljiltä": { sv: "Marken är blöt efter nattens regn", en: "Ground is wet from overnight rain", et: "Maapind on märg öise vihma järel", ar: "الأرض مبللة من مطر الليل" },
  "Vaikka nyt on poutaa, maa on vielä märkä": { sv: "Även om det är uppehåll nu är marken fortfarande blöt", en: "Even though it's dry now, the ground is still wet", et: "Kuigi praegu on kuiv, on maapind veel märg", ar: "رغم أن الجو جاف الآن، الأرض لا تزال مبللة" },
  "Kova tuuli lisää kylmyyden tuntua — valitse tuulenpitävä kuorikerros": { sv: "Stark vind ökar kylkänslan — välj vindtätt skalplagg", en: "Strong wind increases wind chill — choose a windproof shell layer", et: "Tugev tuul suurendab külmatunnet — vali tuulekindel kiht", ar: "الرياح القوية تزيد الشعور بالبرد — اختر طبقة مقاومة للرياح" },
  "Vauva on paikoillaan — lisää yksi kerros lämpöä": { sv: "Babyn sitter still — lägg till ett extra värmande lager", en: "Baby is stationary — add one extra warm layer", et: "Beebi on paigal — lisa üks soojendav kiht juurde", ar: "الرضيع ثابت — أضف طبقة دافئة إضافية" },
  "Aurinkoinen sää — lippis suojaa": { sv: "Soligt väder — keps skyddar", en: "Sunny weather — cap protects", et: "Päikseline ilm — nokamüts kaitseb", ar: "طقس مشمس — القبعة تحمي" },
  "Paksu pipo kovaan pakkaseen": { sv: "Tjock mössa i hård kyla", en: "Thick beanie for hard frost", et: "Paks müts kange pakase jaoks", ar: "قبعة سميكة للصقيع الشديد" },
  "Ohut pipo viileään säähän": { sv: "Tunn mössa i svalt väder", en: "Thin beanie for cool weather", et: "Õhuke müts jaheda ilma jaoks", ar: "قبعة رقيقة للطقس البارد" },
  "Ohut, pitkähihainen puuvillabody": { sv: "Tunn, långärmad bomullsbody", en: "Thin, long-sleeve cotton bodysuit", et: "Õhuke, pikkade varrukatega puuvillane bodüsuits", ar: "بذلة جسم قطنية رقيقة بأكمام طويلة" },
  "Ohuet puuvillahousut": { sv: "Tunna bomullsbyxor", en: "Thin cotton trousers", et: "Õhukesed puuvillapüksid", ar: "بنطلون قطني رقيق" },
  "Ohut puuvillainen kypärämyssy tai aurinkohattu": { sv: "Tunn bomullshjälmhuva eller solhatt", en: "Thin cotton balaclava or sun hat", et: "Õhuke puuvillane kiivrimüts või päikesekübar", ar: "قبعة بالاكلافا قطنية رقيقة أو قبعة شمسية" },
  "Ohuet sukat": { sv: "Tunna strumpor", en: "Thin socks", et: "Õhukesed sokid", ar: "جوارب رقيقة" },
  "Pitkähihainen ohut paita tai t-paita": { sv: "Långärmad tunn tröja eller t-shirt", en: "Long-sleeve thin shirt or t-shirt", et: "Pikkade varrukatega õhuke särk või t-särk", ar: "قميص رقيق بأكمام طويلة أو تي شيرت" },
  "Ohut neuletakki tai huppari": { sv: "Tunn stickad kofta eller hoodie", en: "Thin knit cardigan or hoodie", et: "Õhuke kootud kampsun või kapuutsiga dressipluus", ar: "كارديجان محبوك رقيق أو هودي" },
  "Ohuet housut tai leggingsit": { sv: "Tunna byxor eller leggings", en: "Thin trousers or leggings", et: "Õhukesed püksid või retuusid", ar: "بنطلون رقيق أو ليجنز" },
  "Ohut pipo tai lippis": { sv: "Tunn mössa eller keps", en: "Thin beanie or cap", et: "Õhuke müts või nokamüts", ar: "قبعة رقيقة أو كاب" },
  "Sukat": { sv: "Strumpor", en: "Socks", et: "Sokid", ar: "جوارب" },
  "Ohut pitkähihainen paita tai huppari": { sv: "Tunn långärmad tröja eller hoodie", en: "Thin long-sleeve shirt or hoodie", et: "Õhuke pikkade varrukatega särk või kapuutsiga dressipluus", ar: "قميص رقيق بأكمام طويلة أو هودي" },
  "Kevyet housut": { sv: "Lätta byxor", en: "Light trousers", et: "Kerged püksid", ar: "بنطلون خفيف" },
  "Lippis tai ohut panta": { sv: "Keps eller tunt pannband", en: "Cap or thin headband", et: "Nokamüts või õhuke peapael", ar: "قبعة أو عصابة رأس رقيقة" },
  "Huppari tai kevyt takki": { sv: "Hoodie eller lätt jacka", en: "Hoodie or light jacket", et: "Kapuutsiga dressipluus või kerge jope", ar: "هودي أو جاكيت خفيف" },
  "Leveälierinen hattu tai kypärämyssy": { sv: "Bredbrättad hatt eller hjälmhuva", en: "Wide-brimmed hat or balaclava", et: "Laia äärega kübar või kiivrimüts", ar: "قبعة عريضة أو بالاكلافا" },
  "Suojaa vauva suoralta auringolta ja tuulelta": { sv: "Skydda babyn från direkt sol och vind", en: "Protect baby from direct sunlight and wind", et: "Kaitse beebit otsese päikese ja tuule eest", ar: "احمِ الرضيع من أشعة الشمس المباشرة والرياح" },
  "+1 … +15 °C — kuoritakki ja kerroksia": { sv: "+1 … +15 °C — skaljacka och lager", en: "+1 … +15 °C — shell jacket and layers", et: "+1 … +15 °C — koorikjope ja kihid", ar: "+1 … +15 °م — جاكيت واقٍ وطبقات" },
  "+1 … +15 °C — tekniset kuorivaatteet ja kerroksia": { sv: "+1 … +15 °C — tekniska skalkläder och lager", en: "+1 … +15 °C — technical shell clothing and layers", et: "+1 … +15 °C — tehnilised kooriklõuad ja kihid", ar: "+1 … +15 °م — ملابس واقية تقنية وطبقات" },
  "Ohut tekninen kuorihaalari sateen varalle": { sv: "Tunn teknisk skaloverall för regn", en: "Thin technical shell overall for rain", et: "Õhuke tehniline koorikkombinesoon vihma puhuks", ar: "بذلة واقية تقنية رقيقة للمطر" },
  "Ohut puuvillainen kypärämyssy": { sv: "Tunn bomullshjälmhuva", en: "Thin cotton balaclava", et: "Õhuke puuvillane kiivrimüts", ar: "قبعة بالاكلافا قطنية رقيقة" },
  "Muista vaunujen sadesuoja!": { sv: "Kom ihåg regnskyddet till vagnen!", en: "Remember the stroller rain cover!", et: "Ära unusta vankri vihmakatet!", ar: "تذكر غطاء المطر للعربة!" },
  "Sadeasu tai tekniset kuorivaatteet": { sv: "Regnställ eller tekniska skalkläder", en: "Rain suit or technical shell clothing", et: "Vihmakomplekt või tehnilised kooriklõuad", ar: "بدلة مطر أو ملابس واقية تقنية" },
  "Pitkähihainen paita alle": { sv: "Långärmad tröja under", en: "Long-sleeve shirt underneath", et: "Pikkade varrukatega särk alla", ar: "قميص بأكمام طويلة تحت" },
  "Lippis tai sadehattu": { sv: "Keps eller regnhatt", en: "Cap or rain hat", et: "Nokamüts või vihmakübar", ar: "قبعة أو قبعة مطر" },
  "Vedenpitävä kuoritakki tai sadetakki": { sv: "Vattentät skaljacka eller regnjacka", en: "Waterproof shell jacket or rain jacket", et: "Veekindel koorikjope või vihmajope", ar: "جاكيت واقٍ مقاوم للماء أو جاكيت مطر" },
  "Farkut tai tekniset ulkoiluhousut": { sv: "Jeans eller tekniska utomhusbyxor", en: "Jeans or technical outdoor trousers", et: "Teksapüksid või tehnilised õuepüksid", ar: "جينز أو بنطلون خارجي تقني" },
  "Vedenpitävät kengät tai tennarit": { sv: "Vattentäta skor eller sneakers", en: "Waterproof shoes or sneakers", et: "Veekindlad jalanõud või tossud", ar: "أحذية مقاومة للماء أو أحذية رياضية" },
  "Pakkaa sateenvarjo tai sadeviitta reppuun": { sv: "Packa paraply eller regnponcho i ryggsäcken", en: "Pack an umbrella or rain poncho in the backpack", et: "Paki vihmavari või vihmamantel kotti", ar: "ضع مظلة أو معطف مطر في الحقيبة" },
  "Leveälierinen hattu tai aurinkohattu": { sv: "Bredbrättad hatt eller solhatt", en: "Wide-brimmed hat or sun hat", et: "Laia äärega kübar või päikesekübar", ar: "قبعة عريضة الحافة أو قبعة شمسية" },
  "Pehmeät tossut tai kevyet kengät": { sv: "Mjuka tossor eller lätta skor", en: "Soft booties or lightweight shoes", et: "Pehmed tossud või kerged jalanõud", ar: "أحذية ناعمة أو أحذية خفيفة" },
  "Lisää villa- tai fleecekerros kuoriasun alle": { sv: "Lägg till ett ull- eller fleecelager under skaldräkten", en: "Add a wool or fleece layer under the shell suit", et: "Lisa villa- või fliiskiht koorikkombinesooni alla", ar: "أضف طبقة صوف أو فليس تحت البدلة الواقية" },
  "Kevätkausi — kuoritakki ja lämmin välikerros alle": { sv: "Vårsäsong — skaljacka och varmt mellanlager under", en: "Spring season — shell jacket and warm mid layer underneath", et: "Kevad — koorikjope ja soe soojuskiht alla", ar: "موسم الربيع — جاكيت واقٍ وطبقة وسطى دافئة تحت" },
  "Kevätkausi — tekniset kuorivaatteet ja lämmin välikerros": { sv: "Vårsäsong — tekniska skalkläder och varmt mellanlager", en: "Spring season — technical shell clothing and warm mid layer", et: "Kevad — tehnilised kooriklõuad ja soe soojuskiht", ar: "موسم الربيع — ملابس واقية تقنية وطبقة وسطى دافئة" },
  "Viileä sää — hanskat mukaan": { sv: "Svalt väder — ta med handskar", en: "Cool weather — bring gloves", et: "Jahe ilm — kindad kaasa", ar: "طقس بارد — خذ القفازات" },
  "Kova pakkanen — paksut lapaset tai rukkaset": { sv: "Hård kyla — tjocka vantar eller tumvantar", en: "Hard frost — thick mittens", et: "Kange pakane — paksud labakindad", ar: "صقيع شديد — قفازات سميكة" },
  "Vedenpitävät kengät pitävät jalat kuivina": { sv: "Vattentäta skor håller fötterna torra", en: "Waterproof shoes keep feet dry", et: "Veekindlad jalanõud hoiavad jalad kuivana", ar: "الأحذية المقاومة للماء تبقي القدمين جافتين" },
  "Vettähylkivät kengät": { sv: "Vattenavvisande skor", en: "Water-repellent shoes", et: "Vett tõrjuvad jalanõud", ar: "أحذية مقاومة للماء" },
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
    name: nameT ? (nameT as any)[lang] || item.name : item.name,
    description: descT ? (descT as any)[lang] || item.description : item.description,
  };
}
