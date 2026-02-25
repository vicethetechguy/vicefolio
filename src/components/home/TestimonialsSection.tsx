import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useInView } from "@/hooks/useInView";

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

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [containerRef, inView] = useInView({ threshold: 0.1 });

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container-vice">
        <div
          ref={containerRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-background/60 mb-12 text-center">
            Client Testimonials
          </p>

          <div className="relative">
            <Quote className="w-12 h-12 text-background/20 absolute -top-6 -left-6" />

            <blockquote
              key={current}
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-center mb-12 animate-[fadeIn_0.5s_ease-out]"
            >
              "{testimonials[current].quote}"
            </blockquote>

            <div
              key={`author-${current}`}
              className="text-center animate-[fadeIn_0.5s_ease-out_0.2s_both]"
            >
              <p className="text-lg font-medium">{testimonials[current].author}</p>
              <p className="text-background/60 text-sm">
                {testimonials[current].role}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-8 mt-16">
            <button
              onClick={prev}
              className="w-12 h-12 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current ? "bg-background w-8" : "bg-background/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
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
