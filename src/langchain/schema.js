import { z } from 'zod';

export const orderSchema = z.object({
    items: z
        .array(
            z.object({
                name: z.string().describe('Produktens namn från caféets meny.'),
                quantity: z
                    .number()
                    .int()
                    .positive()
                    .describe('Antal av produkten.'),
            }),
        )
        .describe('Produkterna som kunden vill beställa.'),
});
