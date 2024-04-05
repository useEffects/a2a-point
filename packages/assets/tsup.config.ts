// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
    // Entry point of your application
    entryPoints: ['./index.ts'],
    // Include JSON and CSS files in the bundle
    include: ['**/*.json', '**/*.css'],
});
