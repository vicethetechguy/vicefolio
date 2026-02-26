import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  slug: string;
}

const Blog = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "Published")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
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
              Blog
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              Insights & Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Thoughts on tokenomics, Web3 strategy, and building sustainable
              decentralized systems.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20">
        <div className="container-vice">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading insights...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No published blogs available at the moment.
            </div>
          ) : (
            <div ref={gridRef} className="space-y-0">
              {posts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`border-t border-border transition-all duration-700 ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    <div className="lg:col-span-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {post.category || "General"}
                      </p>
                    </div>
                    <div className="lg:col-span-7">
                      <h2 className="text-2xl md:text-3xl font-light mb-4 group-hover:underline underline-offset-4">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <div className="lg:col-span-3 flex lg:flex-col lg:items-end gap-4 lg:gap-2">
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                      <p className="text-sm text-muted-foreground">{post.read_time}</p>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
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

export default Blog;
