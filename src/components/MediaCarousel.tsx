import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isVideoUrl } from "./ui/media-uploader";

interface MediaCarouselProps {
  value?: string; // Comma-separated URLs
  className?: string;
  itemClassName?: string;
}

export function MediaCarousel({ 
  value = "", 
  className = "",
  itemClassName = "aspect-[3/4] lg:h-[85vh]"
}: MediaCarouselProps) {
  const urls = value ? value.split(",").filter(v => v.trim() !== "") : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (urls.length === 0) return null;
  if (urls.length === 1) {
    const url = urls[0];
    return (
      <div className={`${className} relative overflow-hidden rounded-2xl`}>
        {isVideoUrl(url) ? (
          <video src={url} autoPlay loop muted playsInline className={`w-full ${itemClassName} object-cover grayscale`} />
        ) : (
          <img src={url} alt="Carousel item" className={`w-full ${itemClassName} object-cover grayscale`} />
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {urls.map((url, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              {isVideoUrl(url) ? (
                <video src={url} autoPlay loop muted playsInline className={`w-full ${itemClassName} object-cover grayscale`} />
              ) : (
                <img src={url} alt={`Slide ${index + 1}`} className={`w-full ${itemClassName} object-cover grayscale`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {urls.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "bg-white w-4" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
