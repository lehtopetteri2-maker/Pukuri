import { useLanguage, Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useLanguage();

  const options: { value: Language; label: string; flag: string }[] = [
    { value: "fi", label: "FI", flag: "🇫🇮" },
    { value: "sv", label: "SV", flag: "🇸🇪" },
    { value: "en", label: "EN", flag: "🇬🇧" },
    { value: "et", label: "ET", flag: "🇪🇪" },
    { value: "ar", label: "AR", flag: "🇸🇦" },
  ];

  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 flex-wrap gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-display font-700 transition-all ${
            lang === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="text-sm">{opt.flag}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
