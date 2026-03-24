import { ClothingItem } from "@/lib/weatherData";
import { useLanguage, translateClothingItem } from "@/lib/i18n";

/** Custom SVG: thick beanie with pom-pom */
function BeanieIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      {/* Pom-pom */}
      <circle cx="24" cy="8" r="4" fill="currentColor" opacity={0.7} />
      {/* Dome */}
      <path
        d="M10 28 C10 16 14 10 24 10 C34 10 38 16 38 28"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        opacity={0.25}
      />
      {/* Folded brim */}
      <rect x="8" y="26" width="32" height="8" rx="4" fill="currentColor" opacity={0.55} />
    </svg>
  );
}

/** Custom SVG: baseball cap / lippis */
function CapIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      {/* Crown */}
      <path
        d="M12 30 C12 18 16 12 26 12 C36 12 38 18 38 26 L38 30 Z"
        fill="currentColor"
        opacity={0.3}
      />
      {/* Brim / visor */}
      <path
        d="M8 30 Q8 34 14 36 L40 34 Q44 32 44 30 Z"
        fill="currentColor"
        opacity={0.6}
      />
      {/* Band */}
      <rect x="10" y="28" width="30" height="4" rx="2" fill="currentColor" opacity={0.45} />
    </svg>
  );
}

/** Custom SVG: detailed winter overall with hood, zipper, puffy segments */
function WinterOverallIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} width="28" height="28">
      {/* Fur-trimmed hood */}
      <ellipse cx="24" cy="9" rx="10" ry="5" fill="currentColor" opacity={0.18} />
      <path d="M14 9 C14 4 19 1 24 1 C29 1 34 4 34 9" stroke="currentColor" strokeWidth="2.2" fill="none" />
      {/* Fur trim on hood */}
      <path d="M13 9 Q14 7.5 15.5 9 Q17 7 18.5 9 Q20 7 21.5 9 Q23 7 24.5 9 Q26 7 27.5 9 Q29 7 30.5 9 Q32 7 33.5 9 Q35 7.5 35 9" stroke="currentColor" strokeWidth="1.2" fill="none" opacity={0.6} />
      {/* Body – puffy top segment */}
      <rect x="16" y="10" width="16" height="9" rx="3" fill="currentColor" opacity={0.3} />
      {/* Horizontal quilting lines */}
      <line x1="16.5" y1="14" x2="31.5" y2="14" stroke="currentColor" strokeWidth="0.8" opacity={0.35} />
      <line x1="16.5" y1="17.5" x2="31.5" y2="17.5" stroke="currentColor" strokeWidth="0.8" opacity={0.35} />
      {/* Body – puffy middle segment */}
      <rect x="15" y="19" width="18" height="9" rx="3" fill="currentColor" opacity={0.25} />
      {/* Quilting */}
      <line x1="15.5" y1="23" x2="32.5" y2="23" stroke="currentColor" strokeWidth="0.8" opacity={0.3} />
      <line x1="15.5" y1="26" x2="32.5" y2="26" stroke="currentColor" strokeWidth="0.8" opacity={0.3} />
      {/* Left leg */}
      <rect x="15" y="28" width="7" height="13" rx="3" fill="currentColor" opacity={0.25} />
      <line x1="15.5" y1="32" x2="21.5" y2="32" stroke="currentColor" strokeWidth="0.7" opacity={0.3} />
      <line x1="15.5" y1="36" x2="21.5" y2="36" stroke="currentColor" strokeWidth="0.7" opacity={0.3} />
      {/* Right leg */}
      <rect x="26" y="28" width="7" height="13" rx="3" fill="currentColor" opacity={0.25} />
      <line x1="26.5" y1="32" x2="32.5" y2="32" stroke="currentColor" strokeWidth="0.7" opacity={0.3} />
      <line x1="26.5" y1="36" x2="32.5" y2="36" stroke="currentColor" strokeWidth="0.7" opacity={0.3} />
      {/* Center zipper */}
      <line x1="24" y1="10" x2="24" y2="28" stroke="currentColor" strokeWidth="1.4" opacity={0.55} />
      {/* Zipper teeth */}
      {[12, 14.5, 17, 19.5, 22, 24.5, 27].map(y => (
        <line key={y} x1="23" y1={y} x2="25" y2={y} stroke="currentColor" strokeWidth="0.8" opacity={0.4} />
      ))}
      {/* Zipper pull */}
      <circle cx="24" cy="11" r="1" fill="currentColor" opacity={0.6} />
      {/* Sleeves */}
      <rect x="8" y="12" width="8" height="5" rx="2.5" fill="currentColor" opacity={0.22} />
      <rect x="32" y="12" width="8" height="5" rx="2.5" fill="currentColor" opacity={0.22} />
    </svg>
  );
}

const HAT_NAMES = new Set(["Pipo", "Lippalakki", "Lippis/Hattu"]);
const OVERALL_NAMES = new Set(["Toppahaalari"]);

function isHatItem(name: string): boolean {
  return HAT_NAMES.has(name);
}

function isOverallItem(name: string): boolean {
  return OVERALL_NAMES.has(name);
}

function HatIcon({ itemName }: { itemName: string }) {
  if (itemName === "Pipo") {
    return <BeanieIcon className="text-primary" />;
  }
  return <CapIcon className="text-accent-foreground" />;
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
            {isHatItem(item.name) ? (
                  <HatIcon itemName={item.name} />
                ) : isOverallItem(item.name) ? (
                  <WinterOverallIcon className="text-primary" />
                ) : (
                  <span className="text-2xl">{item.emoji}</span>
                )}
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
