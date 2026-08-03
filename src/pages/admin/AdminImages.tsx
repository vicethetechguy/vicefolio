import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, Loader2, Play, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { isVideoUrl } from "@/components/ui/media-uploader";
import {
    PageHeader, SearchInput, FilterPills, LoadingState, EmptyState, ConfirmDialog,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

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
    const [dragOver, setDragOver] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: false });
        if (error) { toast.error("Failed to load gallery"); }
        else { setItems(data || []); }
        setLoading(false);
    };

    const filtered = useMemo(() => {
        let list = items;
        if (typeFilter === "Images") list = list.filter((i) => !isVideoUrl(i.url));
        if (typeFilter === "Videos") list = list.filter((i) => isVideoUrl(i.url));
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((i) => i.filename?.toLowerCase().includes(q));
        }
        return list;
    }, [items, search, typeFilter]);

    const uploadFiles = async (files: FileList | File[]) => {
        const valid = Array.from(files).filter((file) => {
            const ok = file.type.startsWith("image/") || file.type.startsWith("video/");
            if (!ok) toast.error(`${file.name}: not an image or video`);
            else if (file.size > 50 * 1024 * 1024) { toast.error(`${file.name}: over 50MB`); return false; }
            return ok;
        });
        if (valid.length === 0) return;

        setUploading(true);
        let success = 0;
        for (const file of valid) {
            try {
                const fileExt = file.name.split(".").pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
                const { error: dbError } = await supabase.from("images").insert([{ url: publicUrl, filename: file.name }]);
                if (dbError) throw dbError;
                success++;
            } catch (error: unknown) {
                console.error("Upload failed", error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        if (success > 0) {
            toast.success(`Uploaded ${success} file${success !== 1 ? "s" : ""}`);
            fetchItems();
        }
        setUploading(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const { error: dbError } = await supabase.from("images").delete().eq("id", deleteTarget.id);
            if (dbError) throw dbError;
            try {
                const storedFileName = deleteTarget.url.split("/").pop();
                if (storedFileName) await supabase.storage.from("images").remove([storedFileName]);
            } catch { /* storage cleanup best-effort */ }
            setItems(items.filter((i) => i.id !== deleteTarget.id));
            toast.success("Deleted");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to delete");
        }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const copyUrl = async (item: GalleryItem) => {
        try {
            await navigator.clipboard.writeText(item.url);
            setCopiedId(item.id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch {
            toast.error("Couldn't copy URL");
        }
    };

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader title="Gallery" description="Upload and manage images and videos used across your site." />

            {/* Upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
                onClick={() => !uploading && inputRef.current?.click()}
                className={cn(
                    "mb-6 rounded-xl border-2 border-dashed bg-white transition-all cursor-pointer",
                    dragOver ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-400"
                )}
            >
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    {uploading ? (
                        <Loader2 className="w-10 h-10 text-blue-500 mb-3 animate-spin" />
                    ) : (
                        <UploadCloud className={cn("w-10 h-10 mb-3", dragOver ? "text-blue-500" : "text-gray-300")} />
                    )}
                    <h3 className="text-sm font-medium mb-1">
                        {uploading ? "Uploading…" : "Drag & drop files here, or click to browse"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Images (PNG, JPG, WebP) or Videos (MP4, WebM, MOV) up to 50MB — multiple files supported
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
                        disabled={uploading}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search by filename…" className="sm:w-72" />
                <FilterPills options={["All", "Images", "Videos"]} value={typeFilter} onChange={setTypeFilter} />
                <span className="text-xs text-muted-foreground sm:ml-auto">
                    {filtered.length} of {items.length} files
                </span>
            </div>

            {loading ? (
                <LoadingState label="Loading gallery…" />
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200">
                    <EmptyState
                        title={items.length === 0 ? "No media yet" : "No files match your filters"}
                        description={items.length === 0 ? "Upload your first image or video above." : "Try a different search or filter."}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item) => {
                        const isVideo = isVideoUrl(item.url);
                        return (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-black shadow-sm">
                                {isVideo ? (
                                    <video
                                        src={item.url}
                                        controls muted playsInline preload="metadata"
                                        className="w-full h-44 object-contain bg-black"
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.filename}
                                        loading="lazy"
                                        className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="secondary" size="icon"
                                        className="w-8 h-8 rounded-full shadow-lg bg-white/90 hover:bg-white"
                                        onClick={() => copyUrl(item)}
                                        title="Copy URL"
                                    >
                                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="destructive" size="icon"
                                        className="w-8 h-8 rounded-full shadow-lg"
                                        onClick={() => setDeleteTarget(item)}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
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

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.filename}"?`}
                description="This file will be removed from your gallery and storage. Anywhere it's used on the site will lose it."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
