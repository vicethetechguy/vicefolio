import {
    Coins, Bitcoin, Wallet, Banknote, TrendingUp, LineChart, BarChart3, PieChart,
    CandlestickChart, Rocket, Target, Megaphone, Users, Handshake, Briefcase,
    Building2, Globe, Network, Link2, Layers, Boxes, Box, Database, Server,
    Cpu, CircuitBoard, Code2, Terminal, Shield, ShieldCheck, Lock, Key,
    Fingerprint, Zap, Flame, Sparkles, Star, Award, Trophy, Crown, Gem,
    Diamond, Lightbulb, Compass, Map, Flag, BookOpen, FileText, Newspaper,
    PenTool, MessageSquare, Send, Puzzle, Settings, Workflow, Orbit, Atom, Anchor,
    LucideIcon,
} from "lucide-react";

/**
 * Curated icon set shared by the public site and the admin panel.
 * Keys are stored in the database (services.icon, portfolio_projects.icon, blogs.icon).
 * Explicit imports keep the bundle tree-shakeable — do not import the full lucide map.
 */
export const iconLibrary: Record<string, LucideIcon> = {
    // Finance & tokens
    Coins, Bitcoin, Wallet, Banknote, TrendingUp, LineChart, BarChart3, PieChart, CandlestickChart,
    // Strategy & growth
    Rocket, Target, Megaphone, Users, Handshake, Briefcase, Building2, Globe,
    // Web3 & infrastructure
    Network, Link2, Layers, Boxes, Box, Database, Server, Cpu, CircuitBoard, Code2, Terminal,
    // Trust & security
    Shield, ShieldCheck, Lock, Key, Fingerprint,
    // Energy & accolades
    Zap, Flame, Sparkles, Star, Award, Trophy, Crown, Gem, Diamond,
    // Ideas & direction
    Lightbulb, Compass, Map, Flag,
    // Content & writing
    BookOpen, FileText, Newspaper, PenTool, MessageSquare, Send,
    // Misc
    Puzzle, Settings, Workflow, Orbit, Atom, Anchor,
};

export const iconNames = Object.keys(iconLibrary);

/** Resolve a stored icon name to its component, with a safe fallback. */
export function getIcon(name: string | undefined | null, fallback: keyof typeof iconLibrary = "Rocket"): LucideIcon {
    return (name && iconLibrary[name]) || iconLibrary[fallback];
}

/**
 * The `icon` column stores either a library key ("Coins") or, when the admin
 * uploads their own artwork, the public URL of that file. This tells the two apart.
 */
export function isCustomIcon(value: string | undefined | null): boolean {
    if (!value) return false;
    return /^(https?:)?\/\//i.test(value) || value.startsWith("/");
}
