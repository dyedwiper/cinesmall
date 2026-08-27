import { db } from "../../../shared/db/index.js";

export async function getScreeningsByWeekplanId(weekplanId: string) {
	return db.query.screenings.findMany({ where: { weekplanId } });
}
