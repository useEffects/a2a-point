import { cn } from "@/lib/utils";

export function GridBackground({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("h-full w-full bg-background  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center", className)}>
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)))]"></div>
            {children}
        </div>
    );
}
