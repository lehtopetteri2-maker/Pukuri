import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-6 text-sm">
          <NavLink
            to="/privacy"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Tietosuoja
          </NavLink>
          <span className="text-border">|</span>
          <NavLink
            to="/contact"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Yhteystiedot
          </NavLink>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} Säävahti
        </p>
      </div>
    </footer>
  );
}
