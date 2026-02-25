import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

export const CTASection = () => {
  const [containerRef, inView] = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding">
      <div className="container-vice">
        <div
          ref={containerRef}
          className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-8">
            Ready to build something extraordinary?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Let's discuss how strategic tokenomics and product leadership can
            accelerate your Web3 venture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-10 py-5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Schedule a Consultation
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-foreground px-10 py-5 text-sm font-medium hover:bg-foreground hover:text-background transition-all"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
