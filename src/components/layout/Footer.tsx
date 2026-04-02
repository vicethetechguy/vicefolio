import { Link } from "react-router-dom";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import { useTexts } from "@/hooks/useTexts";

export const Footer = () => {
  const { getText } = useTexts();

  const footerLinks = [
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, url: getText("footer_linkedin_url", "https://linkedin.com") },
    { name: "Twitter", icon: Twitter, url: getText("footer_twitter_url", "https://twitter.com") },
    { name: "GitHub", icon: Github, url: getText("footer_github_url", "https://github.com") },
    { name: "Email", icon: Mail, url: getText("footer_email", "mailto:hello@victorchime.com") },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-vice py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  d="M16 4L4 12V20L16 28L28 20V12L16 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M16 12L10 16V20L16 24L22 20V16L16 12Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              {getText("footer_tagline", "Transforming ambitious ideas into successful Web3 ventures through strategic tokenomics and product leadership.")}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-medium">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-medium">
              Connect
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all rounded-2xl"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-light">
            © {new Date().getFullYear()} {getText("footer_copyright_name", "Victor Chime")}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
