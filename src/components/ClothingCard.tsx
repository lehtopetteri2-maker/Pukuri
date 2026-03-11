import { ClothingItem } from "@/lib/weatherData";

interface ClothingCardProps {
  items: ClothingItem[];
}

export default function ClothingCard({ items }: ClothingCardProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border animate-fade-in">
      <h2 className="text-lg font-display font-700 text-foreground mb-4">
        🧥 Pukeutumissuositus
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center gap-3 p-3 rounded-md bg-mint-light/50 border border-primary/10"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <div className="font-display font-700 text-sm text-foreground">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
