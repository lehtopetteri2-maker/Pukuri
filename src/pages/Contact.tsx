export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div>
            <h1 className="text-lg font-display font-800 text-foreground leading-tight">Yhteystiedot</h1>
            <p className="text-xs text-muted-foreground">Säävahti-sovellus</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
          <h2 className="text-lg font-display font-700 text-foreground mb-4">Ota yhteyttä</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tämä on placeholder-yhteystiedot-sivu affiliate-hakemusta varten.
          </p>
          <p className="text-sm text-muted-foreground">
            Yhteydenottolomake ja yhteystiedot lisätään tähän.
          </p>
        </div>
      </main>
    </div>
  );
}
