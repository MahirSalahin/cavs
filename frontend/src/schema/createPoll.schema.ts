
import { z } from 'zod';

export const CreatePollSchema = z.object({
    title: z.string().trim().min(3, 'Title is too short'),
    description: z.optional(z.string().trim().min(3, 'Description is too short')),
    startTime: z.date().refine((date) => date > new Date(), 'Start date must be in the future'),
    endTime: z.date().refine((date) => date > new Date(), 'End date must be in the future'),
    rollFrom: z.number().int().positive(),
    rollTo: z.number().int().positive(),
});