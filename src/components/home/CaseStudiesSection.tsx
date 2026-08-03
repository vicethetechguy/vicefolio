import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTexts } from "@/hooks/useTexts";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { isVideoUrl } from "@/components/ui/media-uploader";
import { ProjectLink, ProjectWebsiteTag } from "@/components/ProjectLink";
import {
  Reveal, WordReveal, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface CaseStudy {
  title: string;
  category: string;
  metric: string;
  description: string;
  slug: string;
  image_url?: string;
  website_url?: string;
  icon?: string;
}

export const CaseStudiesSection = () => {
  const { getText } = useTexts();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .limit(4)
        .order("year", { ascending: false });

      if (!error && data) {
        setCaseStudies(data);
      }
      setLoading(false);
    };
    fetchLatest();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-vice">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-6">
          <div>
            <Reveal y={20}>
              <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-primary/60" />
                {getText("home_cases_label", "Selected Work")}
              </p>
            </Reveal>
            <WordReveal
              text={getText("home_cases_heading", "Case Studies")}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight"
              delay={0.15}
            />
          </div>
          <Reveal delay={0.3} y={20}>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium link-underline"
            >
              View All Projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        {/* Case studies grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {loading ? (
            <div className="col-span-2 text-center py-10 text-muted-foreground">Loading projects...</div>
          ) : caseStudies.map((study, index) => {
            return (
            <motion.article key={study.slug} variants={staggerItem}>
              <ProjectLink
                websiteUrl={study.website_url}
                slug={study.slug}
                title={study.title}
                className="group block"
              >
                {/* Media */}
                <div className="aspect-[4/3] mb-6 overflow-hidden relative rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors duration-700">
                  {study.image_url ? (
                    isVideoUrl(study.image_url) ? (
                      <video
                        src={study.image_url}
                        muted loop playsInline autoPlay
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <img
                        src={study.image_url}
                        alt={study.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-vice-700 to-vice-800 group-hover:scale-105 transition-transform duration-1000 flex items-center justify-center">
                      <span className="px-8 text-center text-2xl font-extralight text-vice-500 opacity-40 line-clamp-4">
                        {study.metric}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Metric badge */}
                  {study.metric && (
                    <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <span className="inline-flex items-center max-w-full px-2.5 py-1 rounded-full bg-primary text-black text-[10px] leading-snug font-semibold shadow-[0_0_20px_hsl(49_100%_50%/0.45)] line-clamp-2 text-left">
                        {study.metric}
                      </span>
                    </div>
                  )}

                  {/* Corner arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Meta row: icon, index, category — metric sits here on mobile */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_hsl(49_100%_50%/0.4)] transition-all duration-500">
                      <DynamicIcon
                        icon={study.icon}
                        fallback="Coins"
                        alt={study.title}
                        className="w-[18px] h-[18px] text-primary group-hover:text-black transition-colors duration-500"
                      />
                    </span>
                    <span className="text-xs font-mono text-primary/50 tracking-widest shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="w-px h-4 bg-white/10 shrink-0" />
                    <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-500 truncate">
                      {study.category}
                    </p>
                    <span className="ml-auto md:hidden text-xs font-medium text-primary/70 max-w-[45%] truncate">
                      {study.metric}
                    </span>
                  </div>

                  {/* Title + description get the full width */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <h3 className="text-xl md:text-2xl font-light mb-2 text-foreground relative inline-block">
                        {study.title}
                        <span className="absolute left-0 -bottom-0.5 w-full h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                        {study.description}
                      </p>
                      <ProjectWebsiteTag websiteUrl={study.website_url} />
                    </div>
                    <span className="hidden md:block text-base lg:text-lg font-light text-foreground/40 group-hover:text-primary/80 transition-colors duration-700 shrink-0 max-w-[9rem] text-right leading-snug line-clamp-3">
                      {study.metric}
                    </span>
                  </div>
                </div>
              </ProjectLink>
            </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
