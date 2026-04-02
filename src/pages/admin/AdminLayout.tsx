import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Type,
  Image as ImageIcon,
  LogOut,
  Loader2,
  Calendar
} from "lucide-react";
import { User, Briefcase, BarChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "./AdminLogin";

export default function AdminLayout() {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <AdminLogin />;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Meetings", href: "/admin/meetings", icon: Calendar },
    { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
    { name: "Services", href: "/admin/services", icon: BarChart },
    { name: "About Me", href: "/admin/about", icon: User },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Text Config", href: "/admin/texts", icon: Type },
    { name: "Gallery", href: "/admin/images", icon: ImageIcon },
  ];

  return (
    <div className="admin-layout flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/40">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/favicon.svg" alt="VICE Logo" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
              <h1 className="text-xl font-bold font-mono tracking-tighter text-gray-900 dark:text-white">VICE <span className="text-blue-500">Panel</span></h1>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
            {/* Logged-in user badge */}
            <div className="px-3 py-2 text-xs text-gray-400 truncate">
              {user.email}
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Exit Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
