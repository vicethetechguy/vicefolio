import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { isVideoUrl } from "@/components/ui/media-uploader";

interface GalleryItem {
    id: string;
    url: string;
    filename: string;
    created_at: string;
}

export default function AdminImages() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: false });
        if (error) { toast.error("Failed to load gallery"); }
        else { setItems(data || []); }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
            toast.error("Please select an image or video file.");
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            toast.error("File must be under 50MB.");
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);

            const { error: dbError } = await supabase.from("images").insert([{ url: publicUrl, filename: file.name }]);
            if (dbError) throw dbError;

            toast.success(`${isVideo ? "Video" : "Image"} uploaded successfully`);
            fetchItems();
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (item: GalleryItem) => {
        try {
            const { error: dbError } = await supabase.from("images").delete().eq("id", item.id);
            if (dbError) throw dbError;

            try {
                const urlParts = item.url.split("/");
                const storedFileName = urlParts[urlParts.length - 1];
                if (storedFileName) {
                    await supabase.storage.from("images").remove([storedFileName]);
                }
            } catch (ignored) {}

            setItems(items.filter((i) => i.id !== item.id));
            toast.success("Deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading gallery...</div>;
    }

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                    <p className="text-muted-foreground mt-2">Upload and manage images and videos for your portfolio and blogs.</p>
                </div>
            </div>

            <Card className="mb-8 border-dashed border-2 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center p-0">
                    <label className="w-full flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-muted/50 transition-colors rounded-xl">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 text-muted-foreground mb-4 animate-spin" />
                        ) : (
                            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                        )}
                        <h3 className="text-lg font-medium mb-1">
                            {uploading ? "Uploading..." : "Drag & drop your file here"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Images (PNG, JPG, WebP) or Videos (MP4, WebM, MOV) up to 50MB</p>
                        <Button variant="secondary" asChild disabled={uploading}>
                            <span>Browse Files</span>
                        </Button>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                </CardContent>
            </Card>

            {items.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No media found. Upload one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => {
                        const isVideo = isVideoUrl(item.url);
                        return (
                            <div key={item.id} className="relative group rounded-lg overflow-hidden border bg-black">
                                {isVideo ? (
                                    <video
                                        src={item.url}
                                        controls
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className="w-full h-48 object-contain bg-black"
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={`Gallery item ${item.filename}`}
                                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="w-8 h-8 rounded-full shadow-lg"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-2 truncate flex items-center gap-1.5">
                                    {isVideo && <Play className="w-3 h-3 flex-shrink-0 fill-white" />}
                                    {item.filename}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
