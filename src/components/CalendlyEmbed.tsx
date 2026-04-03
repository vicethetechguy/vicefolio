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
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden no-scrollbar bg-transparent">
      {/* Local Loader - Minimal */}
      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0B]/90 backdrop-blur-sm z-50 transition-opacity duration-700 pointer-events-none">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground opacity-50">Opening Scheduler...</p>
        </div>
      )}

      {/* Emergency Unlock */}
      <div className="absolute bottom-4 right-4 z-40 opacity-30 hover:opacity-100 transition-opacity">
         <a 
          href={cleanUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          Open direct link
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* 
        The Zero-Scroll Iframe 
        We use height="100%" to fill the parent container exactly.
      */}
      <div className="w-full h-full no-scrollbar overflow-hidden">
        <iframe
          src={`${cleanUrl}?hide_landing_page=1&hide_gdpr_banner=1&background_color=0a0a0b&text_color=ffffff&primary_color=ffcf00`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Schedule with Calendly"
          className={`w-full h-full border-none transition-opacity duration-1000 ${showLoading ? 'opacity-30' : 'opacity-100'} no-scrollbar`}
          onLoad={() => setShowLoading(false)}
          /* @ts-ignore */
          scrolling="no" 
          style={{ overflow: 'hidden !important', border: 'none' }}
        ></iframe>
      </div>
      
      {/* Final barrier for forcing zero scrollbar appearance */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow: hidden !important; }
        iframe::-webkit-scrollbar { display: none !important; }
        iframe { border: none !important; overflow: hidden !important; }
      `}} />
    </div>
  );
};
