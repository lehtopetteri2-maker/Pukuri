import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Snowflake, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// ─── Adtraction Affiliate Links ──────────────────────────────
// Replace these with your real Adtraction tracking links:
const REIMA_AFFILIATE_URL = "https://www.reima.com/fi";
const LINDEX_AFFILIATE_URL = "https://do.lindex.com/t/t?a=1200829640&as=2056824469&t=2&tk=1";
// ──────────────────────────────────────────────────────────────

export default function AffiliateSection() {
  const { t } = useLanguage();

  const brands = [
    {
      name: "Reima",
      icon: <Snowflake className="h-5 w-5 text-primary" />,
      description: t("affiliate.reima.desc"),
      cta: t("affiliate.reima.cta"),
      url: REIMA_AFFILIATE_URL,
      variant: "outline" as const,
      accent: "from-primary/8 to-secondary/10 border-primary/15 hover:border-primary/30",
    },
    {
      name: "Lindex",
      icon: <Heart className="h-5 w-5 text-primary" />,
      description: t("affiliate.lindex.desc"),
      cta: t("affiliate.lindex.cta"),
      url: LINDEX_AFFILIATE_URL,
      variant: "default" as const,
      accent: "from-secondary/10 to-accent/15 border-secondary/20 hover:border-secondary/40",
    },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-sm font-display font-700 text-muted-foreground uppercase tracking-wide">
        {t("affiliate.title")}
      </h3>

      <div className="grid gap-3">
        {brands.map((brand) => (
          <Card
            key={brand.name}
            className={`p-5 bg-gradient-to-br ${brand.accent} border transition-all duration-200`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center shadow-sm border border-border/50 shrink-0">
                {brand.icon}
              </div>
              <div>
                <h4 className="font-display font-700 text-foreground">{brand.name}</h4>
                <p className="text-sm text-muted-foreground">{brand.description}</p>
              </div>
            </div>
            <Button
              variant={brand.variant}
              className="w-full justify-between"
              asChild
            >
              <a href={brand.url} target="_blank" rel="noopener noreferrer">
                <span className="text-sm">{brand.cta}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </Button>
          </Card>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed px-1">
        {t("affiliate.disclaimer")}
      </p>
    </div>
  );
}
