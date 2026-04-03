import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { Zap, Trophy, MessageSquare, ArrowLeft, ArrowUpRight, Check, Calendar, Clock, ChevronRight } from "lucide-react";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";

const projectTypes = [
  "Tokenomics Design",
  "Go-to-Market Strategy",
  "Product Strategy",
  "Business Development",
  "Full Engagement",
];

const budgetRanges = [
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const Booking = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const { getText } = useTexts();
  const [step, setStep] = useState(1);
  const [selectedSessionUrl, setSelectedSessionUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    date: "",
    time: "",
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const session30 = getText("calendly_30min", "");
  const session60 = getText("calendly_60min", "");
  const sessionCustom = getText("calendly_custom", "");
  const hasCalendly = session30 || session60 || sessionCustom;

  // DEFINITIVE FIX: When Calendly is selected, lock the page scroll to zero
  useEffect(() => {
    if (selectedSessionUrl) {
      document.documentElement.classList.add("no-page-scroll");
      document.body.classList.add("no-page-scroll");
    } else {
      document.documentElement.classList.remove("no-page-scroll");
      document.body.classList.remove("no-page-scroll");
    }
    return () => {
      document.documentElement.classList.remove("no-page-scroll");
      document.body.classList.remove("no-page-scroll");
    };
  }, [selectedSessionUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <Layout>
      {/* 
        If Calendly is showing, we use a Special fixed layout with NO scrollbar possible. 
      */}
      {selectedSessionUrl ? (
        <section className="fixed inset-0 z-[60] bg-background flex flex-col pt-20 md:pt-24 animate-[fadeIn_0.4s_ease-out]">
          <div className="container-vice flex flex-col h-full pb-6">
            {/* Minimal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight">Schedule Your {selectedSessionUrl.includes('30min') ? '30-Min' : '1-Hour'} Session</h1>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Select a time below</p>
              </div>
              <button 
                onClick={() => setSelectedSessionUrl(null)}
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Change Session
              </button>
            </div>
            
            {/* The Zero-Scroll Card - It takes 100% of remaining space */}
            <div className="flex-1 min-h-0 bg-secondary/20 rounded-3xl border border-white/5 relative overflow-hidden no-scrollbar">
               <CalendlyEmbed url={selectedSessionUrl} />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Normal Layout for Hub selection */}
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
                  {getText("booking_heading", "Let's discuss your project")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {getText("booking_description", "Schedule a free consultation to explore how we can work together.")}
                </p>
              </div>
            </div>
          </section>

          <section className="pb-32">
            <div className="container-vice max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeUp_0.8s_ease-out]">
                {/* 30 Min Card */}
                {session30 && (
                  <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10">
                    <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_20px_rgba(255,207,0,0.2)]">
                      <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-light mb-2">30-Minute Meeting</h3>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-grow">
                      Initial introductions, quick consultations, or follow-up discussions regarding your project.
                    </p>
                    <button 
                      onClick={() => setSelectedSessionUrl(session30)}
                      className="w-full bg-white text-black py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-primary transition-all"
                    >
                      Book Session
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 1 Hour Card */}
                {session60 && (
                  <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10 border-primary/20">
                    <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_20px_rgba(255,207,0,0.2)]">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-light mb-2">1-Hour Session</h3>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-grow font-light">
                      Deep-dive strategic session focused on tokenomics, GTM planning, or product architecture.
                    </p>
                    <button 
                      onClick={() => setSelectedSessionUrl(session60)}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Book Session
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* General Inquiry */}
                {sessionCustom && (
                  <div className="group glass-card flex flex-col h-full hover:-translate-y-2 !p-10">
                    <div className="w-14 h-14 bg-white/10 text-white flex items-center justify-center rounded-2xl mb-8 group-hover:bg-white/20 transition-all">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-light mb-2">General Hub</h3>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-grow">
                      Access full booking calendar for custom availability and special request sessions.
                    </p>
                    <button 
                      onClick={() => setSelectedSessionUrl(sessionCustom)}
                      className="w-full border border-white/20 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Browse All
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Booking;
