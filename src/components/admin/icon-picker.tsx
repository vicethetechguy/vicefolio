import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { iconLibrary, iconNames, getIcon } from "@/lib/icon-library";
import { cn } from "@/lib/utils";

/**
 * Searchable icon grid for admin forms.
 * Stores the icon's name (string) — rendered on the site via getIcon().
 */
export function IconPicker({
    value, onChange, label = "Icon",
}: { value: string | undefined; onChange: (name: string) => void; label?: string }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return iconNames;
        return iconNames.filter((n) => n.toLowerCase().includes(q));
    }, [query]);

    const Selected = value ? getIcon(value) : null;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                {Selected && value && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-100 rounded-full px-2.5 py-1">
                        <Selected className="w-3.5 h-3.5" /> {value}
                    </span>
                )}
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search icons…"
                    className="pl-9 h-9"
                />
            </div>

            <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/60 p-2">
                {filtered.length === 0 ? (
                    <p className="col-span-8 text-center text-xs text-muted-foreground py-6">No icons match "{query}"</p>
                ) : filtered.map((name) => {
                    const Icon = iconLibrary[name];
                    const active = value === name;
                    return (
                        <button
                            key={name}
                            type="button"
                            title={name}
                            onClick={() => onChange(name)}
                            className={cn(
                                "aspect-square rounded-lg flex items-center justify-center transition-all",
                                active
                                    ? "bg-gray-900 text-white shadow-sm scale-105"
                                    : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                            )}
                        >
                            <Icon className="w-[18px] h-[18px]" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
