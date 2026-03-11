import { Card } from "@/components/ui/card";
import { ExternalLink, Snowflake, Footprints, Palette } from "lucide-react";

interface BrandLink {
  name: string;
  cta: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  brands: BrandLink[];
}

const categories: Category[] = [
  {
    title: "Ulkoilu & Vaatteet",
    icon: <Snowflake className="h-4 w-4" />,
    brands: [
      { name: "Reima", cta: "Tutustu kauden uutuuksiin" },
      { name: "Lindex", cta: "Katso päivän tarjoukset" },
      { name: "Polarn O. Pyret", cta: "Löydä kestävät klassikot" },
    ],
  },
  {
    title: "Kengät & Asusteet",
    icon: <Footprints className="h-4 w-4" />,
    brands: [
      { name: "Viking", cta: "Katso vedenpitävät mallit" },
      { name: "Kuoma", cta: "Löydä lämpimät talvikengät" },
      { name: "Crocs", cta: "Tutustu kevyisiin vaihtoehtoihin" },
    ],
  },
  {
    title: "Harrastus & Leikki",
    icon: <Palette className="h-4 w-4" />,
    brands: [
      { name: "Jollyroom", cta: "Katso suosituimmat tuotteet" },
      { name: "Stadium", cta: "Tutustu urheiluvälineisiin" },
      { name: "Suomalainen Kirjakauppa", cta: "Löydä sadepäivän puuhat" },
    ],
  },
];

export default function AffiliateSection() {
  return (
    <Card className="p-5 border border-border/60 bg-gradient-to-br from-card to-muted/20 space-y-5">
      <div>
        <h3 className="text-sm font-display font-700 text-foreground mb-1">
          🛍️ Suosittelemme arkeen
        </h3>
        <p className="text-xs text-muted-foreground">
          Helpota perheen arkea laadukkailla tuotteilla
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.title}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-primary">{cat.icon}</span>
              <h4 className="text-xs font-display font-700 text-muted-foreground uppercase tracking-wide">
                {cat.title}
              </h4>
            </div>
            <div className="grid gap-1.5">
              {cat.brands.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => console.log(`Affiliate: ${brand.name}`)}
                  className="flex items-center justify-between w-full text-left py-2.5 px-3.5 rounded-md bg-muted/40 hover:bg-muted/70 border border-border/40 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-display font-700 text-foreground block">{brand.name}</span>
                    <span className="text-xs text-muted-foreground">{brand.cta}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed pt-1">
        Säävahti on riippumaton palvelu. Suositukset on valittu helpottamaan perheiden arkea ja ne voivat 
        sisältää mainoslinkkejä. Linkkien kautta tehdyistä ostoksista saatava komissio käytetään sovelluksen 
        ylläpitoon ja kehitykseen.
      </p>
    </Card>
  );
}
