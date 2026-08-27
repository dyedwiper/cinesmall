import ticketing from "./contexts/ticketing/api/ticketing.route.js";
import weekplanning from "./contexts/weekplanning/api/weekplanning.route.js";
import { DomainError } from "./shared/domain-error.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.onError((err, c) => {
	if (err instanceof DomainError) {
		return c.json({ error: err.code, message: err.message }, 400);
	}
	console.error(err);
	return c.json({ error: "INTERNAL", message: "Internal server error" }, 500);
});

app.get("/", async (c) => c.text("Success"));

app.route("/weekplanning", weekplanning);
app.route("/ticketing", ticketing);

serve(
	{
		fetch: app.fetch,
		port: 2300,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	}
);
