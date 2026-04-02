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

// ── Every editable text and media entry ──────────────────────

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

    // ─── Homepage — Media ───
    { id: "media_hero_bg", label: "🖼️ Homepage — Hero Background (URL)", value: "" },
    { id: "media_showreel", label: "🖼️ Homepage — Video Showreel / Demo Reel (URL)", value: "" },

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
    { id: "about_journey_p1", label: "👤 About — Journey Paragraph 1", value: "" },
    { id: "about_journey_p2", label: "👤 About — Journey Paragraph 2", value: "" },
    { id: "about_journey_p3", label: "👤 About — Journey Paragraph 3", value: "" },
    { id: "about_values_heading", label: "👤 About — Values Heading", value: "Principles that guide my work" },
    
    // ─── About Me — Media ───
    { id: "media_about_profile", label: "🖼️ About — Profile Photo / Intro Video (URL)", value: "" },

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
    { id: "booking_description", label: "📅 Booking — Description", value: "Schedule a free 30-minute consultation to explore how we can work together." },
    { id: "booking_step1_title", label: "📅 Booking — Step 1 Title", value: "What type of project are you working on?" },
    { id: "booking_step1_subtitle", label: "📅 Booking — Step 1 Subtitle", value: "What's your estimated budget?" },
    { id: "booking_step2_title", label: "📅 Booking — Step 2 Title", value: "Select a date" },
    { id: "booking_step2_subtitle", label: "📅 Booking — Step 2 Subtitle", value: "Select a time" },
    { id: "booking_success_title", label: "📅 Booking — Success Title", value: "Booking Confirmed!" },
    { id: "booking_success_msg", label: "📅 Booking — Success Message", value: "You'll receive a confirmation email shortly with the meeting details." },

    // ─── Contact — Content ───
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

    // ─── Footer — Content ───
    { id: "footer_tagline", label: "🦶 Footer — Tagline", value: "Transforming ambitious ideas into successful Web3 ventures through strategic tokenomics and product leadership." },
    { id: "footer_copyright_name", label: "🦶 Footer — Copyright Name", value: "Victor Chime" },
    { id: "footer_linkedin_url", label: "🦶 Footer — LinkedIn URL", value: "https://linkedin.com" },
    { id: "footer_twitter_url", label: "🦶 Footer — Twitter/X URL", value: "https://twitter.com" },
    { id: "footer_github_url", label: "🦶 Footer — GitHub URL", value: "https://github.com" },
    { id: "footer_email", label: "🦶 Footer — Email", value: "mailto:hello@victorchime.com" },
];

export default function AdminTexts() {
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("texts").select("*");
            if (error) {
                console.error("Error fetching texts:", error);
                setTexts(defaultTextSections);
            } else if (data && data.length > 0) {
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

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from("texts").upsert(
            texts.map((t) => ({ id: t.id, label: t.label, value: t.value }))
        );
        
        if (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save changes. Please check your connection.");
        } else {
            toast.success("All changes saved successfully");
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    }

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
                    <h2 className="text-3xl font-bold tracking-tight">Global Content Config</h2>
                    <p className="text-muted-foreground mt-2">Manage all text and site-wide media URLs from one dashboard.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-vice-500 hover:bg-vice-600">
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            <div className="space-y-12 mb-10">
                {groupOrder.map((group) => (
                    <div key={group}>
                        <h3 className="text-xl font-semibold tracking-tight mb-4 border-b pb-2 flex items-center gap-2">
                             {group}
                        </h3>
                        <div className="space-y-4">
                            {groups[group].map((text) => {
                                const globalIndex = texts.findIndex((t) => t.id === text.id);
                                const shortLabel = text.label.replace(/^.*? — /, "");
                                const isMedia = text.id.startsWith("media_");
                                const isLong = text.value.length > 80 || text.id.includes("paragraph") || text.id.includes("description") || text.id.includes("journey") || text.id.includes("tagline");

                                return (
                                    <Card key={text.id} className="border-border/50">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-medium">{shortLabel}</CardTitle>
                                            <CardDescription className="text-[10px] uppercase opacity-50">{text.id}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isMedia ? (
                                                <MediaUploader
                                                    value={text.value}
                                                    onChange={(url) => {
                                                        const updated = [...texts];
                                                        updated[globalIndex].value = url;
                                                        setTexts(updated);
                                                    }}
                                                    label=""
                                                />
                                            ) : isLong ? (
                                                <Textarea
                                                    className="min-h-[120px] bg-secondary/30"
                                                    value={text.value}
                                                    onChange={(e) => {
                                                        const updated = [...texts];
                                                        updated[globalIndex].value = e.target.value;
                                                        setTexts(updated);
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    className="bg-secondary/30"
                                                    value={text.value}
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
        </div>
    );
}
