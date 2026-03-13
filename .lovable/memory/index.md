Finnish weather clothing app for children. i18n system with FI/SV/EN support via src/lib/i18n.tsx context.

- Design: Nunito display + Inter body, HSL tokens in index.css, Nordic minimal
- i18n: LanguageProvider wraps app, useLanguage() hook, TranslationKey type, localStorage key "saavahti-language", 3 langs: fi/sv/en
- Age groups: vauva, taapero, leikki-ikäinen, koululainen
- Checklist items use labelKey (TranslationKey) instead of raw strings
- Weather API supports Finnish and Swedish city names
- All UI strings translated in src/lib/i18n.tsx translations object
- Affiliate partners: Polarn O. Pyret, Lindex (Adtraction tracking links)
