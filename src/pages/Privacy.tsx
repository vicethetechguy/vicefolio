import { Layout } from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-vice max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Information We Collect
                </h2>
                <p>
                  We collect information you provide directly to us, such as when you
                  book a consultation, send us a message, or subscribe to our newsletter.
                  This may include your name, email address, company name, and any other
                  information you choose to provide.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our
                  services, to communicate with you about consultations and projects, and
                  to send you updates and marketing communications (with your consent).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Information Sharing
                </h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information
                  to third parties. We may share information with trusted third-party
                  service providers who assist us in operating our website and conducting
                  our business.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Data Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or
                  destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us
                  at hello@victorchime.com.
                </p>
              </section>

              <p className="text-sm">Last updated: January 1, 2026</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
