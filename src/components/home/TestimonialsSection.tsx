import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/primitives";
import { useTexts } from "@/hooks/useTexts";

const testimonials = [
  {
    quote:
      "Victor's tokenomics expertise transformed our protocol. His strategic approach to incentive design directly contributed to our successful $15M raise.",
    author: "Sarah Chen",
    role: "CEO, Nexus Protocol",
  },
  {
    quote:
      "Working with Victor was a game-changer for our go-to-market strategy. His deep understanding of Web3 ecosystems helped us achieve product-market fit faster than expected.",
    author: "Marcus Webb",
    role: "Founder, ChainFlow",
  },
  {
    quote:
      "Victor's ability to bridge business development with technical understanding is rare. He helped us secure partnerships that drove 300% growth in our first year.",
    author: "Elena Rodriguez",
    role: "COO, MetaVerse Labs",
  },
];

const AUTOPLAY_MS = 7000;

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { getText } = useTexts();

  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay
  useEffect(() => {
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [current, go]);

  return (
    <section className="section-padding relative overflow-hidden border-y border-border">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] rounded-full blur-3xl opacity-50" />
        <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container-vice relative z-10">
        <div className="max-w-4xl mx-auto">
          <Reveal y={20}>
            <p className="text-xs uppercase tracking-widest text-primary mb-12 text-center flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-primary/60" />
              {getText("home_testimonials_label", "Client Testimonials")}
              <span className="w-8 h-px bg-primary/60" />
            </p>
          </Reveal>

          <div className="relative min-h-[280px] md:min-h-[300px]">
            <Quote className="w-16 h-16 text-primary/15 absolute -top-8 -left-4 md:-left-10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction * -60, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
              >
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-center mb-12 text-foreground">
                  "{testimonials[current].quote}"
                </blockquote>

                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">{testimonials[current].author}</p>
                  <p className="text-primary/80 text-sm mt-0.5">
                    {testimonials[current].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-8 mt-14">
            <button
              onClick={() => go(-1)}
              className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsl(49_100%_50%/0.2)] transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setDirection(index > current ? 1 : -1); setCurrent(index); }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === current
                      ? "bg-primary w-10 shadow-[0_0_10px_hsl(49_100%_50%/0.6)]"
                      : "bg-white/20 w-1.5 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsl(49_100%_50%/0.2)] transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
