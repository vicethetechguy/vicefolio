import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Blog {
    id: string;
    title: string;
    date: string;
    status: string;
    content?: string;
}

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching blogs:", error);
            toast.error("Failed to fetch blogs");
        } else {
            setBlogs(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentBlog.title || !currentBlog.date || !currentBlog.status) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setSaving(true);

        let error;
        if (currentBlog.id) {
            // Update
            const { error: updateError } = await supabase
                .from("blogs")
                .update({
                    title: currentBlog.title,
                    date: currentBlog.date,
                    status: currentBlog.status,
                })
                .eq("id", currentBlog.id);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from("blogs")
                .insert([
                    {
                        title: currentBlog.title,
                        date: currentBlog.date,
                        status: currentBlog.status,
                    }
                ]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving blog:", error);
            toast.error("Failed to save blog");
        } else {
            toast.success("Blog saved successfully");
            setIsDialogOpen(false);
            fetchBlogs();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog");
        } else {
            toast.success("Blog deleted");
            setBlogs(blogs.filter((b) => b.id !== id));
        }
    };

    const openEditDialog = (blog: Blog) => {
        setCurrentBlog(blog);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentBlog({ title: "", date: new Date().toISOString().split('T')[0], status: "Draft" });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Blogs</h2>
                    <p className="text-muted-foreground mt-2">Create, edit, or delete your blog posts.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2" onClick={openCreateDialog}>
                            <PlusCircle className="w-4 h-4" />
                            New Blog Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentBlog.id ? "Edit Blog" : "Create Blog"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={currentBlog.title || ""}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                    type="date"
                                    value={currentBlog.date || ""}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    value={currentBlog.status || "Draft"}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, status: e.target.value })}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>All Blog Posts</CardTitle>
                        <div className="w-1/3">
                            <Input placeholder="Search blogs..." />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-6 text-muted-foreground">Loading blogs...</div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {blogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-muted-foreground">
                                                No blogs found.
                                            </td>
                                        </tr>
                                    ) : blogs.map((blog) => (
                                        <tr key={blog.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{blog.title}</td>
                                            <td className="p-4 align-middle">{blog.date}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${blog.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                                                    {blog.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => openEditDialog(blog)}>
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDelete(blog.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
