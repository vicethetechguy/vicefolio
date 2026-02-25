import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

const caseStudies = [
  {
    title: "DeFi Protocol Launch",
    category: "Tokenomics",
    metric: "$42M TVL",
    description: "Designed tokenomics for a lending protocol achieving $42M TVL in 3 months.",
    slug: "defi-protocol",
  },
  {
    title: "NFT Marketplace GTM",
    category: "Go-to-Market",
    metric: "180K Users",
    description: "Led go-to-market strategy resulting in 180K users within the first quarter.",
    slug: "nft-marketplace",
  },
  {
    title: "L2 Ecosystem Growth",
    category: "Business Development",
    metric: "+340%",
    description: "Expanded ecosystem partnerships driving 340% growth in developer activity.",
    slug: "l2-ecosystem",
  },
  {
    title: "DAO Governance Design",
    category: "Product Strategy",
    metric: "95% Pass Rate",
    description: "Architected governance framework achieving 95% proposal pass rate.",
    slug: "dao-governance",
  },
];

export const CaseStudiesSection = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding">
      <div className="container-vice">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Selected Work
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              Case Studies
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-medium link-underline"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Case Studies Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {caseStudies.map((study, index) => (
            <article
              key={study.slug}
              className={`transition-all duration-700 ${
                gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link to={`/portfolio/${study.slug}`} className="group block">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-secondary mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-vice-200 to-vice-300 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      {study.category}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light mb-2 group-hover:underline underline-offset-4">
                      {study.title}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      {study.description}
                    </p>
                  </div>
                  <span className="text-3xl md:text-4xl font-light text-muted-foreground">
                    {study.metric}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
