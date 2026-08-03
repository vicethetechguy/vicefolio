import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FileText, ImageIcon, Briefcase, BarChart, User, PlusCircle,
    ArrowRight, Loader2, Type, Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

interface Stats {
    blogs: number | null;
    published: number | null;
    projects: number | null;
    services: number | null;
    images: number | null;
    values: number | null;
}

interface RecentBlog {
    id: string;
    title: string;
    date: string;
    status: string;
}

const count = async (table: string, filter?: { col: string; val: string }) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter.col, filter.val);
    const { count: c, error } = await q;
    return error ? null : c ?? 0;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [blogs, published, projects, services, images, values, blogRes] = await Promise.all([
                count("blogs"),
                count("blogs", { col: "status", val: "Published" }),
                count("portfolio_projects"),
                count("services"),
                count("images"),
                count("value_props"),
                supabase.from("blogs").select("id,title,date,status").order("date", { ascending: false }).limit(5),
            ]);
            setStats({ blogs, published, projects, services, images, values });
            setRecentBlogs(blogRes.data || []);
            setLoading(false);
        })();
    }, []);

    const statCards = [
        { title: "Blog Posts", value: stats?.blogs, sub: stats?.published != null ? `${stats.published} published` : "", icon: FileText, href: "/admin/blogs", color: "text-blue-600 bg-blue-50" },
        { title: "Portfolio Projects", value: stats?.projects, sub: "case studies live", icon: Briefcase, href: "/admin/portfolio", color: "text-violet-600 bg-violet-50" },
        { title: "Services", value: stats?.services, sub: "offerings listed", icon: BarChart, href: "/admin/services", color: "text-emerald-600 bg-emerald-50" },
        { title: "Gallery Media", value: stats?.images, sub: "images & videos", icon: ImageIcon, href: "/admin/images", color: "text-amber-600 bg-amber-50" },
    ];

    const quickActions = [
        { label: "New Blog Post", icon: FileText, href: "/admin/blogs" },
        { label: "New Project", icon: Briefcase, href: "/admin/portfolio" },
        { label: "Upload Media", icon: ImageIcon, href: "/admin/images" },
        { label: "Edit Site Text", icon: Type, href: "/admin/texts" },
        { label: "View Meetings", icon: Calendar, href: "/admin/meetings" },
        { label: "About Page", icon: User, href: "/admin/about" },
    ];

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
            <PageHeader
                title="Dashboard"
                description={`Welcome back — here's what's live on your site right now.`}
            />

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        to={stat.href}
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("p-2 rounded-lg", stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : stat.value ?? "—"}
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </Link>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                {/* Recent blogs */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-sm">Recent Blog Posts</h3>
                        <Link to="/admin/blogs" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                    ) : recentBlogs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-10">No blog posts yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {recentBlogs.map((blog) => (
                                <li key={blog.id}>
                                    <Link to="/admin/blogs" className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{blog.title}</p>
                                            <p className="text-xs text-muted-foreground">{blog.date}</p>
                                        </div>
                                        <StatusBadge status={blog.status} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Quick actions */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <PlusCircle className="w-4 h-4 text-gray-400" /> Quick Actions
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                to={action.href}
                                className="flex flex-col items-start gap-2 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                <action.icon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
