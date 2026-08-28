import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
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
