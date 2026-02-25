import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "DeFi Protocol Launch",
    category: "Tokenomics",
    metric: "$42M TVL",
    description:
      "Designed comprehensive tokenomics for a lending protocol, including incentive mechanisms and governance structure. Achieved $42M TVL within 3 months of launch.",
    slug: "defi-protocol",
    year: "2024",
  },
  {
    title: "NFT Marketplace GTM",
    category: "Go-to-Market",
    metric: "180K Users",
    description:
      "Led go-to-market strategy for a creator-focused NFT marketplace. Developed influencer partnerships and community programs resulting in 180K users in Q1.",
    slug: "nft-marketplace",
    year: "2024",
  },
  {
    title: "L2 Ecosystem Growth",
    category: "Business Development",
    metric: "+340%",
    description:
      "Expanded ecosystem partnerships for a Layer 2 solution, driving 340% growth in developer activity and onboarding 50+ new protocols.",
    slug: "l2-ecosystem",
    year: "2023",
  },
  {
    title: "DAO Governance Design",
    category: "Product Strategy",
    metric: "95% Pass Rate",
    description:
      "Architected governance framework for a major DAO, achieving 95% proposal pass rate and 3x increase in voter participation.",
    slug: "dao-governance",
    year: "2023",
  },
  {
    title: "Token Migration",
    category: "Tokenomics",
    metric: "99.7% Migration",
    description:
      "Managed token migration and economic restructuring for a protocol upgrade, achieving 99.7% successful migration rate.",
    slug: "token-migration",
    year: "2023",
  },
  {
    title: "Cross-Chain Bridge",
    category: "Product Strategy",
    metric: "$120M Volume",
    description:
      "Product strategy and launch for a cross-chain bridge, reaching $120M in monthly volume within 6 months.",
    slug: "cross-chain-bridge",
    year: "2022",
  },
];

const Portfolio = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={headerRef}
            className={`max-w-4xl transition-all duration-700 ${
              headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              Selected case studies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A collection of projects showcasing tokenomics design, go-to-market
              strategy, and ecosystem development across the Web3 landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container-vice">
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className={`transition-all duration-700 ${
                  gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link to={`/portfolio/${project.slug}`} className="group block">
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-secondary mb-6 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-vice-200 to-vice-300 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                      <span className="text-6xl font-extralight text-vice-400">
                        {project.metric}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          {project.category}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-light mb-2 group-hover:underline underline-offset-4">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
