import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-muted/30 mt-8">
        <div className="max-w-lg mx-auto px-4 py-5">
          <p className="text-center text-xs text-muted-foreground">
            {t("footer.copyright")} |{" "}
            <button onClick={() => setPrivacyOpen(true)} className="underline hover:text-foreground transition-colors">{t("footer.privacy")}</button>
            {" | "}
            <button onClick={() => setContactOpen(true)} className="underline hover:text-foreground transition-colors">{t("footer.contact")}</button>
          </p>
        </div>
      </footer>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">{t("footer.privacyTitle")}</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setPrivacyOpen(false)}><X className="h-4 w-4" /></Button>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS1Title")}</h3><p>{t("footer.privacyS1")}</p></section>
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS2Title")}</h3><p>{t("footer.privacyS2")}</p></section>
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS3Title")}</h3><p>{t("footer.privacyS3")}</p></section>
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS4Title")}</h3><p>{t("footer.privacyS4")}</p></section>
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS5Title")}</h3><p>{t("footer.privacyS5")}</p></section>
            <section><h3 className="font-display font-700 text-foreground mb-1">{t("footer.privacyS6Title")}</h3><p>{t("footer.privacyS6")} <a href="mailto:saavahti@outlook.com" className="text-primary underline hover:text-primary/80 transition-colors">saavahti@outlook.com</a></p><p className="mt-2 text-xs text-muted-foreground/70">{t("affiliate.adtraction")}</p></section>
          </div>
          <div className="pt-2"><Button variant="outline" className="w-full" onClick={() => setPrivacyOpen(false)}>{t("footer.close")}</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">{t("footer.contactTitle")}</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setContactOpen(false)}><X className="h-4 w-4" /></Button>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>{t("footer.contactIntro")}</p>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">{t("footer.emailTitle")}</h3>
              <p><a href="mailto:saavahti@outlook.com" className="text-primary underline hover:text-primary/80 transition-colors">saavahti@outlook.com</a></p>
            </section>
            <section>
              <h3 className="font-display font-700 text-foreground mb-1">{t("footer.partnerTitle")}</h3>
              <p>{t("footer.partnerDesc")}</p>
            </section>
          </div>
          <div className="pt-2"><Button variant="outline" className="w-full" onClick={() => setContactOpen(false)}>{t("footer.close")}</Button></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
