import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
        // maxWorkers is specified to make measurements of test duration more consistent
        maxWorkers: 4,
        projects: [
            {
                test: {
                    name: 'Integration Tests',
                    include: [`**/*.int-test.ts`],
                    globalSetup: 'src/shared/test/globalSetup.ts',
                    setupFiles: 'src/shared/test/dbSetup.ts',
                },
            },
            {
                test: {
                    name: 'Unit Tests',
                    include: [`**/*.test.ts`],
                },
            },
        ],
    },
});
