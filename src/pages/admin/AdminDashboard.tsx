import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Type, ImageIcon, Activity } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { title: "Total Blogs", value: "12", icon: FileText, change: "+2 from last month" },
        { title: "Static Texts", value: "8", icon: Type, change: "All up to date" },
        { title: "Gallery Images", value: "45", icon: ImageIcon, change: "+12 from last week" },
        { title: "Page Views", value: "1,204", icon: Activity, change: "+15% from last month" },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Updated "About Me" text</p>
                                    <p className="text-sm text-muted-foreground">Admin - 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Published new blog "React Patterns"</p>
                                    <p className="text-sm text-muted-foreground">Admin - 5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Uploaded 5 images to Gallery</p>
                                    <p className="text-sm text-muted-foreground">Admin - 1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
