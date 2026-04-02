import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, X, ImageIcon, Plus, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { isVideoUrl } from "./media-uploader";

interface MediaGalleryUploaderProps {
  value?: string; // Comma-separated URLs
  onChange: (value: string) => void;
  label?: string;
  maxItems?: number;
}

export function MediaGalleryUploader({
  value = "",
  onChange,
  label = "Media Gallery",
  maxItems = 10
}: MediaGalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const urls = value ? value.split(",").filter(v => v.trim() !== "") : [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (urls.length + files.length > maxItems) {
      toast.error(`You can only have up to ${maxItems} items in this gallery.`);
      return;
    }

    setUploading(true);
    const newUrls = [...urls];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }

      onChange(newUrls.join(","));
      toast.success("Media added to gallery");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls.join(","));
  };

  const moveItem = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === urls.length - 1) return;

    const newUrls = [...urls];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    [newUrls[index], newUrls[targetIndex]] = [newUrls[targetIndex], newUrls[index]];
    onChange(newUrls.join(","));
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-sm font-medium opacity-70">{label}</label>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {urls.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
            {isVideoUrl(url) ? (
              <video src={url} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={url} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover" />
            )}
            
            {/* Overlay Controls */}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
              <div className="flex gap-1">
                <button 
                  onClick={() => moveItem(index, 'left')} 
                  disabled={index === 0}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={() => moveItem(index, 'right')} 
                  disabled={index === urls.length - 1}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
              <button 
                onClick={() => removeUrl(index)} 
                className="p-1 hover:bg-red-500/80 rounded"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}

        {urls.length < maxItems && (
          <label className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-vice-500/50 hover:bg-vice-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-vice-500" />
            ) : (
              <Plus className="w-8 h-8 text-muted-foreground group-hover:text-vice-500 transition-colors" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover:text-vice-500">
              {uploading ? "Uploading..." : "Add Media"}
            </span>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleUpload} 
              disabled={uploading} 
            />
          </label>
        )}
      </div>
      
      {urls.length > 0 && (
        <p className="text-[10px] uppercase opacity-40 font-medium">
          {urls.length} item{urls.length > 1 ? 's' : ''} in gallery • Reorder using arrows
        </p>
      )}
    </div>
  );
}
