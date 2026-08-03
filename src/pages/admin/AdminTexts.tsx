import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader } from "@/components/ui/media-uploader";
import { MediaGalleryUploader } from "@/components/ui/media-gallery-uploader";
import { PageHeader, SearchInput, LoadingState } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

interface TextItem {
    id: string;
    label: string;
    value: string;
}

const defaultTextSections: TextItem[] = [
    // ─── Homepage — Hero & Base ───
    { id: "hero_greeting", label: "🏠 Homepage — Greeting", value: "Hello" },
    { id: "hero_subtitle", label: "🏠 Homepage — Subtitle", value: "— It's Victor Chime, a Tokenomist & Product Strategist." },
    { id: "hero_role", label: "🏠 Homepage — Side Label", value: "Business Developer" },
    { id: "hero_stat_1_number", label: "🏠 Homepage — Stat 1 Number", value: "+200" },
    { id: "hero_stat_1_label", label: "🏠 Homepage — Stat 1 Label", value: "Project completed" },
    { id: "hero_stat_2_number", label: "🏠 Homepage — Stat 2 Number", value: "+50" },
    { id: "hero_stat_2_label", label: "🏠 Homepage — Stat 2 Label", value: "Startup raised" },
    { id: "hero_year", label: "🏠 Homepage — Year Label", value: "2026" },
    { id: "gallery_hero_bg", label: "🖼️ Homepage — Hero Gallery (Multiple Images/Videos)", value: "" },
    { id: "gallery_showreel", label: "🖼️ Homepage — Video Showreel / Demo Reel (Gallery)", value: "" },
    { id: "gallery_general", label: "🖼️ Site — General Gallery Section", value: "" },

    // ─── Homepage — Sections ───
    { id: "home_services_label", label: "🏠 Homepage — Services Label", value: "Services" },
    { id: "home_services_heading", label: "🏠 Homepage — Services Heading", value: "Strategic expertise for ambitious Web3 ventures" },
    { id: "home_cases_label", label: "🏠 Homepage — Case Studies Label", value: "Selected Work" },
    { id: "home_cases_heading", label: "🏠 Homepage — Case Studies Heading", value: "Case Studies" },
    { id: "home_partners_label", label: "🏠 Homepage — Partners Label", value: "Trusted by Industry Leaders" },
    { id: "home_testimonials_label", label: "🏠 Homepage — Testimonials Label", value: "Client Testimonials" },

    // ─── Homepage — CTA ───
    { id: "home_cta_heading", label: "🏠 Homepage — CTA Heading", value: "Ready to build something extraordinary?" },
    { id: "home_cta_description", label: "🏠 Homepage — CTA Description", value: "Let's discuss how strategic tokenomics and product leadership can accelerate your Web3 venture." },

    // ─── About Me — Content ───
    { id: "about_hero_heading", label: "👤 About — Hero Heading", value: "Building the future of decentralized economies" },
    { id: "about_hero_description", label: "👤 About — Hero Description", value: "I'm Victor Chime, a Business Developer and Tokenomist with 8+ years of experience helping Web3 ventures achieve sustainable growth. My approach combines rigorous economic modeling with practical go-to-market execution." },
    { id: "about_journey_p1", label: "👤 About — Journey Paragraph 1", value: "My journey into Web3 began in 2016 when I first encountered the potential of blockchain technology to reshape financial systems." },
    { id: "about_journey_p2", label: "👤 About — Journey Paragraph 2", value: "Over the years, I've had the privilege of working with some of the most innovative protocols in DeFi, NFTs, and Layer 2 scaling solutions." },
    { id: "about_journey_p3", label: "👤 About — Journey Paragraph 3", value: "Today, I focus on helping founders and protocol teams navigate the complexities of token design, go-to-market strategy, and ecosystem development." },
    { id: "about_values_heading", label: "👤 About — Values Heading", value: "Principles that guide my work" },
    { id: "gallery_about_profile", label: "👤 About — Profile Gallery (Multiple Photos/Videos)", value: "" },

    // ─── Portfolio — Content ───
    { id: "portfolio_heading", label: "📁 Portfolio — Heading", value: "Selected case studies" },
    { id: "portfolio_description", label: "📁 Portfolio — Description", value: "A collection of projects showcasing tokenomics design, go-to-market strategy, and ecosystem development across the Web3 landscape." },

    // ─── Services — Content ───
    { id: "services_heading", label: "⚙️ Services — Heading", value: "Strategic expertise for ambitious Web3 ventures" },
    { id: "services_description", label: "⚙️ Services — Description", value: "From tokenomics architecture to go-to-market execution, I provide comprehensive strategic support to help your project succeed." },
    { id: "services_cta_heading", label: "⚙️ Services — CTA Heading", value: "Ready to get started?" },
    { id: "services_cta_description", label: "⚙️ Services — CTA Description", value: "Book a free consultation to discuss your project and how I can help." },

    // ─── Blog — Content ───
    { id: "blog_heading", label: "📝 Blog — Heading", value: "Insights & Analysis" },
    { id: "blog_description", label: "📝 Blog — Description", value: "Thoughts on tokenomics, Web3 strategy, and building sustainable decentralized systems." },

    // ─── Booking — Content ───
    { id: "calendly_30min", label: "📅 Booking — Calendly 30-Min URL", value: "https://calendly.com/vicethetechguy/30min" },
    { id: "calendly_60min", label: "📅 Booking — Calendly 1-Hour URL", value: "" },
    { id: "calendly_custom", label: "📅 Booking — Other Session URL/Hub", value: "https://calendly.com/vicethetechguy" },
    { id: "booking_label", label: "📅 Booking — Label", value: "Book a Call" },
    { id: "booking_heading", label: "📅 Booking — Heading", value: "Let's discuss your project" },

    // ─── Contact — Content ───
    { id: "contact_label", label: "📬 Contact — Label", value: "Contact" },
    { id: "contact_heading", label: "📬 Contact — Heading", value: "Let's connect" },
    { id: "contact_email", label: "📬 Contact — Email Address", value: "hello@victorchime.com" },
    { id: "contact_linkedin_url", label: "📬 Contact — LinkedIn URL", value: "https://linkedin.com" },
    { id: "contact_twitter_url", label: "📬 Contact — Twitter/X URL", value: "https://twitter.com" },

    // ─── Footer — Content ───
    { id: "footer_tagline", label: "🦶 Footer — Tagline", value: "Strategic tokenomics and product leadership for Web3." },
    { id: "footer_copyright_name", label: "🦶 Footer — Copyright Name", value: "Victor Chime" },
];

export default function AdminTexts() {
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("texts").select("*");
            if (!error && data && data.length > 0) {
                const merged = defaultTextSections.map((def) => {
                    const found = data.find((d) => d.id === def.id);
                    return found ? { ...def, value: found.value } : def;
                });
                setTexts(merged);
            } else {
                setTexts(defaultTextSections);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (id: string, value: string) => {
        setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, value } : t)));
        setChangedIds((prev) => new Set(prev).add(id));
    };

    const handleSave = async () => {
        if (changedIds.size === 0) {
            toast.info("No changes to save");
            return;
        }
        setSaving(true);
        const toSave = texts.filter((t) => changedIds.has(t.id));
        const { error } = await supabase.from("texts").upsert(
            toSave.map((t) => ({ id: t.id, label: t.label, value: t.value }))
        );
        if (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save changes.");
        } else {
            toast.success(`Saved ${toSave.length} item(s)`);
            setChangedIds(new Set());
        }
        setSaving(false);
    };

    const { groups, groupOrder } = useMemo(() => {
        const q = search.trim().toLowerCase();
        const visible = q
            ? texts.filter((t) =>
                t.label.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q) ||
                t.value.toLowerCase().includes(q))
            : texts;
        const groups: Record<string, TextItem[]> = {};
        const groupOrder: string[] = [];
        visible.forEach((t) => {
            const match = t.label.match(/^(.*?) — /);
            const group = match ? match[1] : "Other";
            if (!groups[group]) { groups[group] = []; groupOrder.push(group); }
            groups[group].push(t);
        });
        return { groups, groupOrder };
    }, [texts, search]);

    if (loading) return <div className="p-8"><LoadingState label="Loading site content…" /></div>;

    return (
        <div className="relative">
            <div className="p-5 sm:p-8 max-w-4xl mx-auto w-full pb-28">
                <PageHeader
                    title="Text Config"
                    description="Edit every piece of text and media across your site. Only changed items are saved."
                />

                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search labels, keys, or content…"
                    className="mb-6 sm:w-96"
                />

                {groupOrder.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-12">No fields match your search.</p>
                )}

                <div className="space-y-10">
                    {groupOrder.map((group) => (
                        <section key={group}>
                            <h3 className="text-base font-semibold tracking-tight mb-3 flex items-center gap-2">
                                {group}
                                <span className="text-xs font-normal text-muted-foreground">
                                    {groups[group].length} field{groups[group].length !== 1 ? "s" : ""}
                                </span>
                            </h3>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                                {groups[group].map((text) => {
                                    const isMedia = text.id.startsWith("media_");
                                    const isGallery = text.id.startsWith("gallery_");
                                    const isLong = text.value.length > 80 || text.id.includes("paragraph") || text.id.includes("description") || text.id.includes("journey");
                                    const changed = changedIds.has(text.id);

                                    return (
                                        <div key={text.id} className={cn("p-4 transition-colors", changed && "bg-blue-50/50")}>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium text-gray-800">
                                                    {text.label.replace(/^.*? — /, "")}
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    {changed && (
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                            Edited
                                                        </span>
                                                    )}
                                                    <code className="text-[10px] text-gray-300">{text.id}</code>
                                                </div>
                                            </div>
                                            {isGallery ? (
                                                <MediaGalleryUploader
                                                    value={text.value}
                                                    onChange={(value) => handleChange(text.id, value)}
                                                    label=""
                                                />
                                            ) : isMedia ? (
                                                <MediaUploader value={text.value} onChange={(url) => handleChange(text.id, url)} label="" />
                                            ) : isLong ? (
                                                <Textarea
                                                    className="min-h-[110px] bg-gray-50 focus:bg-white border-gray-200 transition-colors"
                                                    value={text.value}
                                                    onChange={(e) => handleChange(text.id, e.target.value)}
                                                />
                                            ) : (
                                                <Input
                                                    className="bg-gray-50 focus:bg-white border-gray-200 transition-colors"
                                                    value={text.value}
                                                    onChange={(e) => handleChange(text.id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Sticky save bar */}
            <div className={cn(
                "fixed bottom-0 right-0 left-0 md:left-64 z-30 transition-transform duration-200",
                changedIds.size === 0 && "translate-y-full"
            )}>
                <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-4">
                    <div className="bg-zinc-950 text-white rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-4">
                        <span className="text-sm">
                            <strong>{changedIds.size}</strong> unsaved change{changedIds.size !== 1 ? "s" : ""}
                        </span>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-white text-zinc-950 hover:bg-gray-200 gap-2 h-9"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
