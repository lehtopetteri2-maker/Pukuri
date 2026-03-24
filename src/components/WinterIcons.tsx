/** Shared puffer-style winter clothing SVG icons */

/** Puffer winter overall (toppahaalari) – one-piece with hood, fur trim, zipper, quilted segments */
export function PufferOverallIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" fill="none" className={className} width="28" height="28">
      {/* Fur-trimmed hood */}
      <path d="M16 12 C16 5 19 2 24 2 C29 2 32 5 32 12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity={0.15} strokeLinecap="round" />
      <path d="M15 12.5 Q16.5 10.5 18 12.5 Q19.5 10.5 21 12.5 Q22.5 10.5 24 12.5 Q25.5 10.5 27 12.5 Q28.5 10.5 30 12.5 Q31.5 10.5 33 12.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity={0.55} strokeLinecap="round" />
      
      {/* Puffy torso – top segment */}
      <path d="M14 13 Q14 12 16 12 L32 12 Q34 12 34 13 L34 20 Q34 21.5 32 21.5 L16 21.5 Q14 21.5 14 20 Z" fill="currentColor" opacity={0.3} />
      {/* Quilting lines on torso top */}
      <line x1="15" y1="16" x2="33" y2="16" stroke="currentColor" strokeWidth="0.9" opacity={0.3} />
      
      {/* Puffy torso – bottom segment */}
      <path d="M13.5 21.5 Q13.5 20.5 15 21 L33 21 Q34.5 20.5 34.5 21.5 L34.5 29 Q34.5 30 33 30 L15 30 Q13.5 30 13.5 29 Z" fill="currentColor" opacity={0.25} />
      {/* Quilting */}
      <line x1="14.5" y1="24.5" x2="33.5" y2="24.5" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="14.5" y1="27.5" x2="33.5" y2="27.5" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />

      {/* Left puffy leg */}
      <path d="M14 30 L14 43 Q14 45 16 45 L20 45 Q22 45 22 43 L22 30 Z" fill="currentColor" opacity={0.22} rx="3" />
      <line x1="14.5" y1="34" x2="21.5" y2="34" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />
      <line x1="14.5" y1="38" x2="21.5" y2="38" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />
      <line x1="14.5" y1="42" x2="21.5" y2="42" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />

      {/* Right puffy leg */}
      <path d="M26 30 L26 43 Q26 45 28 45 L32 45 Q34 45 34 43 L34 30 Z" fill="currentColor" opacity={0.22} />
      <line x1="26.5" y1="34" x2="33.5" y2="34" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />
      <line x1="26.5" y1="38" x2="33.5" y2="38" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />
      <line x1="26.5" y1="42" x2="33.5" y2="42" stroke="currentColor" strokeWidth="0.8" opacity={0.25} />

      {/* Puffy sleeves */}
      <ellipse cx="10" cy="16" rx="5" ry="3.5" fill="currentColor" opacity={0.2} />
      <line x1="6" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="0.7" opacity={0.2} />
      <ellipse cx="38" cy="16" rx="5" ry="3.5" fill="currentColor" opacity={0.2} />
      <line x1="35" y1="16" x2="42" y2="16" stroke="currentColor" strokeWidth="0.7" opacity={0.2} />

      {/* Center zipper */}
      <line x1="24" y1="12" x2="24" y2="30" stroke="currentColor" strokeWidth="1.6" opacity={0.5} />
      {/* Zipper teeth */}
      {[14, 16.5, 19, 22, 24.5, 27, 29].map(y => (
        <line key={y} x1="22.8" y1={y} x2="25.2" y2={y} stroke="currentColor" strokeWidth="0.9" opacity={0.35} />
      ))}
      {/* Zipper pull */}
      <circle cx="24" cy="13" r="1.2" fill="currentColor" opacity={0.55} />

      {/* Outline to give shape definition */}
      <path d="M16 12 L14 13 L13.5 30 L14 45 Q14 46 16 46 L20 46 Q22 46 22 44 L22 30 L26 30 L26 44 Q26 46 28 46 L32 46 Q34 46 34 44 L34.5 30 L34 13 L32 12" stroke="currentColor" strokeWidth="1" opacity={0.2} fill="none" strokeLinejoin="round" />
    </svg>
  );
}

/** Puffer jacket (toppatakki) – separate jacket with hood, fur trim, zipper, quilted */
export function PufferJacketIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" fill="none" className={className} width="28" height="28">
      {/* Fur-trimmed hood */}
      <path d="M16 10 C16 4 19 1 24 1 C29 1 32 4 32 10" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity={0.15} strokeLinecap="round" />
      <path d="M15 10.5 Q16.5 8.8 18 10.5 Q19.5 8.8 21 10.5 Q22.5 8.8 24 10.5 Q25.5 8.8 27 10.5 Q28.5 8.8 30 10.5 Q31.5 8.8 33 10.5" stroke="currentColor" strokeWidth="1.4" fill="none" opacity={0.5} strokeLinecap="round" />

      {/* Puffy body – upper */}
      <path d="M13 11 Q13 10 15 10 L33 10 Q35 10 35 11 L35 20 Q35 21 33 21 L15 21 Q13 21 13 20 Z" fill="currentColor" opacity={0.32} />
      <line x1="14" y1="15" x2="34" y2="15" stroke="currentColor" strokeWidth="0.9" opacity={0.3} />

      {/* Puffy body – lower */}
      <path d="M12.5 21 Q12.5 20 14 20.5 L34 20.5 Q35.5 20 35.5 21 L36 32 Q36 34 34 34 L14 34 Q12 34 12 32 Z" fill="currentColor" opacity={0.26} />
      <line x1="13.5" y1="25" x2="34.5" y2="25" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="13" y1="29" x2="35" y2="29" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />

      {/* Puffy hem band */}
      <rect x="12" y="33" width="24" height="3" rx="1.5" fill="currentColor" opacity={0.35} />

      {/* Puffy sleeves */}
      <ellipse cx="9" cy="15" rx="5.5" ry="4" fill="currentColor" opacity={0.22} />
      <line x1="5" y1="15" x2="12.5" y2="15" stroke="currentColor" strokeWidth="0.7" opacity={0.2} />
      <path d="M4 18 Q4 20 6 20 L8 20" fill="currentColor" opacity={0.18} />
      <ellipse cx="39" cy="15" rx="5.5" ry="4" fill="currentColor" opacity={0.22} />
      <line x1="35.5" y1="15" x2="43" y2="15" stroke="currentColor" strokeWidth="0.7" opacity={0.2} />
      <path d="M44 18 Q44 20 42 20 L40 20" fill="currentColor" opacity={0.18} />

      {/* Center zipper */}
      <line x1="24" y1="10" x2="24" y2="34" stroke="currentColor" strokeWidth="1.5" opacity={0.5} />
      {[12, 14.5, 17, 19.5, 22, 24.5, 27, 29.5, 32].map(y => (
        <line key={y} x1="22.8" y1={y} x2="25.2" y2={y} stroke="currentColor" strokeWidth="0.8" opacity={0.35} />
      ))}
      <circle cx="24" cy="11" r="1.2" fill="currentColor" opacity={0.55} />
    </svg>
  );
}

/** Puffer snow trousers (toppahousut) – quilted puffy trousers with suspenders */
export function PufferTrousersIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" className={className} width="28" height="28">
      {/* Suspender straps */}
      <line x1="12" y1="2" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" opacity={0.4} strokeLinecap="round" />
      <line x1="28" y1="2" x2="26" y2="10" stroke="currentColor" strokeWidth="1.5" opacity={0.4} strokeLinecap="round" />

      {/* Waist / bib */}
      <rect x="10" y="8" width="20" height="6" rx="2" fill="currentColor" opacity={0.3} />

      {/* Left puffy leg */}
      <path d="M10 14 L9 40 Q9 44 12 44 L17 44 Q20 44 20 40 L20 14 Z" fill="currentColor" opacity={0.24} />
      <line x1="10" y1="19" x2="19.5" y2="19" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="9.5" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="9.5" y1="29" x2="20" y2="29" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="9.5" y1="34" x2="20" y2="34" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="9.5" y1="39" x2="19.5" y2="39" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />

      {/* Right puffy leg */}
      <path d="M20 14 L20 40 Q20 44 23 44 L28 44 Q31 44 31 40 L30 14 Z" fill="currentColor" opacity={0.24} />
      <line x1="20.5" y1="19" x2="30" y2="19" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="20" y1="24" x2="30.5" y2="24" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="20" y1="29" x2="30.5" y2="29" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="20" y1="34" x2="30.5" y2="34" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
      <line x1="20.5" y1="39" x2="30.5" y2="39" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />

      {/* Ankle cuffs */}
      <rect x="9" y="42" width="11" height="3" rx="1.5" fill="currentColor" opacity={0.32} />
      <rect x="20" y="42" width="11" height="3" rx="1.5" fill="currentColor" opacity={0.32} />
    </svg>
  );
}
