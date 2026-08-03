import { Layout } from "@/components/layout/Layout";
import { useTexts } from "@/hooks/useTexts";
import { useState } from "react";
import { Mail, Linkedin, Twitter, ArrowUpRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, WordReveal, staggerContainer, staggerItem } from "@/components/motion/primitives";

const inputClasses =
  "w-full border border-border bg-transparent px-4 py-3 focus:border-primary focus:shadow-[0_0_20px_hsl(49_100%_50%/0.08)] focus:outline-none transition-all duration-300 rounded-2xl placeholder:opacity-50";

const Contact = () => {
  const { getText } = useTexts();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactLinks = [
    {
      icon: Mail,
      href: `mailto:${getText("contact_email", "hello@victorchime.com")}`,
      label: getText("contact_email_label", "Email"),
      text: getText("contact_email", "hello@victorchime.com"),
      external: false,
    },
    {
      icon: Linkedin,
      href: getText("contact_linkedin_url", "https://linkedin.com"),
      label: getText("contact_linkedin_label", "LinkedIn"),
      text: "Connect with me",
      external: true,
    },
    {
      icon: Twitter,
      href: getText("contact_twitter_url", "https://twitter.com"),
      label: getText("contact_twitter_label", "Twitter/X"),
      text: getText("contact_twitter_handle", "Follow @victorchime"),
      external: true,
    },
  ];

  return (
    <Layout>
      <section className="section-padding relative overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />
          <div className="aurora-gold absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl" />
          <div className="aurora-cool absolute -bottom-52 -right-52 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-70" />
          <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container-vice relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left column */}
            <div>
              <Reveal y={20}>
                <p className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-primary/60" />
                  {getText("contact_label", "Contact")}
                </p>
              </Reveal>
              <WordReveal
                as="h1"
                text={getText("contact_heading", "Let's connect")}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8"
                delay={0.15}
              />
              <Reveal delay={0.4}>
                <p className="text-lg text-muted-foreground mb-12">
                  {getText("contact_description", "Have a question or want to discuss a potential project? I'd love to hear from you.")}
                </p>
              </Reveal>

              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {contactLinks.map((item) => (
                  <motion.a
                    key={item.label}
                    variants={staggerItem}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 border border-border flex items-center justify-center rounded-2xl group-hover:border-primary group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_25px_hsl(49_100%_50%/0.35)] group-hover:scale-110 transition-all duration-500">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{item.label}</p>
                      <p className="flex items-center gap-1 text-foreground font-light relative">
                        <span className="relative">
                          {item.text}
                          <span className="absolute left-0 -bottom-0.5 w-full h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </span>
                        {item.external && <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right column — form */}
            <Reveal delay={0.3}>
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm mb-2 font-medium">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClasses}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 font-medium">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClasses}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 font-medium">Company / Protocol</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={inputClasses}
                        placeholder="Organization Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 font-medium">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={inputClasses}
                        placeholder="Regarding your services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 font-medium">Message *</label>
                      <textarea
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`${inputClasses} resize-none`}
                        placeholder="How can I help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group relative w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium overflow-hidden shadow-[0_0_25px_hsl(49_100%_50%/0.2)] hover:shadow-[0_0_40px_hsl(49_100%_50%/0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out" />
                      <span className="relative">Send Message</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center h-full py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-primary text-black flex items-center justify-center mb-8 rounded-full shadow-[0_0_40px_hsl(49_100%_50%/0.5)]"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                    >
                      <Check className="w-8 h-8" />
                    </motion.div>
                    <h2 className="text-2xl font-light mb-4 text-foreground">{getText("contact_success_title", "Message Sent!")}</h2>
                    <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
                      {getText("contact_success_msg", "Thank you for reaching out. I'll get back to you within 24-48 hours.")}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-8 text-xs underline underline-offset-4 text-muted-foreground hover:text-primary transition-all"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
