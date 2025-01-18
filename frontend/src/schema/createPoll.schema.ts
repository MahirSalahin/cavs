import { z } from 'zod';

export const CreatePollSchema = z.object({
    title: z.string().trim().min(3, 'Title is too short'),
    description: z.optional(z.string().trim().min(3, 'Description is too short')),
    start_time: z.date().refine((date) => date >= new Date(Date.now() - 3600000), 'Start date must be within the last hour'),
    end_time: z.date().refine((date) => date >= new Date(), 'End date must be within the last hour'),
    id_pairs: z.array(z.object({
        start_id: z.union([z.string(), z.number()])
            .refine((val) => !Number.isNaN(parseInt(val.toString(), 10)), 'Must be a valid number')
            .transform((val) => parseInt(val.toString(), 10))
            .refine((val) => val >= 1901001, 'Must be 1901001 or above'),
        end_id: z.union([z.string(), z.number()])
            .refine((val) => !Number.isNaN(parseInt(val.toString(), 10)), 'Must be a valid number')
            .transform((val) => parseInt(val.toString(), 10))
            .refine((val) => val >= 1901001, 'Must be 1901001 or above'),
    }).refine((data) => data.end_id >= data.start_id, {
        message: 'End ID must be greater than or equal Start ID',
        path: ['end_id'], // Error reported on end_id
    })),
    options: z.array(z.string().trim().min(1, 'Option is too short')).min(2, 'At least 2 options are required'),
    is_private: z.boolean(),
}).refine((data) => data.end_time > data.start_time, {
    message: 'End Time must be greater than Start Time',
    path: ['end_time'], // Error reported on end_time
});
