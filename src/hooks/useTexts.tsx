import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface TextsContextType {
    texts: Record<string, string>;
    loading: boolean;
    getText: (id: string, fallback: string) => string;
}

const TextsContext = createContext<TextsContextType | undefined>(undefined);

export function TextsProvider({ children }: { children: ReactNode }) {
    const [texts, setTexts] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTexts = async () => {
            const { data, error } = await supabase.from("texts").select("*");
            if (!error && data) {
                const map: Record<string, string> = {};
                data.forEach((row: any) => {
                    map[row.id] = row.value;
                });
                setTexts(map);
            }
            setLoading(false);
        };
        fetchTexts();
    }, []);

    const getText = (id: string, fallback: string) => {
        return texts[id] || fallback;
    };

    return (
        <TextsContext.Provider value={{ texts, loading, getText }}>
            {children}
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
