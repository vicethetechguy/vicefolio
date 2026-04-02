import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface TextsContextType {
    texts: Record<string, string>;
    loading: boolean;
    getText: (id: string, fallback: string) => string;
}

const TextsContext = createContext<TextsContextType | undefined>(undefined);

export function TextsProvider({ children }: { children: ReactNode }) {
    const [texts, setTexts] = useState<Record<string, string>>(() => {
        try {
            const cached = localStorage.getItem("vice_text_config");
            return cached ? JSON.parse(cached) : {};
        } catch (e) {
            return {};
        }
    });
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const { data, error } = await supabase.from("texts").select("*");
                if (!error && data) {
                    const map: Record<string, string> = {};
                    data.forEach((row: any) => {
                        map[row.id] = row.value;
                    });
                    setTexts(map);
                    localStorage.setItem("vice_text_config", JSON.stringify(map));
                }
            } catch (err) {
                console.error("Failed to fetch texts", err);
            } finally {
                setLoading(false);
                // We add a tiny 300ms delay to ensure React has finished rendering the first frame
                setTimeout(() => setIsInitialized(true), 300);
            }
        };
        fetchTexts();
    }, []);

    const getText = (id: string, fallback: string) => {
        return texts[id] || fallback;
    };

    return (
        <TextsContext.Provider value={{ texts, loading, getText }}>
            {/* 
                PREMIUM ENTRANCE: 
                We hide the whole app until texts are confirmed to be loaded.
                This prevents the "Flash of Old Text" entirely.
            */}
            {!isInitialized && (
                <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                    <div className="relative">
                        <div className="w-16 h-16 border-t-2 border-vice-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-vice-500">VC</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={`transition-opacity duration-700 ${isInitialized ? "opacity-100" : "opacity-0"}`}>
                {children}
            </div>
        </TextsContext.Provider>
    );
}

export function useTexts() {
    const context = useContext(TextsContext);
    if (context === undefined) {
        throw new Error("useTexts must be used within a TextsProvider");
    }
    return context;
}
