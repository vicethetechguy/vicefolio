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

const defaultTextSections = [
    { id: "hero_title", label: "Hero Title", value: "Welcome to my Creative Portfolio" },
    { id: "hero_subtitle", label: "Hero Subtitle", value: "I build digital experiences that live on the web." },
    { id: "about_me", label: "About Me (Paragraph)", value: "I am a passionate developer and designer with over 5 years of experience in creating modern web applications..." },
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
                    return found ? found : def;
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

        const { error: textError } = await supabase.from("texts").upsert(texts);
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

    return (
        <div className="p-8 max-w-4xl max-h-screen overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Texts & Media</h2>
                    <p className="text-muted-foreground mt-2">Update the static text, images, and videos across your website.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            {/* Text Sections */}
            <div className="space-y-6 mb-10">
                <h3 className="text-xl font-semibold tracking-tight">Text Content</h3>
                {texts.map((text, index) => (
                    <Card key={text.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{text.label}</CardTitle>
                            <CardDescription>Identifier: {text.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {text.value.length > 100 || text.id.includes("about") ? (
                                <Textarea
                                    className="min-h-[150px]"
                                    defaultValue={text.value}
                                    onChange={(e) => {
                                        const newTexts = [...texts];
                                        newTexts[index].value = e.target.value;
                                        setTexts(newTexts);
                                    }}
                                />
                            ) : (
                                <Input
                                    defaultValue={text.value}
                                    onChange={(e) => {
                                        const newTexts = [...texts];
                                        newTexts[index].value = e.target.value;
                                        setTexts(newTexts);
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
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
