import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-vice max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Agreement to Terms
                </h2>
                <p>
                  By accessing or using this website, you agree to be bound by these
                  Terms of Service. If you do not agree to these terms, please do not
                  use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Services
                </h2>
                <p>
                  Victor Chime provides strategic consulting services including
                  tokenomics design, go-to-market strategy, product strategy, and
                  business development for Web3 projects. All services are subject to
                  separate engagement agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Intellectual Property
                </h2>
                <p>
                  All content on this website, including text, graphics, logos, and
                  images, is the property of Victor Chime and is protected by
                  intellectual property laws. You may not reproduce, distribute, or
                  create derivative works without express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Limitation of Liability
                </h2>
                <p>
                  The information provided on this website is for general informational
                  purposes only. We make no warranties about the accuracy or
                  completeness of the information and shall not be liable for any
                  damages arising from its use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Governing Law
                </h2>
                <p>
                  These Terms of Service shall be governed by and construed in
                  accordance with applicable laws, without regard to conflict of law
                  principles.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Contact
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us at
                  hello@victorchime.com.
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

export default Terms;
