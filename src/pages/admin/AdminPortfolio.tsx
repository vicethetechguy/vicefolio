import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    metric: string;
    description: string;
    slug: string;
    year: string;
}

export default function AdminPortfolio() {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [currentProject, setCurrentProject] = useState<Partial<PortfolioProject>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentProject.title || !currentProject.slug) {
            toast.error("Title and Slug are required.");
            return;
        }
        setSaving(true);

        let error;
        if (currentProject.id) {
            const { error: updateError } = await supabase
                .from("portfolio_projects")
                .update(currentProject)
                .eq("id", currentProject.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("portfolio_projects")
                .insert([currentProject]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving project:", error);
            toast.error("Failed to save project");
        } else {
            toast.success("Project saved successfully");
            setIsDialogOpen(false);
            fetchProjects();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
        if (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project");
        } else {
            toast.success("Project deleted");
            setProjects(projects.filter((p) => p.id !== id));
        }
    };

    const openEditDialog = (project: PortfolioProject) => {
        setCurrentProject(project);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentProject({
            title: "",
            slug: "",
            category: "Tokenomics",
            metric: "",
            year: new Date().getFullYear().toString(),
            description: ""
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Portfolio</h2>
                    <p className="text-muted-foreground mt-2">Manage your selected case studies and projects.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2" onClick={openCreateDialog}>
                            <PlusCircle className="w-4 h-4" />
                            New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{currentProject.id ? "Edit Project" : "Add Project"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                    value={currentProject.title || ""}
                                    onChange={(e) => setCurrentProject({
                                        ...currentProject,
                                        title: e.target.value,
                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug *</label>
                                <Input
                                    value={currentProject.slug || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    value={currentProject.category || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Metric Spotlight (e.g. $42M TVL)</label>
                                <Input
                                    value={currentProject.metric || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, metric: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input
                                    value={currentProject.year || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, year: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={currentProject.description || ""}
                                    className="min-h-[100px]"
                                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                />
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
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-6 text-muted-foreground">Loading projects...</div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Metric</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {projects.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-muted-foreground">No projects found.</td>
                                        </tr>
                                    ) : projects.map((project) => (
                                        <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{project.title}</td>
                                            <td className="p-4 align-middle">{project.category}</td>
                                            <td className="p-4 align-middle">{project.metric}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => openEditDialog(project)}>
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDelete(project.id)}>
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
