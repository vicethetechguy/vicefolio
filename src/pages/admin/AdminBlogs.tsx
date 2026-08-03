import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MediaUploader, MediaThumbnail } from "@/components/ui/media-uploader";
import {
    PageHeader, SearchInput, FilterPills, Th, useSort, sortItems,
    TableShell, LoadingState, EmptyState, StatusBadge, FormSheet, ConfirmDialog, Field, slugify,
} from "@/components/admin/admin-ui";
import { IconPicker } from "@/components/admin/icon-picker";
import { getIcon } from "@/lib/icon-library";

interface Blog {
    id: string;
    title: string;
    date: string;
    status: string;
    content?: string;
    excerpt?: string;
    category?: string;
    read_time?: string;
    slug?: string;
    image_url?: string;
    icon?: string;
}

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<Blog>>({});
    const [original, setOriginal] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const { sort, toggle } = useSort({ key: "date", dir: "desc" });

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("blogs").select("*").order("date", { ascending: false });
        if (error) { toast.error("Failed to fetch blogs"); }
        else { setBlogs(data || []); }
        setLoading(false);
    };

    const filtered = useMemo(() => {
        let items = blogs;
        if (statusFilter !== "All") items = items.filter((b) => b.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter((b) =>
                [b.title, b.category, b.slug, b.excerpt].some((f) => f?.toLowerCase().includes(q))
            );
        }
        return sortItems(items, sort);
    }, [blogs, search, statusFilter, sort]);

    const dirty = JSON.stringify(current) !== original;

    const handleSave = async () => {
        if (!current.title || !current.date || !current.status || !current.slug) {
            toast.error("Title, Date, Status, and Slug are required.");
            return;
        }
        setSaving(true);
        const payload = {
            title: current.title, date: current.date, status: current.status,
            excerpt: current.excerpt, category: current.category,
            read_time: current.read_time, slug: current.slug,
            content: current.content, image_url: current.image_url || "",
            icon: current.icon || "FileText",
        };
        const { error } = current.id
            ? await supabase.from("blogs").update(payload).eq("id", current.id)
            : await supabase.from("blogs").insert([payload]);
        if (error) { toast.error("Failed to save blog"); }
        else { toast.success("Blog saved"); setSheetOpen(false); fetchBlogs(); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const { error } = await supabase.from("blogs").delete().eq("id", deleteTarget.id);
        if (error) { toast.error("Failed to delete blog"); }
        else { toast.success("Blog deleted"); setBlogs(blogs.filter((b) => b.id !== deleteTarget.id)); }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const openEdit = (blog: Blog) => {
        setCurrent(blog);
        setOriginal(JSON.stringify(blog));
        setSlugTouched(true);
        setSheetOpen(true);
    };

    const openCreate = () => {
        const fresh = {
            title: "", date: new Date().toISOString().split("T")[0], status: "Draft",
            slug: "", category: "General", read_time: "5 min read", image_url: "", icon: "FileText",
        };
        setCurrent(fresh);
        setOriginal(JSON.stringify(fresh));
        setSlugTouched(false);
        setSheetOpen(true);
    };

    const setField = (patch: Partial<Blog>) => setCurrent((c) => ({ ...c, ...patch }));

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader title="Blogs" description="Create, edit, and publish your blog posts.">
                <Button className="gap-2" onClick={openCreate}>
                    <PlusCircle className="w-4 h-4" /> New Post
                </Button>
            </PageHeader>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search title, category, slug…" className="sm:w-72" />
                <FilterPills options={["All", "Published", "Draft"]} value={statusFilter} onChange={setStatusFilter} />
                <span className="text-xs text-muted-foreground sm:ml-auto">
                    {filtered.length} of {blogs.length} posts
                </span>
            </div>

            <TableShell>
                <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                        <Th label="Media" className="w-20" />
                        <Th label="Icon" className="w-16" />
                        <Th label="Title" sortKey="title" sort={sort} onSort={toggle} />
                        <Th label="Category" sortKey="category" sort={sort} onSort={toggle} className="hidden md:table-cell" />
                        <Th label="Date" sortKey="date" sort={sort} onSort={toggle} className="hidden sm:table-cell" />
                        <Th label="Status" sortKey="status" sort={sort} onSort={toggle} />
                        <Th label="Actions" align="right" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={7}><LoadingState label="Loading blogs…" /></td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={7}>
                            <EmptyState
                                title={blogs.length === 0 ? "No blog posts yet" : "No posts match your filters"}
                                description={blogs.length === 0 ? "Write your first post to get started." : "Try a different search or filter."}
                                action={blogs.length === 0 ? <Button size="sm" onClick={openCreate}>Create post</Button> : undefined}
                            />
                        </td></tr>
                    ) : filtered.map((blog) => {
                        const BlogIcon = getIcon(blog.icon, "FileText");
                        return (
                        <tr key={blog.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="p-3 pl-4"><MediaThumbnail url={blog.image_url || ""} alt={blog.title} /></td>
                            <td className="p-3">
                                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                    <BlogIcon className="w-4 h-4" />
                                </span>
                            </td>
                            <td className="p-3 font-medium max-w-[240px]">
                                <span className="block truncate" title={blog.title}>{blog.title}</span>
                                <span className="block text-xs text-muted-foreground truncate">/{blog.slug}</span>
                            </td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell">{blog.category || "—"}</td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">{blog.date}</td>
                            <td className="p-3"><StatusBadge status={blog.status} /></td>
                            <td className="p-3 pr-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(blog)}>
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget(blog)}>
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
                title={current.id ? "Edit Post" : "New Post"}
                description={current.id ? "Update this blog post." : "Write and publish a new blog post."}
                dirty={dirty}
                saving={saving}
                onSave={handleSave}
            >
                <div className="space-y-5">
                    <MediaUploader
                        value={current.image_url || ""}
                        onChange={(url) => setField({ image_url: url })}
                        label="Cover Image / Video"
                    />
                    <Field label="Title" required>
                        <Input
                            value={current.title || ""}
                            onChange={(e) => setField({
                                title: e.target.value,
                                ...(slugTouched ? {} : { slug: slugify(e.target.value) }),
                            })}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Slug" required hint="Auto-generated from title; edit to override.">
                            <Input
                                value={current.slug || ""}
                                onChange={(e) => { setSlugTouched(true); setField({ slug: e.target.value }); }}
                            />
                        </Field>
                        <Field label="Date" required>
                            <Input type="date" value={current.date || ""} onChange={(e) => setField({ date: e.target.value })} />
                        </Field>
                        <Field label="Category">
                            <Input value={current.category || ""} onChange={(e) => setField({ category: e.target.value })} />
                        </Field>
                        <Field label="Read Time">
                            <Input value={current.read_time || ""} placeholder="e.g. 5 min read" onChange={(e) => setField({ read_time: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Status" required>
                        <div className="flex gap-2">
                            {["Draft", "Published"].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setField({ status: s })}
                                    className={`px-4 h-9 rounded-lg text-sm font-medium border transition-colors ${current.status === s
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </Field>
                    <IconPicker
                        value={current.icon}
                        onChange={(name) => setField({ icon: name })}
                        label="Post Icon"
                    />
                    <Field label="Excerpt" hint="Short description shown on blog listing.">
                        <Textarea value={current.excerpt || ""} className="min-h-[80px]" onChange={(e) => setField({ excerpt: e.target.value })} />
                    </Field>
                    <Field label="Full Content">
                        <Textarea value={current.content || ""} className="min-h-[240px]" placeholder="Write your blog content here…" onChange={(e) => setField({ content: e.target.value })} />
                    </Field>
                </div>
            </FormSheet>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.title}"?`}
                description="This blog post will be permanently removed from your site. This cannot be undone."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
