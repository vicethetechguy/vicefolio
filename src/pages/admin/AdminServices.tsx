import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    icon: string;
    features: string[];
}

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [currentService, setCurrentService] = useState<Partial<Service>>({});
    const [featuresText, setFeaturesText] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true });
        if (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to fetch services");
        } else {
            setServices(data || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentService.title || !currentService.description) {
            toast.error("Title and Description are required.");
            return;
        }
        setSaving(true);

        // Convert comma/newline separated text back to string[]
        const featuresArray = featuresText.split('\n').filter(f => f.trim() !== '');

        const payload = {
            title: currentService.title,
            description: currentService.description,
            price: currentService.price || "",
            icon: currentService.icon || "Rocket",
            features: featuresArray
        };

        let error;
        if (currentService.id) {
            const { error: updateError } = await supabase
                .from("services")
                .update(payload)
                .eq("id", currentService.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("services")
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            console.error("Error saving service:", error);
            toast.error("Failed to save service");
        } else {
            toast.success("Service saved successfully");
            setIsDialogOpen(false);
            fetchServices();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        const { error } = await supabase.from("services").delete().eq("id", id);
        if (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
        } else {
            toast.success("Service deleted");
            setServices(services.filter((s) => s.id !== id));
        }
    };

    const openEditDialog = (service: Service) => {
        setCurrentService(service);
        // Convert string[] to newlines for the textarea
        setFeaturesText(service.features ? service.features.join('\n') : "");
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentService({
            title: "",
            description: "",
            price: "From $10,000",
            icon: "Rocket"
        });
        setFeaturesText("");
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8 max-h-screen overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Services</h2>
                    <p className="text-muted-foreground mt-2">Update your service offerings, prices, and features.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2" onClick={openCreateDialog}>
                            <PlusCircle className="w-4 h-4" />
                            New Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{currentService.id ? "Edit Service" : "Add Service"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Service Title *</label>
                                <Input
                                    value={currentService.title || ""}
                                    onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pricing String</label>
                                    <Input
                                        value={currentService.price || ""}
                                        onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                                        placeholder="e.g. From $10,000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lucide Icon Name</label>
                                    <Input
                                        value={currentService.icon || ""}
                                        onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                                        placeholder="e.g. Rocket, Coins, Users"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Main Description *</label>
                                <Textarea
                                    value={currentService.description || ""}
                                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">"What's Included" Features</label>
                                <p className="text-xs text-muted-foreground">Put each feature on a new line.</p>
                                <Textarea
                                    value={featuresText}
                                    className="min-h-[150px]"
                                    onChange={(e) => setFeaturesText(e.target.value)}
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
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
                        <div className="text-center py-6 text-muted-foreground">Loading services...</div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pricing</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {services.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-10 text-muted-foreground">No services found.</td>
                                        </tr>
                                    ) : services.map((service) => (
                                        <tr key={service.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{service.title}</td>
                                            <td className="p-4 align-middle">{service.price}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => openEditDialog(service)}>
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDelete(service.id)}>
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
