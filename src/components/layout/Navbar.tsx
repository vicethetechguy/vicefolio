import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "About Me", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
];

/* Curtain wipes down on open, back up on close */
const overlayVariants = {
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const, delay: 0.4 },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const listVariants = {
  closed: { transition: { staggerChildren: 0.06, staggerDirection: -1 as const } },
  open: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};

/* Links rise out of a clipping mask with a slight rotation */
const itemVariants = {
  closed: {
    y: "120%", rotate: 5, opacity: 0,
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] as const },
  },
  open: {
    y: "0%", rotate: 0, opacity: 1,
    transition: { duration: 0.75, ease: [0.21, 0.6, 0.35, 1] as const },
  },
};

const footerVariants = {
  closed: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } },
};

export const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent header at top; blurred glass once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on navigation, lock scroll while open
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Header stays ABOVE the menu overlay so the logo and X remain visible */}
      <header
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
          !open && scrolled
            ? "bg-background/60 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="container-vice flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground group-hover:text-primary transition-colors duration-500 group-hover:drop-shadow-[0_0_10px_hsl(49_100%_50%/0.5)]"
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

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-wide link-underline transition-colors ${
                  location.pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            to="/booking"
            className="hidden md:flex items-center gap-2 text-xs uppercase font-bold tracking-widest bg-primary text-primary-foreground px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,207,0,0.15)] hover:shadow-[0_0_30px_rgba(255,207,0,0.3)]"
          >
            Book A Call
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Hamburger — morphs into a gold X */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[7px]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.span
              className="block w-6 h-[2px] bg-foreground rounded-full origin-center"
              animate={open ? { rotate: 45, y: 4.5, backgroundColor: "hsl(49 100% 50%)" } : { rotate: 0, y: 0, backgroundColor: "hsl(0 0% 100%)" }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              className="block w-6 h-[2px] bg-foreground rounded-full origin-center"
              animate={open ? { rotate: -45, y: -4.5, backgroundColor: "hsl(49 100% 50%)" } : { rotate: 0, y: 0, backgroundColor: "hsl(0 0% 100%)" }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
          </button>
        </nav>
      </header>

      {/* ── Fullscreen cinematic menu ──
          Rendered in a portal on <body>: backdrop-filter on the header creates
          a CSS containing block that would otherwise clip this fixed overlay. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="md:hidden fixed inset-0 z-[80] bg-background flex flex-col"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Atmosphere */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)]" />
                <div className="aurora-gold absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl" />
                <div className="aurora-cool absolute -bottom-40 -left-32 w-[26rem] h-[26rem] rounded-full blur-3xl" />
                <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
              </div>

              {/* Links */}
              <motion.nav
                className="relative z-10 flex-1 flex flex-col justify-center px-8 pt-20"
                variants={listVariants}
              >
                {navLinks.map((link, i) => (
                  <div key={link.path} className="overflow-hidden py-1">
                    <motion.div variants={itemVariants} className="will-change-transform">
                      <Link
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`group flex items-baseline gap-4 text-5xl sm:text-6xl font-extralight tracking-tight leading-[1.15] transition-colors duration-300 ${
                          location.pathname === link.path
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        <span className="text-xs font-mono text-primary/50 tracking-widest translate-y-[-0.5em]">
                          0{i + 1}
                        </span>
                        <span className="relative">
                          {link.name}
                          <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </motion.nav>

              {/* Footer CTA */}
              <motion.div
                className="relative z-10 px-8 pb-12"
                variants={footerVariants}
              >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
                <Link
                  to="/booking"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-5 rounded-full text-xs uppercase font-bold tracking-widest shadow-[0_0_30px_hsl(49_100%_50%/0.3)] active:scale-95 transition-transform"
                >
                  Book A Call
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-6 tracking-widest uppercase">
                  Tokenomics · Strategy · Web3
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
