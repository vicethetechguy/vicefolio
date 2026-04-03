import { ArrowUpRight, Coins, Rocket, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Service {
  icon: string | any;
  title: string;
  description: string;
  id: string;
}

const iconMap: Record<string, any> = {
  Coins: Coins,
  Rocket: Rocket,
  BarChart3: BarChart3,
  Users: Users,
};

export const ServicesSection = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });
  const { getText } = useTexts();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section className="section-padding bg-[#0A0A0B]">
      <div className="container-vice">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-16 md:mb-24 transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {getText("home_services_label", "Services")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-3xl text-foreground">
            {getText("home_services_heading", "Strategic expertise for ambitious Web3 ventures")}
          </h2>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
             <div className="col-span-2 text-center py-20 bg-background text-muted-foreground">Loading services...</div>
          ) : services.map((service, index) => {
            const Icon = iconMap[service.icon] || Rocket;
            return (
              <div
                key={service.id}
                className={`transition-all duration-700 ${
                  gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link
                  to={`/services#${service.id}`}
                  className="group block glass-card h-full transition-all duration-500 hover:bg-white/5 active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                    <Icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light mb-4 flex items-center justify-between gap-3 text-white">
                    {service.title}
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
                  </h3>
                  <p className="text-vice-grey-400 leading-relaxed font-light group-hover:text-white/80 transition-colors duration-500">
                    {service.description}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            gridInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all rounded-2xl"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
