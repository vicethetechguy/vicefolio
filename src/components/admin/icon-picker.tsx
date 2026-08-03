import React, { useState, useMemo, useRef } from "react";
import { Search, UploadCloud, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { iconLibrary, iconNames, isCustomIcon } from "@/lib/icon-library";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_ICON_MB = 2;

/**
 * Searchable icon grid for admin forms, with the option to upload a custom
 * icon from the device instead. Stores either the library key ("Coins") or the
 * public URL of the uploaded file — both are rendered by <DynamicIcon />.
 */
export function IconPicker({
    value,
    onChange,
    label = "Icon",
    bucket = "images",
    allowUpload = true,
}: {
    value: string | undefined;
    onChange: (name: string) => void;
    label?: string;
    bucket?: string;
    allowUpload?: boolean;
}) {
    const [query, setQuery] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return iconNames;
        return iconNames.filter((n) => n.toLowerCase().includes(q));
    }, [query]);

    const custom = isCustomIcon(value);

    const handleUpload = async (file: File) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file (PNG, JPG, SVG or WebP).");
            return;
        }
        if (file.size > MAX_ICON_MB * 1024 * 1024) {
            toast.error(`Icon must be under ${MAX_ICON_MB}MB.`);
            return;
        }

        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const fileName = `icons/${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
            onChange(publicUrl);
            toast.success("Custom icon uploaded");
        } catch (error: any) {
            console.error("Icon upload failed", error);
            toast.error(error.message || "Failed to upload icon");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                {value && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-100 rounded-full px-2.5 py-1">
                        <DynamicIcon icon={value} className="w-3.5 h-3.5" />
                        {custom ? "Custom upload" : value}
                    </span>
                )}
            </div>

            {/* Custom icon in use — show it with a way back to the library */}
            {custom ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={cn(
                        "flex items-center gap-4 rounded-lg border p-3 transition-colors",
                        dragOver ? "border-gray-900 bg-gray-50" : "border-gray-200 bg-gray-50/60"
                    )}
                >
                    <div className="w-14 h-14 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-2">
                        <DynamicIcon icon={value} className="w-full h-full" alt="Custom icon" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">Custom icon</p>
                        <p className="text-xs text-muted-foreground">
                            Uploaded from your device. Remove it to go back to the icon library.
                        </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={uploading}
                            onClick={() => inputRef.current?.click()}
                        >
                            {uploading
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <UploadCloud className="w-3.5 h-3.5" />}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search icons…"
                            className="pl-9 h-9"
                        />
                    </div>

                    <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/60 p-2">
                        {filtered.length === 0 ? (
                            <p className="col-span-8 text-center text-xs text-muted-foreground py-6">
                                No icons match "{query}"
                            </p>
                        ) : filtered.map((name) => {
                            const Icon = iconLibrary[name];
                            const active = value === name;
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    title={name}
                                    onClick={() => onChange(name)}
                                    className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center transition-all",
                                        active
                                            ? "bg-gray-900 text-white shadow-sm scale-105"
                                            : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                                    )}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </button>
                            );
                        })}
                    </div>

                    {allowUpload && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => !uploading && inputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer flex items-center justify-center gap-2 transition-colors",
                                dragOver
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50/60"
                            )}
                        >
                            {uploading
                                ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                                : <UploadCloud className="w-4 h-4 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">
                                {uploading
                                    ? "Uploading…"
                                    : `Or upload your own icon — PNG, SVG or JPG up to ${MAX_ICON_MB}MB`}
                            </span>
                        </div>
                    )}
                </>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
            />
        </div>
    );
}
