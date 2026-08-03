import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTexts } from "@/hooks/useTexts";
import { supabase } from "@/lib/supabase";
import { getIcon } from "@/lib/icon-library";
import {
  Reveal, WordReveal, staggerContainer, staggerItem,
} from "@/components/motion/primitives";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  slug: string;
  icon?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { getText } = useTexts();

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
                Blog
              </p>
            </Reveal>
            <WordReveal
              as="h1"
              text={getText("blog_heading", "Insights & Analysis")}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
              delay={0.15}
            />
            <Reveal delay={0.4}>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {getText("blog_description", "Thoughts on tokenomics, Web3 strategy, and building sustainable decentralized systems.")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Posts */}
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
            <motion.div
              className="space-y-0"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {posts.map((post, index) => {
                const PostIcon = getIcon(post.icon, "FileText");
                return (
                <motion.article
                  key={post.slug}
                  variants={staggerItem}
                  className="border-t border-border hover:border-primary/40 transition-colors duration-700"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative"
                  >
                    {/* Hover wash */}
                    <span className="absolute inset-0 -mx-6 rounded-2xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_hsl(49_100%_50%/0.4)] transition-all duration-500">
                          <PostIcon className="w-[18px] h-[18px] text-primary group-hover:text-black transition-colors duration-500" />
                        </span>
                        <span className="text-xs font-mono text-primary/50 tracking-widest">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-500">
                        {post.category || "General"}
                      </p>
                    </div>
                    <div className="lg:col-span-7">
                      <h2 className="text-2xl md:text-3xl font-light mb-4 relative inline-block group-hover:translate-x-2 transition-transform duration-500">
                        {post.title}
                        <span className="absolute left-0 -bottom-1 w-full h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </h2>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <div className="lg:col-span-3 flex lg:flex-col lg:items-end gap-4 lg:gap-2">
                      <p className="text-sm text-muted-foreground font-mono">{post.date}</p>
                      <p className="text-sm text-muted-foreground">{post.read_time}</p>
                      <span className="hidden lg:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:border-primary group-hover:text-primary transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
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

export default Blog;
