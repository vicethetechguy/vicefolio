import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface GalleryImage {
    id: string;
    url: string;
    filename: string;
    created_at: string;
}

export default function AdminImages() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("images")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching images:", error);
            toast.error("Failed to load images");
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

            // Insert directly into the database
            const { error: dbError } = await supabase
                .from("images")
                .insert([{ url: publicUrl, filename: file.name }]);

            if (dbError) throw dbError;

            toast.success("Image uploaded successfully");
            fetchImages();
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (image: GalleryImage) => {
        try {
            // Delete from database
            const { error: dbError } = await supabase
                .from("images")
                .delete()
                .eq("id", image.id);
            if (dbError) throw dbError;

            // Try to extract filename from URL and delete from storage
            try {
                const urlParts = image.url.split("/");
                const storedFileName = urlParts[urlParts.length - 1];
                if (storedFileName) {
                    await supabase.storage.from("images").remove([storedFileName]);
                }
            } catch (ignored) {
                // Ignore storage delete errors if DB delete succeeds
            }

            setImages(images.filter((img) => img.id !== image.id));
            toast.success("Image deleted");
        } catch (error: any) {
            console.error("Delete failed", error);
            toast.error(error.message || "Failed to delete image");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading images...</div>;
    }

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gallery Images</h2>
                    <p className="text-muted-foreground mt-2">Upload and manage images for your portfolio and blogs.</p>
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
                            {uploading ? "Uploading..." : "Drag & drop your image here"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">PNG, JPG or WebP up to 5MB</p>
                        <Button variant="secondary" asChild disabled={uploading}>
                            <span>Browse Files</span>
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                </CardContent>
            </Card>

            {images.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No images found. Upload one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden border">
                            <img
                                src={img.url}
                                alt={`Gallery item ${img.filename}`}
                                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="w-8 h-8 rounded-full"
                                    onClick={() => handleDelete(img)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-2 truncate">
                                {img.filename}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
