import React, { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";

interface CalendlyEmbedProps {
  url: string;
}

export const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ url }) => {
  const [showLoading, setShowLoading] = useState(true);

  if (!url) return null;

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = `https://calendly.com/${cleanUrl}`;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-secondary/10 shadow-2xl animate-[fadeIn_0.5s_ease-out] no-scrollbar">
      {/* Loading Overlay */}
      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50 transition-opacity duration-700 pointer-events-none">
          <Loader2 className="w-10 h-10 text-vice-500 animate-spin mb-4" />
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground opacity-50">Opening Scheduler...</p>
        </div>
      )}

      {/* Emergency Unlock */}
      <div className="absolute bottom-4 right-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
         <a 
          href={cleanUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
        >
          Open direct link
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="no-scrollbar overflow-hidden">
        <iframe
          src={`${cleanUrl}?hide_landing_page=1&hide_gdpr_banner=1&background_color=ffcf00&text_color=000000&primary_color=000000`}
          width="100%"
          height="800"
          frameBorder="0"
          title="Schedule with Calendly"
          className={`w-full h-[800px] border-none transition-opacity duration-1000 ${showLoading ? 'opacity-30' : 'opacity-100'} no-scrollbar`}
          onLoad={() => setShowLoading(false)}
          /* @ts-ignore - scrolling is deprecated but works for hiding scrollbars in iframes */
          scrolling="no" 
          style={{ overflow: 'hidden', border: 'none' }}
        ></iframe>
      </div>
      
      {/* Heavy-duty global scrollbar removal for this page context */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow: hidden !important; }
        iframe::-webkit-scrollbar { display: none !important; }
      `}} />
    </div>
  );
};
