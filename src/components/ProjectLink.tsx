import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { normalizeUrl, prettyUrl } from "@/lib/utils";

interface ProjectLinkProps {
  /** The project's public product website, if it has one. */
  websiteUrl?: string | null;
  /** Fallback in-app route slug. */
  slug: string;
  title?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps a portfolio card. When the project has a product website, the whole
 * card opens that site in a new tab; otherwise it falls back to the in-app
 * portfolio route.
 */
export const ProjectLink = ({ websiteUrl, slug, title, className, children }: ProjectLinkProps) => {
  const href = normalizeUrl(websiteUrl);

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={title ? `Visit the ${title} website (opens in a new tab)` : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={`/portfolio/${slug}`} className={className}>
      {children}
    </Link>
  );
};

/** Small "visit site" affordance shown under a project's description. */
export const ProjectWebsiteTag = ({ websiteUrl }: { websiteUrl?: string | null }) => {
  const host = prettyUrl(websiteUrl);
  if (!host) return null;

  return (
    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors duration-500">
      <ExternalLink className="w-3.5 h-3.5" />
      {host}
    </span>
  );
};
