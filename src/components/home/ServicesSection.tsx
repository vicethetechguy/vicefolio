import { ArrowUpRight, Coins, Rocket, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

const services = [
  {
    icon: Coins,
    title: "Tokenomics Design",
    description:
      "Strategic token economic models that drive sustainable growth, incentivize participation, and maximize value accrual.",
    link: "/services#tokenomics",
  },
  {
    icon: Rocket,
    title: "GTM Strategy",
    description:
      "Comprehensive go-to-market strategies tailored for Web3 products, from launch planning to ecosystem expansion.",
    link: "/services#gtm",
  },
  {
    icon: BarChart3,
    title: "Product Strategy",
    description:
      "End-to-end product roadmapping and management for protocols and decentralized applications.",
    link: "/services#product",
  },
  {
    icon: Users,
    title: "Business Development",
    description:
      "Partnership cultivation, ecosystem growth, and strategic relationship building across the Web3 landscape.",
    link: "/services#bizdev",
  },
];

export const ServicesSection = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-vice">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-16 md:mb-24 transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Services
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-3xl">
            Strategic expertise for ambitious Web3 ventures
          </h2>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`transition-all duration-700 ${
                gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link
                to={service.link}
                className="group block bg-background p-8 md:p-12 lg:p-16 h-full transition-colors hover:bg-secondary/50"
              >
                <service.icon className="w-8 h-8 mb-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-2xl md:text-3xl font-light mb-4 flex items-center gap-3">
                  {service.title}
                  <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            gridInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
