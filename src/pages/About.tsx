import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import victorPortrait from "@/assets/victor-chime.png";

const About = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [storyRef, storyInView] = useInView({ threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1 });

  const values = [
    {
      title: "Data-Driven",
      description:
        "Every strategic decision is backed by rigorous analysis and market research.",
    },
    {
      title: "Results-Focused",
      description:
        "Success is measured by tangible outcomes: TVL, user growth, and sustainable tokenomics.",
    },
    {
      title: "Ecosystem Thinking",
      description:
        "Building interconnected value across protocols, partners, and communities.",
    },
    {
      title: "Long-Term Vision",
      description:
        "Designing systems that compound value over years, not just quarters.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={heroRef}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${
              heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                About Me
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
                Building the future of decentralized economies
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm Victor Chime, a Business Developer and Tokenomist with 8+ years
                of experience helping Web3 ventures achieve sustainable growth. My
                approach combines rigorous economic modeling with practical go-to-market
                execution.
              </p>
            </div>
            <div className="relative">
              <img
                src={victorPortrait}
                alt="Victor Chime"
                className="w-full aspect-[3/4] object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-secondary/30">
        <div className="container-vice">
          <div
            ref={storyRef}
            className={`max-w-3xl transition-all duration-700 ${
              storyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
              My Journey
            </p>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                My journey into Web3 began in 2016 when I first encountered the
                potential of blockchain technology to reshape financial systems.
                Coming from a background in traditional finance and product management,
                I saw an opportunity to bridge the gap between cutting-edge technology
                and sustainable business models.
              </p>
              <p>
                Over the years, I've had the privilege of working with some of the
                most innovative protocols in DeFi, NFTs, and Layer 2 scaling solutions.
                Each project has reinforced my belief that successful tokenomics isn't
                just about mathematical models—it's about understanding human behavior,
                market dynamics, and long-term value creation.
              </p>
              <p>
                Today, I focus on helping founders and protocol teams navigate the
                complexities of token design, go-to-market strategy, and ecosystem
                development. My goal is simple: to help build ventures that create
                lasting value for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={valuesRef}
            className={`transition-all duration-700 ${
              valuesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Core Values
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-16">
              Principles that guide my work
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className={`border-t border-border pt-8 transition-all duration-700 ${
                    valuesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-2xl font-light mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
