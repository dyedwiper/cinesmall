import * as z from 'zod';

export const AdvertisementSchema = z.object({
    screeningId: z.uuidv4(),
    name: z.string(),
    duration: z.int().gt(0),
});
