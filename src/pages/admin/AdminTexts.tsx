import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader } from "@/components/ui/media-uploader";

interface TextItem {
    id: string;
    label: string;
    value: string;
}

interface MediaConfig {
    id: string;
    label: string;
    url: string;
}

// ── Every editable text entry grouped by page ──────────────────────

const defaultTextSections: TextItem[] = [
    // ─── Homepage Hero ───
    { id: "hero_greeting", label: "🏠 Homepage — Greeting", value: "Hello" },
    { id: "hero_subtitle", label: "🏠 Homepage — Subtitle", value: "— It's Victor Chime, a Tokenomist & Product Strategist." },
    { id: "hero_role", label: "🏠 Homepage — Side Label", value: "Business Developer" },
    { id: "hero_stat_1_number", label: "🏠 Homepage — Stat 1 Number", value: "+200" },
    { id: "hero_stat_1_label", label: "🏠 Homepage — Stat 1 Label", value: "Project completed" },
    { id: "hero_stat_2_number", label: "🏠 Homepage — Stat 2 Number", value: "+50" },
    { id: "hero_stat_2_label", label: "🏠 Homepage — Stat 2 Label", value: "Startup raised" },
    { id: "hero_year", label: "🏠 Homepage — Year Label", value: "2026" },

    // ─── Homepage Services Section ───
    { id: "home_services_label", label: "🏠 Homepage — Services Label", value: "Services" },
    { id: "home_services_heading", label: "🏠 Homepage — Services Heading", value: "Strategic expertise for ambitious Web3 ventures" },

    // ─── Homepage Case Studies Section ───
    { id: "home_cases_label", label: "🏠 Homepage — Case Studies Label", value: "Selected Work" },
    { id: "home_cases_heading", label: "🏠 Homepage — Case Studies Heading", value: "Case Studies" },

    // ─── Homepage Partners Section ───
    { id: "home_partners_label", label: "🏠 Homepage — Partners Label", value: "Trusted by Industry Leaders" },

    // ─── Homepage Testimonials Section ───
    { id: "home_testimonials_label", label: "🏠 Homepage — Testimonials Label", value: "Client Testimonials" },

    // ─── Homepage CTA Section ───
    { id: "home_cta_heading", label: "🏠 Homepage — CTA Heading", value: "Ready to build something extraordinary?" },
    { id: "home_cta_description", label: "🏠 Homepage — CTA Description", value: "Let's discuss how strategic tokenomics and product leadership can accelerate your Web3 venture." },

    // ─── About Me Page ───
    { id: "about_hero_heading", label: "👤 About — Hero Heading", value: "Building the future of decentralized economies" },
    { id: "about_hero_description", label: "👤 About — Hero Description", value: "I'm Victor Chime, a Business Developer and Tokenomist with 8+ years of experience helping Web3 ventures achieve sustainable growth. My approach combines rigorous economic modeling with practical go-to-market execution." },
    { id: "about_journey_p1", label: "👤 About — Journey Paragraph 1", value: "My journey into Web3 began in 2016 when I first encountered the potential of blockchain technology to reshape financial systems. Coming from a background in traditional finance and product management, I saw an opportunity to bridge the gap between cutting-edge technology and sustainable business models." },
    { id: "about_journey_p2", label: "👤 About — Journey Paragraph 2", value: "Over the years, I've had the privilege of working with some of the most innovative protocols in DeFi, NFTs, and Layer 2 scaling solutions. Each project has reinforced my belief that successful tokenomics isn't just about mathematical models—it's about understanding human behavior, market dynamics, and long-term value creation." },
    { id: "about_journey_p3", label: "👤 About — Journey Paragraph 3", value: "Today, I focus on helping founders and protocol teams navigate the complexities of token design, go-to-market strategy, and ecosystem development. My goal is simple: to help build ventures that create lasting value for all stakeholders." },
    { id: "about_values_heading", label: "👤 About — Values Heading", value: "Principles that guide my work" },

    // ─── Portfolio Page ───
    { id: "portfolio_heading", label: "📁 Portfolio — Heading", value: "Selected case studies" },
    { id: "portfolio_description", label: "📁 Portfolio — Description", value: "A collection of projects showcasing tokenomics design, go-to-market strategy, and ecosystem development across the Web3 landscape." },

    // ─── Services Page ───
    { id: "services_heading", label: "⚙️ Services — Heading", value: "Strategic expertise for ambitious Web3 ventures" },
    { id: "services_description", label: "⚙️ Services — Description", value: "From tokenomics architecture to go-to-market execution, I provide comprehensive strategic support to help your project succeed." },
    { id: "services_cta_heading", label: "⚙️ Services — CTA Heading", value: "Ready to get started?" },
    { id: "services_cta_description", label: "⚙️ Services — CTA Description", value: "Book a free consultation to discuss your project and how I can help." },

    // ─── Blog Page ───
    { id: "blog_heading", label: "📝 Blog — Heading", value: "Insights & Analysis" },
    { id: "blog_description", label: "📝 Blog — Description", value: "Thoughts on tokenomics, Web3 strategy, and building sustainable decentralized systems." },

    // ─── Booking Page ───
    { id: "calendly_30min", label: "📅 Booking — Calendly 30-Min URL", value: "https://calendly.com/vicethetechguy/30min" },
    { id: "calendly_60min", label: "📅 Booking — Calendly 1-Hour URL", value: "" },
    { id: "calendly_custom", label: "📅 Booking — Other Session URL/Hub", value: "https://calendly.com/vicethetechguy" },
    { id: "booking_label", label: "📅 Booking — Label", value: "Book a Call" },
    { id: "booking_heading", label: "📅 Booking — Heading", value: "Let's discuss your project" },
    { id: "booking_description", label: "📅 Booking — Description", value: "Schedule a free 30-minute consultation to explore how we can work together." },
    { id: "booking_step1_title", label: "📅 Booking — Step 1 Title", value: "What type of project are you working on?" },
    { id: "booking_step1_subtitle", label: "📅 Booking — Step 1 Subtitle", value: "What's your estimated budget?" },
    { id: "booking_step2_title", label: "📅 Booking — Step 2 Title", value: "Select a date" },
    { id: "booking_step2_subtitle", label: "📅 Booking — Step 2 Subtitle", value: "Select a time" },
    { id: "booking_success_title", label: "📅 Booking — Success Title", value: "Booking Confirmed!" },
    { id: "booking_success_msg", label: "📅 Booking — Success Message", value: "You'll receive a confirmation email shortly with the meeting details." },

    // ─── Contact Page ───
    { id: "contact_label", label: "📬 Contact — Label", value: "Contact" },
    { id: "contact_heading", label: "📬 Contact — Heading", value: "Let's connect" },
    { id: "contact_description", label: "📬 Contact — Description", value: "Have a question or want to discuss a potential project? I'd love to hear from you." },
    { id: "contact_email_label", label: "📬 Contact — Email Label", value: "Email" },
    { id: "contact_email", label: "📬 Contact — Email Address", value: "hello@victorchime.com" },
    { id: "contact_linkedin_label", label: "📬 Contact — LinkedIn Label", value: "LinkedIn" },
    { id: "contact_linkedin_url", label: "📬 Contact — LinkedIn URL", value: "https://linkedin.com" },
    { id: "contact_twitter_label", label: "📬 Contact — Twitter Label", value: "Twitter/X" },
    { id: "contact_twitter_url", label: "📬 Contact — Twitter/X URL", value: "https://twitter.com" },
    { id: "contact_twitter_handle", label: "📬 Contact — Twitter Handle text", value: "Follow @victorchime" },
    { id: "contact_success_title", label: "📬 Contact — Success Title", value: "Message Sent!" },
    { id: "contact_success_msg", label: "📬 Contact — Success Message", value: "Thank you for reaching out. I'll get back to you within 24-48 hours." },

    // ─── Footer ───
    { id: "footer_tagline", label: "🦶 Footer — Tagline", value: "Transforming ambitious ideas into successful Web3 ventures through strategic tokenomics and product leadership." },
    { id: "footer_copyright_name", label: "🦶 Footer — Copyright Name", value: "Victor Chime" },
    { id: "footer_linkedin_url", label: "🦶 Footer — LinkedIn URL", value: "https://linkedin.com" },
    { id: "footer_twitter_url", label: "🦶 Footer — Twitter/X URL", value: "https://twitter.com" },
    { id: "footer_github_url", label: "🦶 Footer — GitHub URL", value: "https://github.com" },
    { id: "footer_email", label: "🦶 Footer — Email", value: "mailto:hello@victorchime.com" },
];

const defaultMediaSections: MediaConfig[] = [
    { id: "hero_background", label: "Hero Background (Image or Video)", url: "" },
    { id: "about_profile", label: "About Me Profile Photo / Intro Video", url: "" },
    { id: "og_image", label: "Social Share / OG Image", url: "" },
    { id: "showreel", label: "Video Showreel / Demo Reel", url: "" },
];

export default function AdminTexts() {
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [mediaConfigs, setMediaConfigs] = useState<MediaConfig[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch texts
            const { data: textData, error: textError } = await supabase.from("texts").select("*");
            if (textError) {
                console.error("Error fetching texts:", textError);
                setTexts(defaultTextSections);
            } else if (textData && textData.length > 0) {
                const merged = defaultTextSections.map((def) => {
                    const found = textData.find((d) => d.id === def.id);
                    return found ? { ...def, value: found.value } : def;
                });
                setTexts(merged);
            } else {
                setTexts(defaultTextSections);
            }

            // Fetch media configs
            const { data: mediaData, error: mediaError } = await supabase.from("image_configs").select("*");
            if (mediaError) {
                console.error("Error fetching media configs:", mediaError);
                setMediaConfigs(defaultMediaSections);
            } else if (mediaData && mediaData.length > 0) {
                const merged = defaultMediaSections.map((def) => {
                    const found = mediaData.find((d: any) => d.id === def.id);
                    return found ? { ...def, url: found.url } : def;
                });
                setMediaConfigs(merged);
            } else {
                setMediaConfigs(defaultMediaSections);
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);

        const { error: textError } = await supabase.from("texts").upsert(
            texts.map((t) => ({ id: t.id, label: t.label, value: t.value }))
        );
        if (textError) {
            console.error("Error saving texts:", textError);
            toast.error("Failed to save text changes.");
            setSaving(false);
            return;
        }

        const { error: mediaError } = await supabase.from("image_configs").upsert(
            mediaConfigs.map((m) => ({ id: m.id, label: m.label, url: m.url }))
        );
        if (mediaError) {
            console.error("Error saving media configs:", mediaError);
            toast.error("Failed to save media changes.");
            setSaving(false);
            return;
        }

        toast.success("All changes saved successfully");
        setSaving(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    }

    // Group texts by page emoji prefix
    const groups: Record<string, TextItem[]> = {};
    const groupOrder: string[] = [];
    texts.forEach((t) => {
        const match = t.label.match(/^(.*?) — /);
        const group = match ? match[1] : "Other";
        if (!groups[group]) {
            groups[group] = [];
            groupOrder.push(group);
        }
        groups[group].push(t);
    });

    return (
        <div className="p-8 max-w-4xl max-h-screen overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Texts & Media</h2>
                    <p className="text-muted-foreground mt-2">Edit every piece of text across your website from one place.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            {/* Text Sections — grouped by page */}
            <div className="space-y-8 mb-10">
                {groupOrder.map((group) => (
                    <div key={group}>
                        <h3 className="text-lg font-semibold tracking-tight mb-4 border-b pb-2">{group}</h3>
                        <div className="space-y-4">
                            {groups[group].map((text) => {
                                const globalIndex = texts.findIndex((t) => t.id === text.id);
                                const shortLabel = text.label.replace(/^.*? — /, "");
                                const isLong = text.value.length > 80 || text.id.includes("paragraph") || text.id.includes("description") || text.id.includes("journey") || text.id.includes("tagline");

                                return (
                                    <Card key={text.id}>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">{shortLabel}</CardTitle>
                                            <CardDescription className="text-xs">{text.id}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isLong ? (
                                                <Textarea
                                                    className="min-h-[100px]"
                                                    defaultValue={text.value}
                                                    onChange={(e) => {
                                                        const updated = [...texts];
                                                        updated[globalIndex].value = e.target.value;
                                                        setTexts(updated);
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    defaultValue={text.value}
                                                    onChange={(e) => {
                                                        const updated = [...texts];
                                                        updated[globalIndex].value = e.target.value;
                                                        setTexts(updated);
                                                    }}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Media Sections */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold tracking-tight">Site Media (Images & Videos)</h3>
                {mediaConfigs.map((media, index) => (
                    <Card key={media.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{media.label}</CardTitle>
                            <CardDescription>Identifier: {media.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MediaUploader
                                value={media.url}
                                onChange={(url) => {
                                    const updated = [...mediaConfigs];
                                    updated[index].url = url;
                                    setMediaConfigs(updated);
                                }}
                                label=""
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
