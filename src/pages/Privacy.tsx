export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div>
            <h1 className="text-lg font-display font-800 text-foreground leading-tight">Tietosuoja</h1>
            <p className="text-xs text-muted-foreground">Säävahti-sovellus</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
          <h2 className="text-lg font-display font-700 text-foreground mb-4">Tietosuojaseloste</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tämä on placeholder-tietosuojasivu affiliate-hakemusta varten.
          </p>
          <p className="text-sm text-muted-foreground">
            Tähän tulee sovelluksen tietosuojaselosteen sisältö, mukaan lukien tietojen kerääminen, 
            käsittely ja säilytys.
          </p>
        </div>
      </main>
    </div>
  );
}
