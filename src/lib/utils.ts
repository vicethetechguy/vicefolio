import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalise a user-entered website address into a safe, absolute URL.
 * Accepts "naijaeats.com", "www.naijaeats.com", "https://naijaeats.com".
 * Returns null for empty values or unsafe schemes (javascript:, data:, etc).
 */
export function normalizeUrl(raw?: string | null): string | null {
  const value = (raw || "").trim();
  if (!value) return null;

  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Display form of a URL: "https://www.naijaeats.com/" -> "naijaeats.com" */
export function prettyUrl(raw?: string | null): string {
  const normalized = normalizeUrl(raw);
  if (!normalized) return "";
  try {
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
