import { loadEnv } from 'vite';
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
                    env: loadEnv('test', process.cwd(), ''),
                    globalSetup: 'src/shared/test/globalSetup.ts',
                    setupFiles: 'src/shared/test/clearDb.ts',
                    fileParallelism: false,
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
