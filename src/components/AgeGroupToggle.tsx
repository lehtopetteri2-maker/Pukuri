import { AgeGroup } from "@/lib/weatherData";
import { useLanguage, TranslationKey } from "@/lib/i18n";

interface AgeGroupToggleProps {
  selected: AgeGroup;
  onChange: (group: AgeGroup) => void;
}

const groups: { value: AgeGroup; emoji: string }[] = [
  { value: "vauva", emoji: "👶" },
  { value: "taapero", emoji: "🧒" },
  { value: "leikki-ikäinen", emoji: "🎨" },
  { value: "koululainen", emoji: "🎒" },
];

export default function AgeGroupToggle({ selected, onChange }: AgeGroupToggleProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2">
      {groups.map((g) => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          className={`flex-1 rounded-lg px-2 py-3 text-center transition-all duration-200 border ${
            selected === g.value
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card text-foreground border-border hover:bg-muted"
          }`}
        >
          <div className="text-2xl mb-1">{g.emoji}</div>
          <div className="text-xs font-display font-700 leading-tight">{t(`age.${g.value}` as TranslationKey)}</div>
          <div className={`text-xs mt-0.5 ${selected === g.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {t(`age.${g.value}.ages` as TranslationKey)}
          </div>
        </button>
      ))}
    </div>
  );
}
