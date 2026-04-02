import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Loader2, ExternalLink, RefreshCw, User, Info } from "lucide-react";
import { toast } from "sonner";

// Use the PAT provided by the user
const CALENDLY_PAT = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzc1MTEwMDgzLCJqdGkiOiIxNGZiNTRhOC05Y2JhLTRiZjItYWRlZS0zOGQyMmQzNTE2MjIiLCJ1c2VyX3V1aWQiOiIwMWNkYjRiZi0yNDJjLTQ5ZGYtYjQxMS0xOGYxMzg0ZDMxMGUiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUgYWN0aXZpdHlfbG9nOnJlYWQgZGF0YV9jb21wbGlhbmNlOndyaXRlIG91dGdvaW5nX2NvbW11bmljYXRpb25zOnJlYWQifQ.Tk4Wl-5aHw04qgu9anCBXHfmf6jLkt1X0L8NgrGhs4t78pB41ab-4KeTJOhScIXH-nAWyQfOHAu5BTLSxJblzA";

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

export default function AdminBookings() {
  const [events, setEvents] = useState<CalendlyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    setRefreshing(true);
    try {
      // 1. Get current user URI
      const userRes = await fetch("https://api.calendly.com/users/me", {
        headers: {
          Authorization: `Bearer ${CALENDLY_PAT}`,
          "Content-Type": "application/json",
        },
      });
      const userData = await userRes.json();
      const userUri = userData.resource.uri;

      // 2. Fetch scheduled events
      const eventsRes = await fetch(
        `https://api.calendly.com/scheduled_events?user=${userUri}&status=active`,
        {
          headers: {
            Authorization: `Bearer ${CALENDLY_PAT}`,
            "Content-Type": "application/json",
          },
        }
      );
      const eventsData = await eventsRes.json();
      
      // Sort by start_time (soonest first)
      const sortedEvents = eventsData.collection.sort((a: any, b: any) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      
      setEvents(sortedEvents);
    } catch (err) {
      console.error("Failed to fetch Calendly events", err);
      toast.error("Failed to sync with Calendly. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Syncing with your Calendly...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meeting Dashboard</h2>
          <p className="text-muted-foreground mt-2">View and join your upcoming scheduled meetings.</p>
        </div>
        <Button 
          onClick={fetchBookings} 
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No upcoming meetings</h3>
            <p className="text-muted-foreground max-w-sm">
              Your calendar is currently clear. Scheduled bookings will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const joinUrl = event.location?.join_url;
            const isGoogleMeet = event.location?.type === "google_conference";
            const isZoom = event.location?.type === "zoom_conference";
            
            return (
              <Card key={event.uri} className="overflow-hidden border-border/50 hover:border-blue-500/50 transition-all hover:shadow-lg group">
                <CardHeader className="bg-secondary/10 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                       Upcoming
                    </span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl mt-3 line-clamp-1">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(event.start_time)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {formatTime(event.start_time)} — {formatTime(event.end_time)}
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    {joinUrl ? (
                      <Button 
                        asChild 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <a href={joinUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </a>
                      </Button>
                    ) : (
                      <div className="p-3 bg-secondary/50 rounded-lg flex items-center gap-2 text-xs text-muted-foreground border border-border/50">
                        <Info className="w-3 h-3" />
                        No join link provided yet
                      </div>
                    )}
                    
                    <Button variant="ghost" asChild className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                      <a href={event.uri.replace('api', 'calendly')} target="_blank" rel="noopener noreferrer" className="gap-2">
                        View Details On Calendly
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 p-6 bg-secondary/30 rounded-2xl border border-border/50 flex items-start gap-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <User className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-1">How it works</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This dashboard is synced with your live Calendly account. Every time a user books through your site, it will instantly appear here with the correct join link.
          </p>
        </div>
      </div>
    </div>
  );
}
