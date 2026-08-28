import { db } from "../db";
import * as schema from "../db/schema";
import { reset } from "drizzle-seed";

afterEach(() => {
	reset(db, schema);
});
