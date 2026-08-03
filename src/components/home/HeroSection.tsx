import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import victorPortrait from "@/assets/victor-chime.png";
import { useTexts } from "@/hooks/useTexts";
import { MediaCarousel } from "../MediaCarousel";
import { WordReveal, Counter, Reveal } from "@/components/motion/primitives";

export const HeroSection = () => {
  const { getText } = useTexts();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll-linked cinematics: portrait drifts up slower than scroll, text fades out
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* ── Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        <div className="aurora-gold absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full blur-3xl" />
        <div className="aurora-cool absolute top-1/3 -right-52 w-[36rem] h-[36rem] rounded-full blur-3xl" />
        <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container-vice relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-6rem)] items-center">
          {/* ── Left content ── */}
          <motion.div
            className="lg:col-span-6 xl:col-span-5 relative pt-12 lg:pt-0"
            style={reduced ? undefined : { opacity: textOpacity, y: textY }}
          >
            {/* Vertical role label */}
            <Reveal delay={0.2} x={-30} y={0} className="absolute left-0 top-24 hidden lg:block">
              <span className="vertical-text text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {getText("hero_role", "Business Developer")}
              </span>
            </Reveal>

            {/* Stats with animated counters */}
            <Reveal delay={0.3} className="flex gap-12 mb-8 lg:mb-16 lg:ml-12">
              <div>
                <p className="stat-number">
                  <Counter value={getText("hero_stat_1_number", "+200")} delay={0.6} />
                </p>
                <p className="stat-label">{getText("hero_stat_1_label", "Project completed")}</p>
              </div>
              <div>
                <p className="stat-number">
                  <Counter value={getText("hero_stat_2_number", "+50")} delay={0.8} />
                </p>
                <p className="stat-label">{getText("hero_stat_2_label", "Startup raised")}</p>
              </div>
            </Reveal>

            {/* Headline — word by word rise */}
            <div className="lg:ml-12">
              <WordReveal
                as="h1"
                text={getText("hero_greeting", "Hello")}
                className="hero-headline mb-6 text-gradient-gold"
                delay={0.4}
              />
              <Reveal delay={0.7}>
                <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md">
                  {getText("hero_subtitle", "— It's Victor Chime, a Tokenomist & Product Strategist.")}
                </p>
              </Reveal>
            </div>

            {/* Scroll indicator with animated line */}
            <Reveal delay={1} y={0} blur={false} className="absolute bottom-12 left-0 lg:left-12 hidden lg:flex items-center gap-3">
              <span className="scroll-indicator">Scroll down</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-primary" />
            </Reveal>

            {/* Year */}
            <Reveal
              delay={1.1} y={0} blur={false}
              className="absolute bottom-12 left-0 hidden lg:block"
            >
              <span
                className="text-xs text-muted-foreground tracking-widest inline-block"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {getText("hero_year", "2026")}
              </span>
            </Reveal>
          </motion.div>

          {/* ── Portrait with parallax + glow frame ── */}
          <motion.div
            className="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end items-end"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
          >
            {/* Glow ring behind portrait */}
            <div className="absolute right-1/4 top-1/3 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

            <motion.div
              className="relative w-full max-w-lg lg:max-w-none lg:w-auto will-change-transform"
              style={reduced ? undefined : { y: portraitY, scale: portraitScale }}
            >
              {getText("gallery_hero_bg", "") ? (
                <MediaCarousel
                  value={getText("gallery_hero_bg", "")}
                  itemClassName="w-full h-auto lg:h-[85vh] object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
                />
              ) : (
                <img
                  src={victorPortrait}
                  alt="Victor Chime - Business Developer & Tokenomist"
                  className="w-full h-auto lg:h-[85vh] object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <Reveal delay={1} y={0} blur={false} className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="scroll-indicator text-xs">Scroll down</span>
        <ArrowDown className="w-3 h-3 animate-bounce text-primary" />
      </Reveal>
    </section>
  );
};
