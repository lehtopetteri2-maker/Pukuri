import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TAB_COUNT } from "./BottomNavBar";

interface SwipeablePagesProps {
  activeIndex: number;
  onIndexChange: (index: number) => void;
  children: React.ReactNode[];
}

export default function SwipeablePages({ activeIndex, onIndexChange, children }: SwipeablePagesProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
    watchDrag: (_, evt) => {
      // Don't initiate swipe if touch starts on a slider element
      const target = (evt as unknown as TouchEvent).target as HTMLElement | null;
      if (target?.closest('[role="slider"], input[type="range"], .swipe-ignore')) {
        return false;
      }
      return true;
    },
  });

  const isUserScroll = useRef(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    if (idx !== activeIndex) {
      isUserScroll.current = true;
      onIndexChange(idx);
    }
  }, [emblaApi, activeIndex, onIndexChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  // Sync programmatic tab changes
  useEffect(() => {
    if (!emblaApi) return;
    if (isUserScroll.current) {
      isUserScroll.current = false;
      return;
    }
    emblaApi.scrollTo(activeIndex);
  }, [emblaApi, activeIndex]);

  return (
    <div ref={emblaRef} className="overflow-hidden flex-1">
      <div className="flex h-full">
        {children.map((child, i) => (
          <div
            key={i}
            className="min-w-0 shrink-0 grow-0 basis-full h-full overflow-y-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
