import { Reveal } from "@/components/motion/primitives";
import { useTexts } from "@/hooks/useTexts";

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
  const { getText } = useTexts();

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 border-b border-border overflow-hidden relative">
      <Reveal className="container-vice mb-12" y={20}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
          {getText("home_partners_label", "Trusted by Industry Leaders")}
        </p>
      </Reveal>

      {/* Marquee with faded edges, pauses on hover */}
      <div className="relative mask-fade-x marquee-paused">
        <div className="flex animate-marquee-slow whitespace-nowrap will-change-transform">
          {[...partners, ...partners].map((partner, index) => (
            <span
              key={index}
              className="group mx-8 md:mx-16 inline-flex items-center gap-4 text-2xl md:text-3xl font-light text-foreground/40 hover:text-foreground transition-colors duration-500 cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_12px_hsl(49_100%_50%/0.8)] transition-all duration-500" />
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
