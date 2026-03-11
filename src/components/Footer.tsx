import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-muted/30 mt-8">
        <div className="max-w-lg mx-auto px-4 py-5">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 Säävahti |{" "}
            <button
              onClick={() => setPrivacyOpen(true)}
              className="underline hover:text-foreground transition-colors"
            >
              Tietosuoja
            </button>
            {" | "}
            <button
              onClick={() => setContactOpen(true)}
              className="underline hover:text-foreground transition-colors"
            >
              Yhteystiedot
            </button>
          </p>
        </div>
      </footer>

      {/* Tietosuoja Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Tietosuojaseloste</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setPrivacyOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">1. Rekisterinpitäjä</h3>
              <p>Säävahti-sovellus</p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">2. Kerättävät tiedot</h3>
              <p>Sovellus tallentaa paikallisesti (selaimen LocalStorage) käyttäjän valitseman kaupungin, ikäryhmävalinnan sekä viikko-ohjelmakuvan. Tietoja ei lähetetä ulkoisille palvelimille.</p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">3. Tietojen käyttö</h3>
              <p>Tallennettuja tietoja käytetään ainoastaan sovelluksen toiminnallisuuden tarjoamiseen, kuten pukeutumissuositusten näyttämiseen ja viikko-ohjelman säilyttämiseen.</p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">4. Evästeet ja analytiikka</h3>
              <p>Sovellus ei käytä kolmannen osapuolen evästeitä. Mahdolliset mainoslinkit (affiliate-linkit) voivat ohjata ulkoisille sivustoille, joilla on omat tietosuojakäytäntönsä.</p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">5. Tietojen poistaminen</h3>
              <p>Käyttäjä voi poistaa kaikki tallentamansa tiedot tyhjentämällä selaimen LocalStorage-tiedot selaimen asetuksista.</p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">6. Yhteydenotto</h3>
              <p>
                Palautetta ja tietosuojaa koskevia kysymyksiä voit lähettää sähköpostitse:{" "}
                <a href="mailto:lehtopetteri@hotmail.com" className="text-primary underline hover:text-primary/80 transition-colors">
                  lehtopetteri@hotmail.com
                </a>
              </p>
            </section>
          </div>
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setPrivacyOpen(false)}>Sulje</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Yhteystiedot Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Yhteystiedot</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setContactOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Olemme iloisia kuullessamme sinusta! Voit ottaa yhteyttä alla olevilla tavoilla.</p>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">Sähköposti</h3>
              <p>
                <a href="mailto:lehtopetteri@hotmail.com" className="text-primary underline hover:text-primary/80 transition-colors">
                  lehtopetteri@hotmail.com
                </a>
              </p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">Yhteistyö & Mainonta</h3>
              <p>Kiinnostaako affiliate-yhteistyö tai mainospaikka? Ota yhteyttä sähköpostitse, niin kerromme lisää mahdollisuuksista.</p>
            </section>
          </div>
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setContactOpen(false)}>Sulje</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
