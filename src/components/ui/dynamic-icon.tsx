import { getIcon, isCustomIcon, iconLibrary } from "@/lib/icon-library";
import { cn } from "@/lib/utils";

interface DynamicIconProps {
    /** Either a library key ("Coins") or the URL of an uploaded image. */
    icon?: string | null;
    className?: string;
    fallback?: keyof typeof iconLibrary;
    alt?: string;
}

/**
 * Renders whichever kind of icon the admin chose: a Lucide icon from the
 * curated library, or a custom image they uploaded from their device.
 * Sizing comes from `className` in both cases, so call sites stay identical.
 */
export function DynamicIcon({ icon, className, fallback = "Rocket", alt = "" }: DynamicIconProps) {
    if (isCustomIcon(icon)) {
        return (
            <img
                src={icon!}
                alt={alt}
                loading="lazy"
                className={cn("object-contain", className)}
            />
        );
    }

    const Icon = getIcon(icon, fallback);
    return <Icon className={className} />;
}
