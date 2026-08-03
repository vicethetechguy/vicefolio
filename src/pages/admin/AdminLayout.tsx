import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard, FileText, Type, Image as ImageIcon, LogOut, Loader2,
    Calendar, User, Briefcase, BarChart, Menu, ExternalLink, ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import AdminLogin from "./AdminLogin";

const navGroups = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Meetings", href: "/admin/meetings", icon: Calendar },
        ],
    },
    {
        label: "Content",
        items: [
            { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
            { name: "Services", href: "/admin/services", icon: BarChart },
            { name: "Blogs", href: "/admin/blogs", icon: FileText },
            { name: "About Me", href: "/admin/about", icon: User },
        ],
    },
    {
        label: "Site",
        items: [
            { name: "Text Config", href: "/admin/texts", icon: Type },
            { name: "Gallery", href: "/admin/images", icon: ImageIcon },
        ],
    },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    const location = useLocation();
    const { user, signOut } = useAuth();

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-zinc-400">
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center px-5 border-b border-zinc-800/80">
                <Link to="/" className="flex items-center gap-2.5 group" onClick={onNavigate}>
                    <img src="/favicon.svg" alt="VICE Logo" className="w-6 h-6 invert" />
                    <span className="text-lg font-bold font-mono tracking-tighter text-white">
                        VICE <span className="text-blue-500">Panel</span>
                    </span>
                </Link>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={onNavigate}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-zinc-800/80 text-white shadow-sm"
                                                : "hover:bg-zinc-900 hover:text-zinc-200"
                                        )}
                                    >
                                        <item.icon className={cn("w-4 h-4", isActive && "text-blue-400")} />
                                        {item.name}
                                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-600" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-800/80 space-y-0.5">
                <div className="flex items-center gap-2.5 px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {(user?.email?.[0] || "A").toUpperCase()}
                    </div>
                    <span className="text-xs text-zinc-500 truncate">{user?.email}</span>
                </div>
                <Link
                    to="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    View Site
                </Link>
                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400/90 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    const { user, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!user) return <AdminLogin />;

    return (
        <div className="admin-layout flex min-h-screen bg-gray-100">
            {/* Desktop sidebar */}
            <aside className="w-64 hidden md:block shrink-0 sticky top-0 h-screen">
                <SidebarNav />
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 h-14 px-4 bg-zinc-950 text-white">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 -ml-2 rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Open menu">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72 border-r-0 bg-zinc-950 text-white">
                            <SidebarNav onNavigate={() => setMobileOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <span className="text-base font-bold font-mono tracking-tighter">
                        VICE <span className="text-blue-500">Panel</span>
                    </span>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
