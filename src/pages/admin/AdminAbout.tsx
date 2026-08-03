import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader, MediaThumbnail } from "@/components/ui/media-uploader";
import {
    PageHeader, TableShell, Th, LoadingState, EmptyState,
    FormSheet, ConfirmDialog, Field,
} from "@/components/admin/admin-ui";

interface ValueProp {
    id: string;
    title: string;
    description: string;
    order_index: number;
    image_url?: string;
}

export default function AdminAbout() {
    const [values, setValues] = useState<ValueProp[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<ValueProp>>({});
    const [original, setOriginal] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ValueProp | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    useEffect(() => { fetchValues(); }, []);

    const fetchValues = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("value_props").select("*").order("order_index", { ascending: true });
        if (error) { toast.error("Failed to fetch Core Values"); }
        else { setValues(data || []); }
        setLoading(false);
    };

    const dirty = JSON.stringify(current) !== original;

    const handleSave = async () => {
        if (!current.title || !current.description) {
            toast.error("Title and Description are required.");
            return;
        }
        setSaving(true);
        const payload = {
            title: current.title,
            description: current.description,
            order_index: current.order_index || 0,
            image_url: current.image_url || "",
        };
        const { error } = current.id
            ? await supabase.from("value_props").update(payload).eq("id", current.id)
            : await supabase.from("value_props").insert([payload]);
        if (error) { toast.error("Failed to save Core Value"); }
        else { toast.success("Core Value saved"); setSheetOpen(false); fetchValues(); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const { error } = await supabase.from("value_props").delete().eq("id", deleteTarget.id);
        if (error) { toast.error("Failed to delete Core Value"); }
        else { toast.success("Core Value deleted"); setValues(values.filter((v) => v.id !== deleteTarget.id)); }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const move = async (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= values.length || reordering) return;
        setReordering(true);
        const a = values[index], b = values[target];
        // Swap in UI immediately
        const next = [...values];
        next[index] = { ...b, order_index: a.order_index };
        next[target] = { ...a, order_index: b.order_index };
        next.sort((x, y) => x.order_index - y.order_index);
        setValues(next);
        // Persist swap
        const [r1, r2] = await Promise.all([
            supabase.from("value_props").update({ order_index: b.order_index }).eq("id", a.id),
            supabase.from("value_props").update({ order_index: a.order_index }).eq("id", b.id),
        ]);
        if (r1.error || r2.error) { toast.error("Failed to reorder"); fetchValues(); }
        setReordering(false);
    };

    const openEdit = (value: ValueProp) => {
        setCurrent(value);
        setOriginal(JSON.stringify(value));
        setSheetOpen(true);
    };

    const openCreate = () => {
        const maxIndex = values.reduce((m, v) => Math.max(m, v.order_index || 0), 0);
        const fresh = { title: "", description: "", order_index: maxIndex + 1, image_url: "" };
        setCurrent(fresh);
        setOriginal(JSON.stringify(fresh));
        setSheetOpen(true);
    };

    const setField = (patch: Partial<ValueProp>) => setCurrent((c) => ({ ...c, ...patch }));

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader title="About Page" description="Manage the Core Values shown on your About Me page. Use the arrows to reorder.">
                <Button className="gap-2" onClick={openCreate}>
                    <PlusCircle className="w-4 h-4" /> New Value
                </Button>
            </PageHeader>

            <TableShell>
                <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                        <Th label="Order" className="w-24" />
                        <Th label="Media" className="w-20" />
                        <Th label="Title" />
                        <Th label="Description" className="hidden md:table-cell" />
                        <Th label="Actions" align="right" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={5}><LoadingState label="Loading values…" /></td></tr>
                    ) : values.length === 0 ? (
                        <tr><td colSpan={5}>
                            <EmptyState
                                title="No core values yet"
                                description="Add the principles you want to highlight on your About page."
                                action={<Button size="sm" onClick={openCreate}>Add value</Button>}
                            />
                        </td></tr>
                    ) : values.map((val, i) => (
                        <tr key={val.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="p-3 pl-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-semibold text-gray-400 w-5">{i + 1}</span>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => move(i, -1)}
                                            disabled={i === 0 || reordering}
                                            className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"
                                            aria-label="Move up"
                                        >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => move(i, 1)}
                                            disabled={i === values.length - 1 || reordering}
                                            className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"
                                            aria-label="Move down"
                                        >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3"><MediaThumbnail url={val.image_url || ""} alt={val.title} /></td>
                            <td className="p-3 font-medium">{val.title}</td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell max-w-[300px]">
                                <span className="block truncate">{val.description}</span>
                            </td>
                            <td className="p-3 pr-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(val)}>
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget(val)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </TableShell>

            <FormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                title={current.id ? "Edit Value" : "New Core Value"}
                description="Shown in the values section of your About page."
                dirty={dirty}
                saving={saving}
                onSave={handleSave}
            >
                <div className="space-y-5">
                    <MediaUploader
                        value={current.image_url || ""}
                        onChange={(url) => setField({ image_url: url })}
                        label="Value Image / Video"
                    />
                    <Field label="Value Title" required>
                        <Input value={current.title || ""} onChange={(e) => setField({ title: e.target.value })} />
                    </Field>
                    <Field label="Description" required>
                        <Textarea value={current.description || ""} className="min-h-[120px]" onChange={(e) => setField({ description: e.target.value })} />
                    </Field>
                    <Field label="Order Index" hint="Position on the page — you can also reorder with the arrows in the list.">
                        <Input
                            type="number"
                            value={current.order_index || 0}
                            onChange={(e) => setField({ order_index: parseInt(e.target.value) || 0 })}
                        />
                    </Field>
                </div>
            </FormSheet>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.title}"?`}
                description="This core value will be permanently removed from your About page."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
