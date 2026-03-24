import { ClothingItem } from "@/lib/weatherData";
import { useLanguage, translateClothingItem } from "@/lib/i18n";
import { PufferOverallIcon, PufferJacketIcon, PufferTrousersIcon } from "./WinterIcons";

/** Custom SVG: thick beanie with pom-pom */
function BeanieIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      <circle cx="24" cy="8" r="4" fill="currentColor" opacity={0.7} />
      <path d="M10 28 C10 16 14 10 24 10 C34 10 38 16 38 28" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity={0.25} />
      <rect x="8" y="26" width="32" height="8" rx="4" fill="currentColor" opacity={0.55} />
    </svg>
  );
}

/** Custom SVG: baseball cap / lippis */
function CapIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      <path d="M12 30 C12 18 16 12 26 12 C36 12 38 18 38 26 L38 30 Z" fill="currentColor" opacity={0.3} />
      <path d="M8 30 Q8 34 14 36 L40 34 Q44 32 44 30 Z" fill="currentColor" opacity={0.6} />
      <rect x="10" y="28" width="30" height="4" rx="2" fill="currentColor" opacity={0.45} />
    </svg>
  );
}

const HAT_NAMES = new Set(["Pipo", "Lippalakki", "Lippis/Hattu"]);
const OVERALL_NAMES = new Set(["Toppahaalari"]);
const JACKET_NAMES = new Set(["Toppatakki"]);
const TROUSERS_NAMES = new Set(["Toppahousut"]);

function ItemIcon({ item }: { item: ClothingItem }) {
  if (HAT_NAMES.has(item.name)) {
    return item.name === "Pipo"
      ? <BeanieIcon className="text-primary" />
      : <CapIcon className="text-accent-foreground" />;
  }
  if (OVERALL_NAMES.has(item.name)) return <PufferOverallIcon className="text-primary" />;
  if (JACKET_NAMES.has(item.name)) return <PufferJacketIcon className="text-primary" />;
  if (TROUSERS_NAMES.has(item.name)) return <PufferTrousersIcon className="text-primary" />;
  return <span className="text-2xl">{item.emoji}</span>;
}

interface ClothingCardProps {
  items: ClothingItem[];
}

export default function ClothingCard({ items }: ClothingCardProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <h2 className="text-lg font-display font-700 text-foreground mb-4">
        {t("clothing.title")}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => {
            const translated = translateClothingItem(item, lang);
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-md bg-mint-light/50 border border-primary/10"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ItemIcon item={item} />
                <div>
                  <div className="font-display font-700 text-sm text-foreground">{translated.name}</div>
                  <div className="text-xs text-muted-foreground">{translated.description}</div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
