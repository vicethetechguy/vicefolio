import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, WordReveal, Magnetic } from "@/components/motion/primitives";
import { useTexts } from "@/hooks/useTexts";

export const CTASection = () => {
  const { getText } = useTexts();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        <div className="aurora-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full blur-3xl" />
        <div className="aurora-cool absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-70" />
      </div>

      <div className="container-vice relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <WordReveal
            text={getText("home_cta_heading", "Ready to build something extraordinary?")}
            className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-8 text-gradient-gold"
          />
          <Reveal delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {getText("home_cta_description", "Let's discuss how strategic tokenomics and product leadership can accelerate your Web3 venture.")}
            </p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Magnetic strength={0.4}>
                <Link
                  to="/booking"
                  className="group relative inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 text-xs uppercase font-bold tracking-widest rounded-[6px] overflow-hidden shadow-[0_0_30px_hsl(49_100%_50%/0.25)] hover:shadow-[0_0_50px_hsl(49_100%_50%/0.5)] hover:scale-105 transition-all duration-500"
                >
                  {/* Sheen sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out" />
                  <span className="relative">Schedule a Consultation</span>
                  <ArrowUpRight className="relative w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link
                  to="/contact"
                  className="border-shimmer inline-flex items-center justify-center gap-2 border border-white/20 px-10 py-5 text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300 rounded-full"
                >
                  Send a Message
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
