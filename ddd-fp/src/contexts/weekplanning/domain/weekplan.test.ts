import * as Screening from "./screening.js";
import * as Weekplan from "./weekplan.js";

describe("addScreening", () => {
	test("adds a screening", () => {
		const weekplan = Weekplan.buildWeekplan({ startDate: "2026-07-16" });
		const screening = Screening.buildScreening({
			weekplanId: weekplan.id,
			date: "2026-07-17",
			hallNumber: 1,
			film: "La Rupture",
			duration: 90,
		});

		const updated = Weekplan.addScreening(weekplan, screening);

		expect(updated.screenings).toHaveLength(1);
	});

	test("throws an error if screening date does not belong to weekplan", () => {
		const weekplan = Weekplan.buildWeekplan({ startDate: "2026-07-16" });
		const screening = Screening.buildScreening({
			weekplanId: weekplan.id,
			date: "2026-08-17",
			hallNumber: 1,
			film: "La Rupture",
			duration: 90,
		});

		expect(() => Weekplan.addScreening(weekplan, screening)).toThrow();
	});
});
