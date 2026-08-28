import { loadEnv } from "vite";
import { defineProject } from "vitest/config";

export default defineProject({
	test: {
		projects: [
			{
				test: {
					name: "Integration Tests",
					globals: true,
					include: [`**/*.int-test.ts`],
					env: loadEnv("test", process.cwd(), ""),
					globalSetup: "src/shared/test/globalSetup.ts",
					setupFiles: "src/shared/test/clearDb.ts",
					fileParallelism: false,
				},
			},
			{
				test: {
					name: "Unit Tests",
					globals: true,
					include: [`**/*.test.ts`],
				},
			},
		],
	},
});
