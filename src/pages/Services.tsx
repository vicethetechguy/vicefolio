import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { ArrowUpRight, Coins, Rocket, BarChart3, Users, Check } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "tokenomics",
    icon: Coins,
    title: "Tokenomics Design",
    description:
      "Comprehensive token economic models that align incentives, drive adoption, and maximize long-term value.",
    features: [
      "Token supply and distribution modeling",
      "Incentive mechanism design",
      "Vesting schedule optimization",
      "Staking and rewards architecture",
      "Economic simulation and stress testing",
      "Governance framework design",
    ],
    price: "From $15,000",
  },
  {
    id: "gtm",
    icon: Rocket,
    title: "Go-to-Market Strategy",
    description:
      "Strategic launch planning and execution to maximize adoption and market penetration.",
    features: [
      "Market positioning and messaging",
      "Launch timeline and milestones",
      "Community building strategy",
      "Influencer and KOL partnerships",
      "Exchange listing strategy",
      "Marketing campaign architecture",
    ],
    price: "From $12,000",
  },
  {
    id: "product",
    icon: BarChart3,
    title: "Product Strategy",
    description:
      "End-to-end product vision and roadmap development for protocols and dApps.",
    features: [
      "Product vision and positioning",
      "Feature prioritization framework",
      "User research and personas",
      "Competitive analysis",
      "Roadmap development",
      "KPI definition and tracking",
    ],
    price: "From $10,000",
  },
  {
    id: "bizdev",
    icon: Users,
    title: "Business Development",
    description:
      "Strategic partnership cultivation and ecosystem growth across the Web3 landscape.",
    features: [
      "Partnership strategy development",
      "Ecosystem mapping and targeting",
      "Integration facilitation",
      "Strategic alliance negotiation",
      "Cross-protocol collaboration",
      "Investor relations support",
    ],
    price: "From $8,000",
  },
];

const Services = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });

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
              Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              Strategic expertise for ambitious Web3 ventures
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              From tokenomics architecture to go-to-market execution, I provide
              comprehensive strategic support to help your project succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-20">
        <div className="container-vice">
          <div className="space-y-24">
            {services.map((service, index) => {
              const [ref, inView] = useInView({ threshold: 0.1 });
              return (
                <div
                  key={service.id}
                  id={service.id}
                  ref={ref}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 border-t border-border pt-16 transition-all duration-700 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div>
                    <service.icon className="w-10 h-10 mb-6 text-muted-foreground" />
                    <h2 className="text-3xl md:text-4xl font-light mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                      {service.description}
                    </p>
                    <p className="text-2xl font-light">{service.price}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                      What's Included
                    </h3>
                    <ul className="space-y-4">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-vice text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
            Ready to get started?
          </h2>
          <p className="text-lg text-background/70 mb-12 max-w-xl mx-auto">
            Book a free consultation to discuss your project and how I can help.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-background text-foreground px-10 py-5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Schedule a Consultation
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
