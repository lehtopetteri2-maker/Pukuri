const API_KEY = "247aa2ee8cccf0e1e53ea7ab0aeb4e7d";
const GEO_BASE = "https://api.openweathermap.org/geo/1.0";
const NORDIC_COUNTRIES = ["FI", "SE", "NO", "DK"];

export interface GeoResult {
  name: string;
  localName?: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const countryFlags: Record<string, string> = {
  FI: "🇫🇮",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
};

const countryNames: Record<string, string> = {
  FI: "Suomi",
  SE: "Sverige",
  NO: "Norge",
  DK: "Danmark",
};

export function getCountryFlag(code: string): string {
  return countryFlags[code] ?? "";
}

export function getCountryName(code: string): string {
  return countryNames[code] ?? code;
}

export async function searchLocations(query: string): Promise<GeoResult[]> {
  if (query.trim().length < 2) return [];

  const fetches = NORDIC_COUNTRIES.map(async (cc) => {
    try {
      const res = await fetch(
        `${GEO_BASE}/direct?q=${encodeURIComponent(query.trim())},${cc}&limit=5&appid=${API_KEY}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data as any[]).map((d) => ({
        name: d.name,
        localName: d.local_names?.fi || d.local_names?.sv || d.local_names?.no || d.local_names?.da || undefined,
        country: d.country,
        state: d.state,
        lat: d.lat,
        lon: d.lon,
      }));
    } catch {
      return [];
    }
  });

  const allResults = (await Promise.all(fetches)).flat();

  // Deduplicate by rounding coords to ~1km
  const seen = new Set<string>();
  const unique: GeoResult[] = [];
  for (const r of allResults) {
    const key = `${r.lat.toFixed(2)}_${r.lon.toFixed(2)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  }

  return unique.slice(0, 20);
}
