import { ClothingItem } from "@/lib/weatherData";
import { DualRecommendation } from "@/lib/dualRecommendation";
import { useLanguage, translateClothingItem } from "@/lib/i18n";
import { Wind, Droplets, AlertTriangle } from "lucide-react";

/** Custom SVG: beanie */
function BeanieIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      <circle cx="24" cy="8" r="4" fill="currentColor" opacity={0.7} />
      <path d="M10 28 C10 16 14 10 24 10 C34 10 38 16 38 28" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity={0.25} />
      <rect x="8" y="26" width="32" height="8" rx="4" fill="currentColor" opacity={0.55} />
    </svg>
  );
}

/** Custom SVG: cap */
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

function ItemIcon({ item }: { item: ClothingItem }) {
  if (HAT_NAMES.has(item.name)) {
    return item.name === "Pipo"
      ? <BeanieIcon className="text-primary" />
      : <CapIcon className="text-accent-foreground" />;
  }
  return <span className="text-2xl">{item.emoji}</span>;
}

function ClothingList({ items }: { items: ClothingItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.name}
          className="flex items-center gap-3 p-2.5 rounded-md bg-mint-light/50 border border-primary/10"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <ItemIcon item={item} />
          <div>
            <div className="font-display font-700 text-xs text-foreground">{item.name}</div>
            <div className="text-[11px] text-muted-foreground">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  dual: DualRecommendation;
}

export default function DualClothingCard({ dual }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Alerts bar */}
      {(dual.windWarning || dual.mudFactor) && (
        <div className="rounded-lg bg-accent/20 border border-accent/30 p-3 space-y-1.5">
          {dual.windWarning && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Wind className="h-4 w-4 text-primary shrink-0" />
              <span>{t("dual.windWarning", { speed: dual.windSpeed })}</span>
            </div>
          )}
          {dual.mudFactor && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Droplets className="h-4 w-4 text-primary shrink-0" />
              <span>{t("dual.mudWarning")}</span>
            </div>
          )}
        </div>
      )}

      {dual.isDual ? (
        /* Dual layout: morning + afternoon side by side */
        <div className="grid grid-cols-2 gap-3">
          {/* Morning */}
          <div className="rounded-lg bg-card p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌅</span>
              <div>
                <h3 className="text-sm font-display font-700 text-foreground">{t("dual.morning")}</h3>
                <p className="text-xs text-muted-foreground">
                  {dual.morningTemp}°C ({t("weather.feelsLike")} {dual.morningFeelsLike}°C)
                </p>
              </div>
            </div>
            <ClothingList items={dual.morningClothing} />
          </div>

          {/* Afternoon */}
          <div className="rounded-lg bg-card p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">☀️</span>
              <div>
                <h3 className="text-sm font-display font-700 text-foreground">{t("dual.afternoon")}</h3>
                <p className="text-xs text-muted-foreground">
                  {dual.afternoonTemp}°C ({t("weather.feelsLike")} {dual.afternoonFeelsLike}°C)
                </p>
              </div>
            </div>
            <ClothingList items={dual.afternoonClothing} />
          </div>
        </div>
      ) : (
        /* Single layout */
        <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
          <h2 className="text-lg font-display font-700 text-foreground mb-4">
            {t("clothing.title")}
          </h2>
          <ClothingList items={dual.morningClothing} />
        </div>
      )}

      {/* Gap info banner */}
      {dual.isDual && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            {t("dual.gapInfo", { morning: dual.morningTemp, afternoon: dual.afternoonTemp })}
          </p>
        </div>
      )}
    </div>
  );
}
