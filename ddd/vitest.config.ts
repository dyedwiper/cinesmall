import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        projects: [
            {
                test: {
                    name: 'Integration Tests',
                    globals: true,
                    include: [`**/*.int-test.ts`],
                    setupFiles: 'src/shared/test/dbSetup.ts',
                },
            },
            {
                test: {
                    name: 'Unit Tests',
                    globals: true,
                    include: [`**/*.test.ts`],
                },
            },
        ],
    },
});
