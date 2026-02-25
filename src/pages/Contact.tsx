import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import { Mail, Linkedin, Twitter, ArrowUpRight, Check } from "lucide-react";

const Contact = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
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
    // Handle form submission
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
                Contact
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
                Let's connect
              </h1>
              <p className="text-lg text-muted-foreground mb-12">
                Have a question or want to discuss a potential project? I'd love to
                hear from you.
              </p>

              <div className="space-y-6">
                <a
                  href="mailto:hello@victorchime.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="group-hover:underline underline-offset-4">
                      hello@victorchime.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <p className="flex items-center gap-1 group-hover:underline underline-offset-4">
                      Connect with me
                      <ArrowUpRight className="w-4 h-4" />
                    </p>
                  </div>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Twitter/X</p>
                    <p className="flex items-center gap-1 group-hover:underline underline-offset-4">
                      Follow @victorchime
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
                      <label className="block text-sm mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Company / Protocol</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Message *</label>
                    <textarea
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background py-4 hover:opacity-90 transition-opacity"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center mb-8">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-light mb-4">Message Sent!</h2>
                  <p className="text-muted-foreground text-center">
                    Thank you for reaching out. I'll get back to you within 24-48 hours.
                  </p>
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
