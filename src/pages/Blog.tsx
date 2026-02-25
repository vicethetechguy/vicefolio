import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "The Future of Tokenomics: Beyond Simple Staking",
    excerpt:
      "Exploring how next-generation token models are moving beyond basic staking mechanisms to create more sustainable and engaging economic systems. We analyze ve-tokenomics, real yield models, and dynamic emission schedules that are reshaping DeFi.",
    category: "Tokenomics",
    date: "Jan 2, 2026",
    readTime: "8 min read",
    slug: "future-of-tokenomics",
  },
  {
    title: "Building Sustainable DeFi Protocols",
    excerpt:
      "A deep dive into the economic principles that separate successful DeFi protocols from those that fail to maintain long-term growth. Examining liquidity bootstrapping, incentive alignment, and treasury management strategies.",
    category: "DeFi",
    date: "Dec 18, 2025",
    readTime: "12 min read",
    slug: "sustainable-defi",
  },
  {
    title: "Go-to-Market Strategies for Web3 Products",
    excerpt:
      "How to successfully launch a Web3 product in a crowded market: lessons learned from 50+ protocol launches. Covers community building, influencer partnerships, and timing your TGE for maximum impact.",
    category: "Strategy",
    date: "Dec 5, 2025",
    readTime: "10 min read",
    slug: "gtm-web3",
  },
  {
    title: "The Role of Governance in Protocol Success",
    excerpt:
      "Why governance design matters more than ever, and how to build systems that enable meaningful community participation. From token-weighted voting to quadratic mechanisms and delegation frameworks.",
    category: "Governance",
    date: "Nov 22, 2025",
    readTime: "7 min read",
    slug: "governance-success",
  },
  {
    title: "Token Vesting Strategies That Work",
    excerpt:
      "Analyzing vesting schedules that align long-term incentives while maintaining market confidence and team retention. Includes case studies from successful L1s, DeFi protocols, and gaming projects.",
    category: "Tokenomics",
    date: "Nov 10, 2025",
    readTime: "9 min read",
    slug: "token-vesting",
  },
  {
    title: "Building Strategic Partnerships in Web3",
    excerpt:
      "A framework for identifying, approaching, and closing partnerships that create genuine value for all parties. Learn the art of ecosystem alignment and co-marketing in decentralized environments.",
    category: "Business Development",
    date: "Oct 28, 2025",
    readTime: "11 min read",
    slug: "strategic-partnerships",
  },
  {
    title: "Navigating Bear Markets: A Protocol Survival Guide",
    excerpt:
      "Strategies for maintaining runway, community engagement, and development momentum during market downturns. How the best protocols use bear markets to build competitive advantages.",
    category: "Strategy",
    date: "Oct 15, 2025",
    readTime: "14 min read",
    slug: "bear-market-survival",
  },
  {
    title: "The Economics of Layer 2 Scaling Solutions",
    excerpt:
      "Breaking down the tokenomics and value capture mechanisms of rollups, validiums, and other L2 architectures. Understanding sequencer revenue, MEV distribution, and sustainable fee models.",
    category: "Infrastructure",
    date: "Oct 1, 2025",
    readTime: "16 min read",
    slug: "l2-economics",
  },
  {
    title: "Community-First Product Development",
    excerpt:
      "How to leverage your community as a competitive moat while building products that genuinely serve user needs. Implementing feedback loops, governance proposals, and contributor incentives.",
    category: "Product",
    date: "Sep 18, 2025",
    readTime: "8 min read",
    slug: "community-first-product",
  },
  {
    title: "VC Relations in Web3: A Founder's Playbook",
    excerpt:
      "Navigating the unique dynamics of crypto fundraising—from seed rounds to strategic token sales. Building relationships with the right investors who add value beyond capital.",
    category: "Fundraising",
    date: "Sep 5, 2025",
    readTime: "13 min read",
    slug: "vc-relations-web3",
  },
  {
    title: "Designing Incentive-Compatible NFT Economies",
    excerpt:
      "Beyond floor prices: creating NFT ecosystems with genuine utility, sustainable royalties, and aligned stakeholder incentives. Lessons from gaming, identity, and membership applications.",
    category: "NFTs",
    date: "Aug 22, 2025",
    readTime: "10 min read",
    slug: "nft-economies",
  },
  {
    title: "Cross-Chain Expansion: When and How to Go Multi-Chain",
    excerpt:
      "The strategic calculus behind deploying on additional chains. Evaluating ecosystem fit, liquidity fragmentation risks, and the operational complexity of multi-chain protocols.",
    category: "Infrastructure",
    date: "Aug 8, 2025",
    readTime: "12 min read",
    slug: "cross-chain-expansion",
  },
];

const Blog = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={headerRef}
            className={`max-w-4xl transition-all duration-700 ${
              headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          <div ref={gridRef} className="space-y-0">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className={`border-t border-border transition-all duration-700 ${
                  gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  <div className="lg:col-span-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {post.category}
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
                    <p className="text-sm text-muted-foreground">{post.readTime}</p>
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
