import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTexts } from "@/hooks/useTexts";
import { supabase } from "@/lib/supabase";
import { getIcon } from "@/lib/icon-library";
import { isVideoUrl } from "@/components/ui/media-uploader";
import {
  Reveal, WordReveal, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  slug: string;
  year: string;
  image_url?: string;
  icon?: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useTexts();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("year", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />
          <div className="aurora-gold absolute -top-40 -right-52 w-[36rem] h-[36rem] rounded-full blur-3xl" />
          <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container-vice relative z-10">
          <div className="max-w-4xl">
            <Reveal y={20}>
              <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/60" />
                Portfolio
              </p>
            </Reveal>
            <WordReveal
              as="h1"
              text={getText("portfolio_heading", "Selected case studies")}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
              delay={0.15}
            />
            <Reveal delay={0.45}>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {getText("portfolio_description", "A collection of projects showcasing tokenomics design, go-to-market strategy, and ecosystem development across the Web3 landscape.")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="pb-20 relative">
        <div className="container-vice">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading portfolio projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No projects found.
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {projects.map((project, index) => {
                const ProjectIcon = getIcon(project.icon, "Coins");
                return (
                <motion.article key={project.slug} variants={staggerItem}>
                  <Link to={`/portfolio/${project.slug}`} className="group block">
                    {/* Media */}
                    <div className="aspect-[4/3] mb-6 overflow-hidden relative rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors duration-700">
                      {project.image_url ? (
                        isVideoUrl(project.image_url) ? (
                          <video
                            src={project.image_url}
                            muted loop playsInline autoPlay
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                          />
                        ) : (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-vice-700 to-vice-800 group-hover:scale-105 transition-transform duration-1000 flex items-center justify-center">
                          <span className="text-6xl font-extralight text-vice-500 opacity-40">
                            {project.metric}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {project.metric && (
                        <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-black text-sm font-semibold shadow-[0_0_25px_hsl(49_100%_50%/0.5)]">
                            {project.metric}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      {/* Meta row: icon, index, category, year */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_hsl(49_100%_50%/0.4)] transition-all duration-500">
                          <ProjectIcon className="w-[18px] h-[18px] text-primary group-hover:text-black transition-colors duration-500" />
                        </span>
                        <span className="text-xs font-mono text-primary/50 tracking-widest shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="w-px h-4 bg-white/10 shrink-0" />
                        <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-500 truncate">
                          {project.category}
                        </p>
                        <span className="ml-auto text-xs text-muted-foreground font-mono shrink-0">
                          {project.year}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-light mb-2 relative inline-block">
                        {project.title}
                        <span className="absolute left-0 -bottom-0.5 w-full h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                        {project.description}
                      </p>
                    </div>
                  </Link>
                </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
