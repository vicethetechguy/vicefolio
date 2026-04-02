import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { useTexts } from "@/hooks/useTexts";
import { useState } from "react";
import { Mail, Linkedin, Twitter, ArrowUpRight, Check } from "lucide-react";

const Contact = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
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

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-vice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column */}
            <div
              ref={headerRef}
              className={`transition-all duration-700 ${
                headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {getText("contact_label", "Contact")}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
                {getText("contact_heading", "Let's connect")}
              </h1>
              <p className="text-lg text-muted-foreground mb-12">
                {getText("contact_description", "Have a question or want to discuss a potential project? I'd love to hear from you.")}
              </p>

              <div className="space-y-6">
                <a
                  href={`mailto:${getText("contact_email", "hello@victorchime.com")}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all rounded-2xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{getText("contact_email_label", "Email")}</p>
                    <p className="group-hover:underline underline-offset-4 text-foreground font-light">
                      {getText("contact_email", "hello@victorchime.com")}
                    </p>
                  </div>
                </a>

                <a
                  href={getText("contact_linkedin_url", "https://linkedin.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all rounded-2xl">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{getText("contact_linkedin_label", "LinkedIn")}</p>
                    <p className="flex items-center gap-1 group-hover:underline underline-offset-4 text-foreground font-light">
                      Connect with me
                      <ArrowUpRight className="w-4 h-4" />
                    </p>
                  </div>
                </a>

                <a
                  href={getText("contact_twitter_url", "https://twitter.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all rounded-2xl">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{getText("contact_twitter_label", "Twitter/X")}</p>
                    <p className="flex items-center gap-1 group-hover:underline underline-offset-4 text-foreground font-light">
                      {getText("contact_twitter_handle", "Follow @victorchime")}
                      <ArrowUpRight className="w-4 h-4" />
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column - Form */}
            <div
              className={`transition-all duration-700 delay-200 ${
                headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2 font-medium">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl placeholder:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl placeholder:opacity-50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Company / Protocol</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl placeholder:opacity-50"
                      placeholder="Organization Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl placeholder:opacity-50"
                      placeholder="Regarding your services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Message *</label>
                    <textarea
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors resize-none rounded-2xl placeholder:opacity-50"
                      placeholder="How can I help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background py-4 hover:opacity-90 transition-opacity rounded-2xl font-medium shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center mb-8 rounded-full shadow-lg">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-light mb-4 text-foreground">{getText("contact_success_title", "Message Sent!")}</h2>
                  <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
                    {getText("contact_success_msg", "Thank you for reaching out. I'll get back to you within 24-48 hours.")}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-all"
                  >
                     Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
