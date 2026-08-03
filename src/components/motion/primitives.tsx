import React, { useRef, useEffect, useState } from "react";
import {
    motion, useInView, useMotionValue, useSpring, useTransform,
    useScroll, useReducedMotion, MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ────────────────────────── Reveal ──────────────────────────
   Scroll-triggered entrance: fade + slide + blur-in. */

export function Reveal({
    children, delay = 0, y = 40, x = 0, duration = 0.9, once = true, className, blur = true,
}: {
    children: React.ReactNode; delay?: number; y?: number; x?: number;
    duration?: number; once?: boolean; className?: string; blur?: boolean;
}) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y, x, filter: blur ? "blur(8px)" : "none" }}
            whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
            viewport={{ once, margin: "-80px" }}
            transition={{ duration, delay, ease: [0.21, 0.6, 0.35, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ────────────────────────── WordReveal ──────────────────────────
   Headline that rises word-by-word from a clipping mask. */

export function WordReveal({
    text, className, delay = 0, stagger = 0.07, as: Tag = "h2",
}: {
    text: string; className?: string; delay?: number; stagger?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
    const reduced = useReducedMotion();
    const words = text.split(" ");
    const MotionTag = motion[Tag] as typeof motion.h2;

    if (reduced) return <Tag className={className}>{text}</Tag>;

    return (
        <MotionTag
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
            aria-label={text}
        >
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                    <motion.span
                        className="inline-block will-change-transform"
                        variants={{
                            hidden: { y: "110%", rotate: 4, opacity: 0 },
                            visible: {
                                y: "0%", rotate: 0, opacity: 1,
                                transition: { duration: 0.8, ease: [0.21, 0.6, 0.35, 1] },
                            },
                        }}
                    >
                        {word}
                    </motion.span>
                    {i < words.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </MotionTag>
    );
}

/* ────────────────────────── Counter ──────────────────────────
   Animated number that counts up when scrolled into view.
   Accepts strings like "+200", "$42M", "300%". */

export function Counter({
    value, className, duration = 1.8, delay = 0,
}: { value: string; className?: string; duration?: number; delay?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(value);

    const match = value.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);

    useEffect(() => {
        if (!inView || reduced || !match) { setDisplay(value); return; }
        const prefix = match[1], numStr = match[2].replace(/,/g, ""), suffix = match[3];
        const target = parseFloat(numStr);
        const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
        const start = performance.now() + delay * 1000;
        let raf: number;
        const tick = (now: number) => {
            const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, value]);

    return <span ref={ref} className={className}>{display}</span>;
}

/* ────────────────────────── Magnetic ──────────────────────────
   Wrapper that makes its child gravitate toward the cursor. */

export function Magnetic({
    children, strength = 0.35, className,
}: { children: React.ReactNode; strength?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

    const onMove = (e: React.MouseEvent) => {
        if (reduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            className={cn("inline-block", className)}
            style={{ x: sx, y: sy }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {children}
        </motion.div>
    );
}

/* ────────────────────────── TiltCard ──────────────────────────
   3D perspective tilt + cursor spotlight glow. */

export function TiltCard({
    children, className, maxTilt = 6, glow = true,
}: { children: React.ReactNode; className?: string; maxTilt?: number; glow?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 180, damping: 20 });
    const sry = useSpring(ry, { stiffness: 180, damping: 20 });
    const [spot, setSpot] = useState({ x: 50, y: 50, opacity: 0 });

    const onMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        if (!reduced) {
            ry.set((px - 0.5) * maxTilt * 2);
            rx.set((0.5 - py) * maxTilt * 2);
        }
        setSpot({ x: px * 100, y: py * 100, opacity: 1 });
    };
    const onLeave = () => {
        rx.set(0); ry.set(0);
        setSpot((s) => ({ ...s, opacity: 0 }));
    };

    return (
        <motion.div
            ref={ref}
            className={cn("relative [transform-style:preserve-3d] will-change-transform", className)}
            style={{ rotateX: srx, rotateY: sry, perspective: 800 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {glow && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 z-10"
                    style={{
                        opacity: spot.opacity,
                        background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, hsl(var(--primary) / 0.10), transparent 65%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    );
}

/* ────────────────────────── Parallax ──────────────────────────
   Scroll-linked vertical drift. speed > 0 moves slower than scroll. */

export function Parallax({
    children, speed = 0.15, className,
}: { children: React.ReactNode; speed?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [speed * 200, speed * -200]);

    return (
        <div ref={ref} className={className}>
            <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
        </div>
    );
}

/* ────────────────────────── useScrollProgress ────────────────────────── */

export function useSectionScroll(ref: React.RefObject<HTMLElement>): MotionValue<number> {
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    return scrollYProgress;
}

/* ────────────────────────── Stagger helpers ────────────────────────── */

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.21, 0.6, 0.35, 1] as const },
    },
};
