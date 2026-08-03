import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useTexts } from "@/hooks/useTexts";
import victorPortrait from "@/assets/victor-chime.png";
import { supabase } from "@/lib/supabase";
import { MediaCarousel } from "@/components/MediaCarousel";
import {
  Reveal, WordReveal, Parallax, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface ValueProp {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

const About = () => {
  const { getText } = useTexts();

  const [values, setValues] = useState<ValueProp[]>([]);
  const [loadingValues, setLoadingValues] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      const { data, error } = await supabase
        .from("value_props")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching values:", error);
      } else {
        setValues(data || []);
      }
      setLoadingValues(false);
    };

    fetchValues();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />
          <div className="aurora-gold absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl" />
          <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container-vice relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal y={20}>
                <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-primary/60" />
                  About Me
                </p>
              </Reveal>
              <WordReveal
                as="h1"
                text={getText("about_hero_heading", "Building the future of decentralized economies")}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
                delay={0.15}
              />
              <Reveal delay={0.5}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {getText("about_hero_description", "I'm Victor Chime, a Business Developer and Tokenomist with 8+ years of experience helping Web3 ventures achieve sustainable growth. My approach combines rigorous economic modeling with practical go-to-market execution.")}
                </p>
              </Reveal>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
            >
              {/* Glow behind portrait */}
              <div className="absolute inset-8 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
              <Parallax speed={0.1}>
                {getText("gallery_about_profile", "") ? (
                  <MediaCarousel
                    value={getText("gallery_about_profile", "")}
                    itemClassName="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-1000 rounded-2xl"
                  />
                ) : (
                  <img
                    src={victorPortrait}
                    alt="Victor Chime"
                    className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-1000 rounded-2xl border border-white/5"
                  />
                )}
              </Parallax>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-secondary/30 relative overflow-hidden">
        <div className="aurora-cool absolute -bottom-52 -right-52 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container-vice relative z-10">
          <div className="max-w-3xl">
            <Reveal y={20}>
              <p className="text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/60" />
                My Journey
              </p>
            </Reveal>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {[
                getText("about_journey_p1", "My journey into Web3 began in 2016 when I first encountered the potential of blockchain technology to reshape financial systems. Coming from a background in traditional finance and product management, I saw an opportunity to bridge the gap between cutting-edge technology and sustainable business models."),
                getText("about_journey_p2", "Over the years, I've had the privilege of working with some of the most innovative protocols in DeFi, NFTs, and Layer 2 scaling solutions. Each project has reinforced my belief that successful tokenomics isn't just about mathematical models—it's about understanding human behavior, market dynamics, and long-term value creation."),
                getText("about_journey_p3", "Today, I focus on helping founders and protocol teams navigate the complexities of token design, go-to-market strategy, and ecosystem development. My goal is simple: to help build ventures that create lasting value for all stakeholders."),
              ].map((paragraph, i) => (
                <Reveal key={i} delay={0.1 + i * 0.15}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding relative overflow-hidden">
        <div className="container-vice">
          <Reveal y={20}>
            <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary/60" />
              Core Values
            </p>
          </Reveal>
          <WordReveal
            text={getText("about_values_heading", "Principles that guide my work")}
            className="text-4xl md:text-5xl font-light tracking-tight mb-16"
            delay={0.15}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {loadingValues ? (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-muted-foreground">
                Loading values...
              </div>
            ) : values.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-muted-foreground">
                No values entered yet.
              </div>
            ) : values.map((value, index) => (
              <motion.div
                key={value.id || value.title}
                variants={staggerItem}
                className="group border-t border-border pt-8 hover:border-primary/40 transition-colors duration-700"
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-xs font-mono text-primary/50 tracking-widest">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl font-light group-hover:text-primary transition-colors duration-500">
                    {value.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
