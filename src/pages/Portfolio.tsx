import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  slug: string;
  year: string;
}

const Portfolio = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={headerRef}
            className={`max-w-4xl transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading portfolio projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No projects found.
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <article
                  key={project.slug}
                  className={`transition-all duration-700 ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
