import * as z from 'zod';

export const ScreeningSchema = z.object({
    weekplanId: z.uuidv4(),
    date: z.iso.datetime(),
    hallNumber: z.literal([1, 2]),
    film: z.string(),
    duration: z.int().gt(0),
});
