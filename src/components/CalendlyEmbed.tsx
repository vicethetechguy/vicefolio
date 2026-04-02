import React from "react";

interface CalendlyEmbedProps {
  url: string;
}

export const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ url }) => {
  if (!url) return null;

  // Clean the URL to ensure it's a valid Calendly link
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = `https://calendly.com/${cleanUrl}`;
  }

  return (
    <div className="w-full min-h-[700px] rounded-2xl overflow-hidden border border-border bg-white/5 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
      <iframe
        src={`${cleanUrl}?hide_landing_page=1&hide_gdpr_banner=1&background_color=ffcf00&text_color=000000&primary_color=000000`}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Schedule with Calendly"
        className="min-h-[700px]"
      ></iframe>
    </div>
  );
};
