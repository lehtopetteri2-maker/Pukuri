import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, ShoppingBag } from "lucide-react";

export default function AffiliateSection() {
  const affiliateLinks = [
    { name: "Reima", label: "Katso Reiman uutuudet", color: "bg-sky/20 hover:bg-sky/30" },
    { name: "Polarn O. Pyret", label: "Löydä kestävät klassikot", color: "bg-secondary/30 hover:bg-secondary/40" },
    { name: "Minimarket", label: "Tutustu suomalaiseen designiin", color: "bg-accent/40 hover:bg-accent/50" },
  ];

  return (
    <Card className="p-5 border border-border/60 bg-gradient-to-br from-card to-muted/30">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-display font-700 text-foreground">
          Suosittelemme laadukkaita varusteita
        </h3>
      </div>

      <div className="space-y-2">
        {affiliateLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            className={`w-full justify-between text-left h-auto py-3 px-4 ${link.color} text-foreground font-medium text-sm transition-all`}
            onClick={() => {
              // Placeholder for affiliate link
              console.log(`Affiliate link clicked: ${link.name}`);
            }}
          >
            <span>{link.label}</span>
            <ExternalLink className="h-4 w-4 opacity-60" />
          </Button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
        Säävahti on riippumaton apuri. Suositukset voivat sisältää mainoslinkkejä, 
        joiden avulla tuet kotimaista kehitystyötä.
      </p>
    </Card>
  );
}
