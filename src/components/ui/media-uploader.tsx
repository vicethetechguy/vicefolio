import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, X, ImageIcon, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "ogg"];
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"];

export function isVideoUrl(url: string): boolean {
    if (!url) return false;
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
    return VIDEO_EXTENSIONS.includes(ext);
}

export function isImageUrl(url: string): boolean {
    if (!url) return false;
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
    return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Inline preview for a media URL — renders <img> or <video> based on extension.
 * Used in both the uploader and table cells.
 */
export function MediaPreview({
    url,
    alt = "Media preview",
    className = "",
    compact = false,
}: {
    url: string;
    alt?: string;
    className?: string;
    compact?: boolean;
}) {
    if (!url) return null;

    if (isVideoUrl(url)) {
        return (
            <video
                src={url}
                controls={!compact}
                muted
                playsInline
                className={className}
                style={{ objectFit: "cover" }}
            >
                Your browser does not support the video tag.
            </video>
        );
    }

    return <img src={url} alt={alt} className={className} style={{ objectFit: "cover" }} />;
}

/**
 * Small thumbnail for table cells. Shows a play icon overlay for videos.
 */
export function MediaThumbnail({
    url,
    alt = "Thumbnail",
    size = 48,
}: {
    url: string;
    alt?: string;
    size?: number;
}) {
    if (!url) {
        return (
            <div
                className="rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs"
                style={{ width: size, height: size }}
            >
                N/A
            </div>
        );
    }

    const isVideo = isVideoUrl(url);

    return (
        <div
            className="relative rounded-md overflow-hidden bg-muted"
            style={{ width: size, height: size }}
        >
            {isVideo ? (
                <>
                    <video
                        src={url}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                </>
            ) : (
                <img src={url} alt={alt} className="w-full h-full object-cover" />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */

interface MediaUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    bucket?: string;
    label?: string;
    className?: string;
    /** Maximum file size in MB (default 50) */
    maxSizeMB?: number;
}

export function MediaUploader({
    value,
    onChange,
    bucket = "images",
    label = "Upload Image or Video",
    className = "",
    maxSizeMB = 50,
}: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Validate type
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
            toast.error("Please select a valid image or video file.");
            return;
        }

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File must be under ${maxSizeMB}MB.`);
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(fileName);

            onChange(publicUrl);
            toast.success(`${isVideo ? "Video" : "Image"} uploaded successfully`);
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error.message || "Failed to upload file");
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);
    const handleRemove = () => onChange("");

    const hasValue = !!value;
    const valueIsVideo = hasValue && isVideoUrl(value!);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="text-sm font-medium">{label}</label>}

            {hasValue ? (
                <div className="relative group rounded-lg overflow-hidden border bg-muted/20">
                    {valueIsVideo ? (
                        <video
                            src={value}
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full max-h-[260px] object-contain bg-black"
                        />
                    ) : (
                        <img
                            src={value}
                            alt="Uploaded preview"
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="shadow-md"
                        >
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                                <UploadCloud className="w-4 h-4 mr-1" />
                            )}
                            Replace
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            className="shadow-md"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-6 cursor-pointer
                        flex flex-col items-center justify-center gap-2
                        transition-colors
                        ${
                            dragOver
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/20 hover:bg-muted/30"
                        }
                    `}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground font-medium">
                        {uploading ? "Uploading..." : "Click or drag file here"}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Images (PNG, JPG, WebP) or Videos (MP4, WebM, MOV) up to {maxSizeMB}MB
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
            />
        </div>
    );
}
