import React, { useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/* ────────────────────────── Page header ────────────────────────── */

export function PageHeader({
    title, description, children,
}: { title: string; description?: string; children?: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
        </div>
    );
}

/* ────────────────────────── Search input ────────────────────────── */

export function SearchInput({
    value, onChange, placeholder = "Search…", className,
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9 h-9 bg-white"
            />
        </div>
    );
}

/* ────────────────────────── Filter pills ────────────────────────── */

export function FilterPills({
    options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={cn(
                        "px-3 h-8 rounded-full text-xs font-medium transition-colors border",
                        value === opt
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    )}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

/* ────────────────────────── Sortable table header ────────────────────────── */

export type SortState = { key: string; dir: "asc" | "desc" } | null;

export function useSort(initial: SortState = null) {
    const [sort, setSort] = useState<SortState>(initial);
    const toggle = (key: string) =>
        setSort((s) =>
            !s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null
        );
    return { sort, toggle };
}

export function sortItems<T>(items: T[], sort: SortState, get?: (item: T, key: string) => unknown): T[] {
    if (!sort) return items;
    const read = get ?? ((item: T, key: string) => (item as Record<string, unknown>)[key]);
    return [...items].sort((a, b) => {
        const av = read(a, sort.key), bv = read(b, sort.key);
        const an = typeof av === "number" && typeof bv === "number";
        const cmp = an
            ? (av as number) - (bv as number)
            : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true, sensitivity: "base" });
        return sort.dir === "asc" ? cmp : -cmp;
    });
}

export function Th({
    label, sortKey, sort, onSort, className, align = "left",
}: {
    label: string; sortKey?: string; sort?: SortState;
    onSort?: (key: string) => void; className?: string; align?: "left" | "right";
}) {
    const active = sortKey && sort?.key === sortKey;
    const Icon = !active ? ArrowUpDown : sort!.dir === "asc" ? ArrowUp : ArrowDown;
    return (
        <th className={cn("h-11 px-4 align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap", align === "right" ? "text-right" : "text-left", className)}>
            {sortKey && onSort ? (
                <button
                    onClick={() => onSort(sortKey)}
                    className={cn("inline-flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider", active && "text-foreground")}
                >
                    {label}
                    <Icon className="w-3 h-3" />
                </button>
            ) : label}
        </th>
    );
}

/* ────────────────────────── Table shell / states ────────────────────────── */

export function TableShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative w-full overflow-x-auto">
                <table className="w-full text-sm">{children}</table>
            </div>
        </div>
    );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">{label}</span>
        </div>
    );
}

export function EmptyState({
    title, description, action,
}: { title: string; description?: string; action?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Inbox className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-medium mb-1">{title}</h3>
            {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
            {action}
        </div>
    );
}

/* ────────────────────────── Status badge ────────────────────────── */

export function StatusBadge({ status }: { status: string }) {
    const published = status?.toLowerCase() === "published";
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            published ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
        )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", published ? "bg-emerald-500" : "bg-amber-500")} />
            {status}
        </span>
    );
}

/* ────────────────────────── Slide-over form panel ────────────────────────── */

export function FormSheet({
    open, onOpenChange, title, description, dirty, saving, onSave, saveLabel = "Save changes", children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    dirty?: boolean;
    saving?: boolean;
    onSave: () => void;
    saveLabel?: string;
    children: React.ReactNode;
}) {
    const [confirmClose, setConfirmClose] = useState(false);

    const handleOpenChange = (next: boolean) => {
        if (!next && dirty) { setConfirmClose(true); return; }
        onOpenChange(next);
    };

    return (
        <>
            <Sheet open={open} onOpenChange={handleOpenChange}>
                <SheetContent className="admin-portal w-full sm:max-w-xl p-0 flex flex-col gap-0">
                    <SheetHeader className="px-6 py-4 border-b text-left shrink-0">
                        <SheetTitle>{title}</SheetTitle>
                        {description && <SheetDescription>{description}</SheetDescription>}
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                    <div className="px-6 py-4 border-t flex items-center justify-between gap-3 shrink-0 bg-gray-50/80">
                        <span className="text-xs text-muted-foreground">
                            {dirty ? "Unsaved changes" : ""}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                            <Button onClick={onSave} disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {saving ? "Saving…" : saveLabel}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
                <AlertDialogContent className="admin-portal">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have edits that haven't been saved. Closing this panel will discard them.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep editing</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => { setConfirmClose(false); onOpenChange(false); }}
                        >
                            Discard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

/* ────────────────────────── Confirm delete dialog ────────────────────────── */

export function ConfirmDialog({
    open, onOpenChange, title = "Are you sure?", description = "This action cannot be undone.",
    confirmLabel = "Delete", onConfirm, loading,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    loading?: boolean;
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="admin-portal">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loading}
                        onClick={(e) => { e.preventDefault(); onConfirm(); }}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/* ────────────────────────── Form field helpers ────────────────────────── */

export function Field({
    label, required, hint, children, className,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <label className="text-sm font-medium text-gray-700">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

/* ────────────────────────── Utils ────────────────────────── */

export function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
