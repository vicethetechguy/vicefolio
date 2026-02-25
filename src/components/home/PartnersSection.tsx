import { useInView } from "@/hooks/useInView";

const partners = [
  "Polygon",
  "Arbitrum",
  "Chainlink",
  "Aave",
  "Uniswap",
  "OpenSea",
  "Alchemy",
  "Coinbase",
];

export const PartnersSection = () => {
  const [containerRef, inView] = useInView({ threshold: 0.1 });

  return (
    <section className="py-16 md:py-24 border-y border-border overflow-hidden">
      <div
        ref={containerRef}
        className={`container-vice mb-12 transition-all duration-700 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
          Trusted by Industry Leaders
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...partners, ...partners].map((partner, index) => (
            <span
              key={index}
              className="mx-8 md:mx-16 text-2xl md:text-3xl font-light text-muted-foreground/50 hover:text-foreground transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
};
