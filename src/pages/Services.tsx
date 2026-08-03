import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTexts } from "@/hooks/useTexts";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import {
  Reveal, WordReveal, Magnetic, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      id={service.id}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.21, 0.6, 0.35, 1] }}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 border-t border-border hover:border-primary/40 pt-16 transition-colors duration-700"
    >
      <div>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-[0_0_30px_hsl(49_100%_50%/0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <DynamicIcon
              icon={service.icon}
              alt={service.title}
              className="w-7 h-7 text-primary group-hover:text-black transition-colors duration-500"
            />
          </div>
          <span className="text-xs font-mono text-primary/50 tracking-widest">0{index + 1}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-light mb-4">
          {service.title}
        </h2>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {service.description}
        </p>
        <p className="text-2xl font-light text-primary">{service.price}</p>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-primary/60" />
          What's Included
        </h3>
        <motion.ul
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {service.features?.map((feature) => (
            <motion.li key={feature} variants={staggerItem} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </span>
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useTexts();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />
          <div className="aurora-gold absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl" />
          <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container-vice relative z-10">
          <div className="max-w-4xl">
            <Reveal y={20}>
              <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/60" />
                Services
              </p>
            </Reveal>
            <WordReveal
              as="h1"
              text={getText("services_heading", "Strategic expertise for ambitious Web3 ventures")}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
              delay={0.15}
            />
            <Reveal delay={0.5}>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {getText("services_description", "From tokenomics architecture to go-to-market execution, I provide comprehensive strategic support to help your project succeed.")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-20">
        <div className="container-vice">
          <div className="space-y-24">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No services available at the moment.
              </div>
            ) : (
              services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[26rem] rounded-full blur-3xl" />
          <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>
        <div className="container-vice text-center relative z-10">
          <WordReveal
            text={getText("services_cta_heading", "Ready to get started?")}
            className="text-4xl md:text-5xl font-light tracking-tight mb-8 text-gradient-gold"
          />
          <Reveal delay={0.3}>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
              {getText("services_cta_description", "Book a free consultation to discuss your project and how I can help.")}
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <Magnetic strength={0.4}>
              <Link
                to="/booking"
                className="group relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-5 text-xs uppercase font-bold tracking-widest rounded-full overflow-hidden shadow-[0_0_30px_hsl(49_100%_50%/0.25)] hover:shadow-[0_0_50px_hsl(49_100%_50%/0.5)] hover:scale-105 transition-all duration-500"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out" />
                <span className="relative">Schedule a Consultation</span>
                <ArrowUpRight className="relative w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
