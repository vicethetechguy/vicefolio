import { ArrowUpRight, Coins, Rocket, BarChart3, Users, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Reveal, WordReveal, TiltCard, Magnetic, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface Service {
  icon: string;
  title: string;
  description: string;
  id: string;
}

const iconMap: Record<string, LucideIcon> = {
  Coins: Coins,
  Rocket: Rocket,
  BarChart3: BarChart3,
  Users: Users,
};

export const ServicesSection = () => {
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
    <section className="section-padding bg-[#0A0A0B] relative overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-gold absolute -bottom-64 -right-64 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container-vice relative z-10">
        {/* Section header */}
        <div className="mb-16 md:mb-24">
          <Reveal y={20}>
            <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary/60" />
              {getText("home_services_label", "Services")}
            </p>
          </Reveal>
          <WordReveal
            text={getText("home_services_heading", "Strategic expertise for ambitious Web3 ventures")}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-3xl text-foreground"
            delay={0.15}
          />
        </div>

        {/* Services grid — tilt cards with cursor glow */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {loading ? (
            <div className="col-span-2 text-center py-20 text-muted-foreground">Loading services...</div>
          ) : services.map((service) => {
            const Icon = iconMap[service.icon] || Rocket;
            return (
              <motion.div key={service.id} variants={staggerItem}>
                <TiltCard className="h-full">
                  <Link
                    to={`/services#${service.id}`}
                    className="group block glass-card h-full transition-all duration-500 hover:bg-white/5 hover:border-primary/30 hover:shadow-[0_20px_60px_-20px_hsl(49_100%_50%/0.15)] active:scale-[0.98]"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(49_100%_50%/0.4)]">
                      <Icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4 flex items-center justify-between gap-3 text-white">
                      {service.title}
                      <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                    </h3>
                    <p className="text-vice-grey-400 leading-relaxed font-light group-hover:text-white/80 transition-colors duration-500">
                      {service.description}
                    </p>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <Reveal delay={0.3} className="mt-16 text-center">
          <Magnetic>
            <Link
              to="/services"
              className="border-shimmer inline-flex items-center gap-2 text-sm font-medium border border-white/15 px-8 py-4 hover:bg-foreground hover:text-background transition-colors duration-300 rounded-2xl"
            >
              View All Services
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
};
