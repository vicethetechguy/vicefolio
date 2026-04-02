import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface CalendlyEmbedProps {
  url: string;
}

export const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) return null;

  // Clean the URL to ensure it's a valid Calendly link
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = `https://calendly.com/${cleanUrl}`;
  }

  return (
    <div className="relative w-full min-h-[700px] rounded-3xl overflow-hidden border border-border/50 bg-secondary/20 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300">
          <Loader2 className="w-12 h-12 text-vice-500 animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Scheduling Assistant...</p>
        </div>
      )}

      <iframe
        src={`${cleanUrl}?hide_landing_page=1&hide_gdpr_banner=1&background_color=ffcf00&text_color=000000&primary_color=000000`}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Schedule with Calendly"
        className={`min-h-[700px] transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      ></iframe>
    </div>
  );
};
