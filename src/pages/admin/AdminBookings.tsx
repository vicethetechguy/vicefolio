import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Calendar, Clock, Video, ExternalLink, RefreshCw, Info, Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SearchInput, LoadingState, EmptyState } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

// Set VITE_CALENDLY_PAT in your .env file. Do not commit tokens to source control.
const CALENDLY_PAT = import.meta.env.VITE_CALENDLY_PAT as string | undefined;

interface CalendlyEvent {
    uri: string;
    name: string;
    status: string;
    start_time: string;
    end_time: string;
    location: {
        type: string;
        join_url?: string;
    };
    invitees_counter: {
        total: number;
        active: number;
    };
}

function isToday(d: Date) {
    const now = new Date();
    return d.toDateString() === now.toDateString();
}

function isThisWeek(d: Date) {
    const now = new Date();
    const week = new Date(now);
    week.setDate(now.getDate() + 7);
    return d >= now && d <= week;
}

export default function AdminBookings() {
    const [events, setEvents] = useState<CalendlyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const fetchBookings = async () => {
        if (!CALENDLY_PAT) {
            setLoading(false);
            return;
        }
        setRefreshing(true);
        try {
            const userRes = await fetch("https://api.calendly.com/users/me", {
                headers: { Authorization: `Bearer ${CALENDLY_PAT}`, "Content-Type": "application/json" },
            });
            const userData = await userRes.json();
            const userUri = userData.resource.uri;

            const eventsRes = await fetch(
                `https://api.calendly.com/scheduled_events?user=${userUri}&status=active`,
                { headers: { Authorization: `Bearer ${CALENDLY_PAT}`, "Content-Type": "application/json" } }
            );
            const eventsData = await eventsRes.json();
            const sorted = (eventsData.collection as CalendlyEvent[]).sort(
                (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            );
            setEvents(sorted);
        } catch (err) {
            console.error("Failed to fetch Calendly events", err);
            toast.error("Failed to sync with Calendly. Check your connection.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return events;
        const q = search.toLowerCase();
        return events.filter((e) => e.name?.toLowerCase().includes(q));
    }, [events, search]);

    const todayCount = events.filter((e) => isToday(new Date(e.start_time))).length;
    const weekCount = events.filter((e) => isThisWeek(new Date(e.start_time))).length;

    const formatDate = (s: string) =>
        new Date(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const formatTime = (s: string) =>
        new Date(s).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    if (!CALENDLY_PAT) {
        return (
            <div className="p-5 sm:p-8 max-w-6xl mx-auto w-full">
                <PageHeader title="Meetings" description="View and join your upcoming scheduled meetings." />
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <EmptyState
                        title="Calendly is not connected"
                        description="Add VITE_CALENDLY_PAT to your .env file with your Calendly Personal Access Token, then rebuild the site."
                    />
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-5 sm:p-8">
                <LoadingState label="Syncing with your Calendly…" />
            </div>
        );
    }

    return (
        <div className="p-5 sm:p-8 max-w-6xl mx-auto w-full">
            <PageHeader title="Meetings" description="View and join your upcoming scheduled meetings.">
                <Button onClick={fetchBookings} disabled={refreshing} variant="outline" className="gap-2 bg-white">
                    <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    {refreshing ? "Syncing…" : "Sync Now"}
                </Button>
            </PageHeader>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Upcoming", value: events.length, icon: Calendar },
                    { label: "Today", value: todayCount, icon: Clock },
                    { label: "This Week", value: weekCount, icon: Users },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                            <s.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xl font-bold leading-none">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {events.length > 0 && (
                <SearchInput value={search} onChange={setSearch} placeholder="Search meetings…" className="mb-4 sm:w-72" />
            )}

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300">
                    <EmptyState
                        title={events.length === 0 ? "No upcoming meetings" : "No meetings match your search"}
                        description={events.length === 0
                            ? "Your calendar is clear. Bookings made through your site will appear here automatically."
                            : "Try a different search."}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((event) => {
                        const joinUrl = event.location?.join_url;
                        const start = new Date(event.start_time);
                        const today = isToday(start);
                        return (
                            <div key={event.uri} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all overflow-hidden flex flex-col">
                                <div className="p-4 pb-3 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded",
                                            today ? "text-emerald-700 bg-emerald-50" : "text-blue-600 bg-blue-50"
                                        )}>
                                            {today ? "Today" : "Upcoming"}
                                        </span>
                                        {event.invitees_counter?.active > 0 && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {event.invitees_counter.active}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold line-clamp-1" title={event.name}>{event.name}</h3>
                                </div>
                                <div className="p-4 space-y-2.5 flex-1">
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(event.start_time)}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {formatTime(event.start_time)} — {formatTime(event.end_time)}
                                    </div>
                                </div>
                                <div className="p-4 pt-0 space-y-2">
                                    {joinUrl ? (
                                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                            <a href={joinUrl} target="_blank" rel="noopener noreferrer">
                                                <Video className="w-4 h-4" /> Join Meeting
                                            </a>
                                        </Button>
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-muted-foreground border border-gray-100">
                                            <Info className="w-3.5 h-3.5 shrink-0" /> No join link provided yet
                                        </div>
                                    )}
                                    <Button variant="ghost" asChild className="w-full text-xs text-muted-foreground hover:text-foreground h-8">
                                        <a href={event.uri.replace("api", "calendly")} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                                            View on Calendly <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
