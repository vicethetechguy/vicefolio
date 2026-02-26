import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TextItem {
    id: string;
    label: string;
    value: string;
}

const defaultTextSections = [
    { id: "hero_title", label: "Hero Title", value: "Welcome to my Creative Portfolio" },
    { id: "hero_subtitle", label: "Hero Subtitle", value: "I build digital experiences that live on the web." },
    { id: "about_me", label: "About Me (Paragraph)", value: "I am a passionate developer and designer with over 5 years of experience in creating modern web applications..." },
];

export default function AdminTexts() {
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTexts = async () => {
            const { data, error } = await supabase.from("texts").select("*");
            if (error) {
                console.error("Error fetching texts:", error);
                toast.error("Failed to load texts.");
                setTexts(defaultTextSections);
            } else if (data && data.length > 0) {
                // Merge DB texts with any missing defaults
                const merged = defaultTextSections.map((def) => {
                    const found = data.find((d) => d.id === def.id);
                    return found ? found : def;
                });
                setTexts(merged);
            } else {
                setTexts(defaultTextSections);
            }
            setLoading(false);
        };
        fetchTexts();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase.from("texts").upsert(texts);

        if (error) {
            console.error("Error saving texts:", error);
            toast.error("Failed to save changes.");
        } else {
            toast.success("Saved successfully");
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading texts...</div>;
    }

    return (
        <div className="p-8 max-w-4xl max-h-screen overflow-y-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Texts</h2>
                    <p className="text-muted-foreground mt-2">Update the static text across your website.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            <div className="space-y-6">
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
        </div>
    );
}
