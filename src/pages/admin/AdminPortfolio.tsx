import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader, MediaThumbnail } from "@/components/ui/media-uploader";
import {
    PageHeader, SearchInput, FilterPills, Th, useSort, sortItems,
    TableShell, LoadingState, EmptyState, FormSheet, ConfirmDialog, Field, slugify,
} from "@/components/admin/admin-ui";
import { IconPicker } from "@/components/admin/icon-picker";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { normalizeUrl, prettyUrl } from "@/lib/utils";

interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    metric: string;
    description: string;
    slug: string;
    year: string;
    image_url?: string;
    website_url?: string;
    icon?: string;
}

export default function AdminPortfolio() {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<PortfolioProject>>({});
    const [original, setOriginal] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const { sort, toggle } = useSort();

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false });
        if (error) { toast.error("Failed to fetch projects"); }
        else { setProjects(data || []); }
        setLoading(false);
    };

    const categories = useMemo(() => {
        const set = new Set(projects.map((p) => p.category).filter(Boolean));
        return ["All", ...Array.from(set)];
    }, [projects]);

    const filtered = useMemo(() => {
        let items = projects;
        if (categoryFilter !== "All") items = items.filter((p) => p.category === categoryFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter((p) =>
                [p.title, p.category, p.metric, p.slug, p.description].some((f) => f?.toLowerCase().includes(q))
            );
        }
        return sortItems(items, sort);
    }, [projects, search, categoryFilter, sort]);

    const dirty = JSON.stringify(current) !== original;

    /**
     * The slug is no longer edited by hand — it's derived from the title and only
     * used as an internal identifier. Append a counter if another project already
     * claimed it, since the column is unique.
     */
    const buildSlug = (title: string, ignoreId?: string) => {
        const base = slugify(title) || "project";
        const taken = new Set(projects.filter((p) => p.id !== ignoreId).map((p) => p.slug));
        if (!taken.has(base)) return base;
        let n = 2;
        while (taken.has(`${base}-${n}`)) n++;
        return `${base}-${n}`;
    };

    const handleSave = async () => {
        if (!current.title?.trim()) {
            toast.error("Title is required.");
            return;
        }
        if (current.website_url?.trim() && !normalizeUrl(current.website_url)) {
            toast.error("Project link is not a valid web address.");
            return;
        }
        setSaving(true);
        // Store the canonical absolute URL so the public site can link straight to it
        const payload = {
            ...current,
            slug: current.slug || buildSlug(current.title, current.id),
            website_url: normalizeUrl(current.website_url),
        };
        const { error } = current.id
            ? await supabase.from("portfolio_projects").update(payload).eq("id", current.id)
            : await supabase.from("portfolio_projects").insert([payload]);
        if (error) { toast.error("Failed to save project"); }
        else { toast.success("Project saved"); setSheetOpen(false); fetchProjects(); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const { error } = await supabase.from("portfolio_projects").delete().eq("id", deleteTarget.id);
        if (error) { toast.error("Failed to delete project"); }
        else { toast.success("Project deleted"); setProjects(projects.filter((p) => p.id !== deleteTarget.id)); }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const openEdit = (project: PortfolioProject) => {
        setCurrent(project);
        setOriginal(JSON.stringify(project));
        setSheetOpen(true);
    };

    const openCreate = () => {
        const fresh = {
            title: "", slug: "", category: "Tokenomics", metric: "",
            year: new Date().getFullYear().toString(), description: "", image_url: "", website_url: "", icon: "Coins",
        };
        setCurrent(fresh);
        setOriginal(JSON.stringify(fresh));
        setSheetOpen(true);
    };

    const setField = (patch: Partial<PortfolioProject>) => setCurrent((c) => ({ ...c, ...patch }));

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader title="Portfolio" description="Manage your case studies and featured projects.">
                <Button className="gap-2" onClick={openCreate}>
                    <PlusCircle className="w-4 h-4" /> New Project
                </Button>
            </PageHeader>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search projects…" className="sm:w-72" />
                {categories.length > 1 && (
                    <FilterPills options={categories} value={categoryFilter} onChange={setCategoryFilter} />
                )}
                <span className="text-xs text-muted-foreground sm:ml-auto">
                    {filtered.length} of {projects.length} projects
                </span>
            </div>

            <TableShell>
                <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                        <Th label="Media" className="w-20" />
                        <Th label="Icon" className="w-16" />
                        <Th label="Title" sortKey="title" sort={sort} onSort={toggle} />
                        <Th label="Category" sortKey="category" sort={sort} onSort={toggle} className="hidden sm:table-cell" />
                        <Th label="Metric" sortKey="metric" sort={sort} onSort={toggle} className="hidden md:table-cell" />
                        <Th label="Year" sortKey="year" sort={sort} onSort={toggle} className="hidden md:table-cell" />
                        <Th label="Actions" align="right" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={7}><LoadingState label="Loading projects…" /></td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={7}>
                            <EmptyState
                                title={projects.length === 0 ? "No projects yet" : "No projects match your filters"}
                                description={projects.length === 0 ? "Add your first case study to showcase your work." : "Try a different search or filter."}
                                action={projects.length === 0 ? <Button size="sm" onClick={openCreate}>Add project</Button> : undefined}
                            />
                        </td></tr>
                    ) : filtered.map((project) => {
                        return (
                        <tr key={project.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="p-3 pl-4"><MediaThumbnail url={project.image_url || ""} alt={project.title} /></td>
                            <td className="p-3">
                                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden p-1.5">
                                    <DynamicIcon icon={project.icon} fallback="Coins" alt={project.title} className="w-full h-full" />
                                </span>
                            </td>
                            <td className="p-3 font-medium max-w-[240px]">
                                <span className="block truncate" title={project.title}>{project.title}</span>
                                {normalizeUrl(project.website_url) ? (
                                    <a
                                        href={normalizeUrl(project.website_url)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline truncate"
                                    >
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                        {prettyUrl(project.website_url)}
                                    </a>
                                ) : (
                                    <span className="block text-xs text-muted-foreground">No project link</span>
                                )}
                            </td>
                            <td className="p-3 hidden sm:table-cell">
                                {project.category && (
                                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                        {project.category}
                                    </span>
                                )}
                            </td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell">{project.metric || "—"}</td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell">{project.year}</td>
                            <td className="p-3 pr-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}>
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget(project)}>
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
                title={current.id ? "Edit Project" : "New Project"}
                description={current.id ? "Update this case study." : "Add a new case study to your portfolio."}
                dirty={dirty}
                saving={saving}
                onSave={handleSave}
            >
                <div className="space-y-5">
                    <MediaUploader
                        value={current.image_url || ""}
                        onChange={(url) => setField({ image_url: url })}
                        label="Project Image / Video"
                    />
                    <Field label="Title" required>
                        <Input
                            value={current.title || ""}
                            onChange={(e) => setField({ title: e.target.value })}
                        />
                    </Field>
                    <Field
                        label="Project Link"
                        hint="The project's live website. Clicking the project title on the site opens this in a new tab."
                    >
                        <Input
                            type="url"
                            inputMode="url"
                            placeholder="https://naijaeats.com"
                            value={current.website_url || ""}
                            onChange={(e) => setField({ website_url: e.target.value })}
                        />
                        {current.website_url && !normalizeUrl(current.website_url) && (
                            <p className="mt-1 text-xs text-red-600">That doesn't look like a valid web address.</p>
                        )}
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Category">
                            <Input value={current.category || ""} onChange={(e) => setField({ category: e.target.value })} />
                        </Field>
                        <Field label="Year">
                            <Input value={current.year || ""} onChange={(e) => setField({ year: e.target.value })} />
                        </Field>
                        <Field label="Metric Spotlight" hint="e.g. $42M TVL" className="col-span-2">
                            <Input value={current.metric || ""} onChange={(e) => setField({ metric: e.target.value })} />
                        </Field>
                    </div>
                    <IconPicker
                        value={current.icon}
                        onChange={(name) => setField({ icon: name })}
                        label="Project Icon"
                    />
                    <Field label="Description">
                        <Textarea value={current.description || ""} className="min-h-[140px]" onChange={(e) => setField({ description: e.target.value })} />
                    </Field>
                </div>
            </FormSheet>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.title}"?`}
                description="This project will be permanently removed from your portfolio. This cannot be undone."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
