import * as z from 'zod';

export const WeekplanSchema = z.object({
    startDate: z.iso.date(),
});
