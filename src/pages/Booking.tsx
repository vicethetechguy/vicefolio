import { Layout } from "@/components/layout/Layout";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { Zap, Trophy, MessageSquare, ArrowLeft, ArrowUpRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { Reveal, WordReveal, staggerContainer, staggerItem } from "@/components/motion/primitives";

const Booking = () => {
  const { getText } = useTexts();
  const [selectedSessionUrl, setSelectedSessionUrl] = useState<string | null>(null);

  const session30 = getText("calendly_30min", "");
  const session60 = getText("calendly_60min", "");
  const sessionCustom = getText("calendly_custom", "");

  // Global scroll lock for the whole page when booking is active
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

  const sessions: { url: string; icon: LucideIcon; title: string; description: string; cta: string }[] = [
    ...(session30 ? [{
      url: session30, icon: Zap, title: "30-Minute Meeting",
      description: "Initial introductions, quick consultations, or follow-up discussions regarding your project.",
      cta: "Book Session",
    }] : []),
    ...(session60 ? [{
      url: session60, icon: Trophy, title: "1-Hour Session",
      description: "Deep-dive strategic session focused on tokenomics, GTM planning, or product architecture.",
      cta: "Book Session",
    }] : []),
    ...(sessionCustom ? [{
      url: sessionCustom, icon: MessageSquare, title: "General Hub",
      description: "Access full booking calendar for custom availability and special request sessions.",
      cta: "Browse All",
    }] : []),
  ];

  return (
    <Layout>
      <div className={`transition-all duration-700 ${selectedSessionUrl ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
        {/* Hero */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
            <div className="aurora-gold absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[30rem] rounded-full blur-3xl" />
            <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
          </div>

          <div className="container-vice relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Reveal y={20}>
                <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-primary/60" />
                  {getText("booking_label", "Book a Call")}
                  <span className="w-8 h-px bg-primary/60" />
                </p>
              </Reveal>
              <WordReveal
                as="h1"
                text={getText("booking_heading", "Let's discuss your project")}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 text-white"
                delay={0.15}
              />
              <Reveal delay={0.45}>
                <p className="text-lg text-vice-400 max-w-2xl mx-auto font-light">
                  {getText("booking_description", "Schedule a free consultation to explore how we can work together.")}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Card hub */}
        <section className="pb-32">
          <div className="container-vice max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {sessions.map((session) => (
                <motion.div key={session.title} variants={staggerItem} className="h-full">
                  <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10 border-white/5 hover:border-primary/30 hover:shadow-[0_25px_60px_-20px_hsl(49_100%_50%/0.15)] transition-all duration-500">
                    <div className="w-14 h-14 bg-white/5 text-primary flex items-center justify-center rounded-2xl mb-8 group-hover:bg-primary group-hover:text-black group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_30px_hsl(49_100%_50%/0.4)] transition-all duration-500 shadow-xl">
                      <session.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-light mb-2 text-white">{session.title}</h3>
                    <p className="text-vice-400 mb-8 text-sm leading-relaxed flex-grow font-light">
                      {session.description}
                    </p>
                    <button
                      onClick={() => setSelectedSessionUrl(session.url)}
                      className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_25px_hsl(49_100%_50%/0.3)] transition-all duration-500"
                    >
                      {session.cta}
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* Booking overlay — fixed, no scrollbars */}
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
