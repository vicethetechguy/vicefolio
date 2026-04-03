import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { Zap, Trophy, MessageSquare, ArrowLeft, ArrowUpRight } from "lucide-react";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";

const Booking = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const { getText } = useTexts();
  const [selectedSessionUrl, setSelectedSessionUrl] = useState<string | null>(null);
  
  const session30 = getText("calendly_30min", "");
  const session60 = getText("calendly_60min", "");
  const sessionCustom = getText("calendly_custom", "");
  const hasCalendly = session30 || session60 || sessionCustom;

  // Global Scroll Lock for the whole page when booking is active
  useEffect(() => {
    if (selectedSessionUrl) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [selectedSessionUrl]);

  return (
    <Layout>
      <div className={`transition-all duration-700 ${selectedSessionUrl ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {/* Hero */}
        <section className="section-padding">
          <div className="container-vice">
            <div
              ref={headerRef}
              className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
                headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {getText("booking_label", "Book a Call")}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 text-white">
                {getText("booking_heading", "Let's discuss your project")}
              </h1>
              <p className="text-lg text-vice-400 max-w-2xl mx-auto font-light">
                {getText("booking_description", "Schedule a free consultation to explore how we can work together.")}
              </p>
            </div>
          </div>
        </section>

        {/* Card Hub */}
        <section className="pb-32">
          <div className="container-vice max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeUp_0.8s_ease-out]">
              {/* 30 Min Card */}
              {session30 && (
                <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10 border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-white/5 text-primary flex items-center justify-center rounded-2xl mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-light mb-2 text-white">30-Minute Meeting</h3>
                  <p className="text-vice-400 mb-8 text-sm leading-relaxed flex-grow font-light">
                    Initial introductions, quick consultations, or follow-up discussions regarding your project.
                  </p>
                  <button 
                    onClick={() => setSelectedSessionUrl(session30)}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-500"
                  >
                    Book Session
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 1 Hour Card */}
              {session60 && (
                <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10 border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-white/5 text-primary flex items-center justify-center rounded-2xl mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-light mb-2 text-white">1-Hour Session</h3>
                  <p className="text-vice-400 mb-8 text-sm leading-relaxed flex-grow font-light">
                    Deep-dive strategic session focused on tokenomics, GTM planning, or product architecture.
                  </p>
                  <button 
                    onClick={() => setSelectedSessionUrl(session60)}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-500"
                  >
                    Book Session
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* General Hub */}
              {sessionCustom && (
                <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10 border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-white/5 text-primary flex items-center justify-center rounded-2xl mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-light mb-2 text-white">General Hub</h3>
                  <p className="text-vice-400 mb-8 text-sm leading-relaxed flex-grow font-light">
                    Access full booking calendar for custom availability and special request sessions.
                  </p>
                  <button 
                    onClick={() => setSelectedSessionUrl(sessionCustom)}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-500"
                  >
                    Browse All
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 
         THE OVERLAY: This is where we definitively kill the scrollbars by using 
         fixed positioning and a dedicated no-scroll container.
      */}
      {selectedSessionUrl && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-4 md:p-10 animate-[fadeIn_0.5s_ease-out] overflow-hidden no-scrollbar">
           <div className="w-full max-w-5xl flex flex-col h-full max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 px-4">
                  <button 
                    onClick={() => setSelectedSessionUrl(null)}
                    className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-vice-400 hover:text-primary transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Selection
                  </button>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Booking Session</p>
                  </div>
              </div>
              
              <div className="flex-1 bg-[#0A0A0B] rounded-3xl border border-white/5 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <CalendlyEmbed url={selectedSessionUrl} />
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default Booking;
