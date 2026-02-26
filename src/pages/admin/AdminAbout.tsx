import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface ValueProp {
    id: string;
    title: string;
    description: string;
    order_index: number;
}

export default function AdminAbout() {
    const [values, setValues] = useState<ValueProp[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [currentValue, setCurrentValue] = useState<Partial<ValueProp>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchValues();
    }, []);

    const fetchValues = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("value_props").select("*").order("order_index", { ascending: true });
        if (error) {
            console.error("Error fetching values:", error);
            toast.error("Failed to fetch Core Values");
        } else {
            setValues(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentValue.title || !currentValue.description) {
            toast.error("Title and Description are required.");
            return;
        }
        setSaving(true);

        let error;
        if (currentValue.id) {
            const { error: updateError } = await supabase
                .from("value_props")
                .update({
                    title: currentValue.title,
                    description: currentValue.description,
                    order_index: currentValue.order_index || 0
                })
                .eq("id", currentValue.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("value_props")
                .insert([{
                    title: currentValue.title,
                    description: currentValue.description,
                    order_index: currentValue.order_index || 0
                }]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving value:", error);
            toast.error("Failed to save Core Value");
        } else {
            toast.success("Core Value saved successfully");
            setIsDialogOpen(false);
            fetchValues();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this value?")) return;

        const { error } = await supabase.from("value_props").delete().eq("id", id);
        if (error) {
            console.error("Error deleting value:", error);
            toast.error("Failed to delete Core Value");
        } else {
            toast.success("Core Value deleted");
            setValues(values.filter((v) => v.id !== id));
        }
    };

    const openEditDialog = (value: ValueProp) => {
        setCurrentValue(value);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentValue({
            title: "",
            description: "",
            order_index: values.length + 1
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage About Page</h2>
                    <p className="text-muted-foreground mt-2">Update the Core Values displayed on your About Me page.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2" onClick={openCreateDialog}>
                            <PlusCircle className="w-4 h-4" />
                            New Value
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{currentValue.id ? "Edit Value" : "Add Core Value"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value Title *</label>
                                <Input
                                    value={currentValue.title || ""}
                                    onChange={(e) => setCurrentValue({ ...currentValue, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <Textarea
                                    value={currentValue.description || ""}
                                    onChange={(e) => setCurrentValue({ ...currentValue, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Order Index</label>
                                <Input
                                    type="number"
                                    value={currentValue.order_index || 0}
                                    onChange={(e) => setCurrentValue({ ...currentValue, order_index: parseInt(e.target.value) || 0 })}
                                    placeholder="1 for first, 2 for second..."
                                />
                                <p className="text-xs text-muted-foreground">Used to determine the order they appear on the page.</p>
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
                    <CardTitle>Core Values</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-6 text-muted-foreground">Loading values...</div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-16">Order</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {values.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-10 text-muted-foreground">No core values found.</td>
                                        </tr>
                                    ) : values.map((val) => (
                                        <tr key={val.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{val.order_index}</td>
                                            <td className="p-4 align-middle font-medium">{val.title}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => openEditDialog(val)}>
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDelete(val.id)}>
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
