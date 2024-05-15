declare module "tailwindcss/lib/util/flattenColorPalette" {
    export default function flattenColorPalette(
        pallette: Record<string, string>,
    ): Record<string, string>;
}

// video.d.ts
/// <reference types="next-video/video-types/global" />