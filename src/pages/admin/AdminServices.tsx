import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader, MediaThumbnail } from "@/components/ui/media-uploader";
import {
    PageHeader, SearchInput, Th, useSort, sortItems,
    TableShell, LoadingState, EmptyState, FormSheet, ConfirmDialog, Field,
} from "@/components/admin/admin-ui";
import { IconPicker } from "@/components/admin/icon-picker";
import { getIcon } from "@/lib/icon-library";

interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    icon: string;
    features: string[];
    image_url?: string;
}

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<Service>>({});
    const [featuresText, setFeaturesText] = useState("");
    const [original, setOriginal] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const { sort, toggle } = useSort();

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true });
        if (error) { toast.error("Failed to fetch services"); }
        else { setServices(data || []); }
        setLoading(false);
    };

    const filtered = useMemo(() => {
        let items = services;
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter((s) =>
                [s.title, s.description, s.price].some((f) => f?.toLowerCase().includes(q))
            );
        }
        return sortItems(items, sort);
    }, [services, search, sort]);

    const dirty = JSON.stringify({ ...current, __features: featuresText }) !== original;

    const snapshot = (svc: Partial<Service>, features: string) =>
        JSON.stringify({ ...svc, __features: features });

    const handleSave = async () => {
        if (!current.title || !current.description) {
            toast.error("Title and Description are required.");
            return;
        }
        setSaving(true);
        const payload = {
            title: current.title,
            description: current.description,
            price: current.price || "",
            icon: current.icon || "Rocket",
            features: featuresText.split("\n").filter((f) => f.trim() !== ""),
            image_url: current.image_url || "",
        };
        const { error } = current.id
            ? await supabase.from("services").update(payload).eq("id", current.id)
            : await supabase.from("services").insert([payload]);
        if (error) { toast.error("Failed to save service"); }
        else { toast.success("Service saved"); setSheetOpen(false); fetchServices(); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const { error } = await supabase.from("services").delete().eq("id", deleteTarget.id);
        if (error) { toast.error("Failed to delete service"); }
        else { toast.success("Service deleted"); setServices(services.filter((s) => s.id !== deleteTarget.id)); }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const openEdit = (service: Service) => {
        const features = service.features ? service.features.join("\n") : "";
        setCurrent(service);
        setFeaturesText(features);
        setOriginal(snapshot(service, features));
        setSheetOpen(true);
    };

    const openCreate = () => {
        const fresh = { title: "", description: "", price: "From $10,000", icon: "Rocket", image_url: "" };
        setCurrent(fresh);
        setFeaturesText("");
        setOriginal(snapshot(fresh, ""));
        setSheetOpen(true);
    };

    const setField = (patch: Partial<Service>) => setCurrent((c) => ({ ...c, ...patch }));

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader title="Services" description="Update your service offerings, pricing, and features.">
                <Button className="gap-2" onClick={openCreate}>
                    <PlusCircle className="w-4 h-4" /> New Service
                </Button>
            </PageHeader>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search services…" className="sm:w-72" />
                <span className="text-xs text-muted-foreground sm:ml-auto">
                    {filtered.length} of {services.length} services
                </span>
            </div>

            <TableShell>
                <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                        <Th label="Media" className="w-20" />
                        <Th label="Icon" className="w-16" />
                        <Th label="Title" sortKey="title" sort={sort} onSort={toggle} />
                        <Th label="Pricing" sortKey="price" sort={sort} onSort={toggle} className="hidden sm:table-cell" />
                        <Th label="Features" className="hidden md:table-cell" />
                        <Th label="Actions" align="right" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={6}><LoadingState label="Loading services…" /></td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={6}>
                            <EmptyState
                                title={services.length === 0 ? "No services yet" : "No services match your search"}
                                description={services.length === 0 ? "Add your first service offering." : "Try a different search."}
                                action={services.length === 0 ? <Button size="sm" onClick={openCreate}>Add service</Button> : undefined}
                            />
                        </td></tr>
                    ) : filtered.map((service) => {
                        const ServiceIcon = getIcon(service.icon);
                        return (
                        <tr key={service.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="p-3 pl-4"><MediaThumbnail url={service.image_url || ""} alt={service.title} /></td>
                            <td className="p-3">
                                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                    <ServiceIcon className="w-4 h-4" />
                                </span>
                            </td>
                            <td className="p-3 font-medium max-w-[240px]">
                                <span className="block truncate" title={service.title}>{service.title}</span>
                            </td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">{service.price || "—"}</td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell">
                                {service.features?.length ? `${service.features.length} listed` : "—"}
                            </td>
                            <td className="p-3 pr-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(service)}>
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget(service)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </TableShell>

            <FormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                title={current.id ? "Edit Service" : "New Service"}
                description={current.id ? "Update this service offering." : "Add a new service offering."}
                dirty={dirty}
                saving={saving}
                onSave={handleSave}
            >
                <div className="space-y-5">
                    <MediaUploader
                        value={current.image_url || ""}
                        onChange={(url) => setField({ image_url: url })}
                        label="Service Image / Video"
                    />
                    <Field label="Service Title" required>
                        <Input value={current.title || ""} onChange={(e) => setField({ title: e.target.value })} />
                    </Field>
                    <Field label="Pricing String">
                        <Input value={current.price || ""} placeholder="e.g. From $10,000" onChange={(e) => setField({ price: e.target.value })} />
                    </Field>
                    <IconPicker
                        value={current.icon}
                        onChange={(name) => setField({ icon: name })}
                        label="Service Icon"
                    />
                    <Field label="Main Description" required>
                        <Textarea value={current.description || ""} className="min-h-[100px]" onChange={(e) => setField({ description: e.target.value })} />
                    </Field>
                    <Field label={`"What's Included" Features`} hint="Put each feature on a new line.">
                        <Textarea
                            value={featuresText}
                            className="min-h-[150px]"
                            onChange={(e) => setFeaturesText(e.target.value)}
                            placeholder={"Feature 1\nFeature 2\nFeature 3"}
                        />
                    </Field>
                </div>
            </FormSheet>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.title}"?`}
                description="This service will be permanently removed from your site. This cannot be undone."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
