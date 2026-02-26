import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Type,
  Image as ImageIcon,
  Settings,
  LogOut
} from "lucide-react";

import { User, Briefcase, BarChart } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
    { name: "Services", href: "/admin/services", icon: BarChart },
    { name: "About Me", href: "/admin/about", icon: User },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Text Config", href: "/admin/texts", icon: Type },
    { name: "Gallery", href: "/admin/images", icon: ImageIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
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

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
