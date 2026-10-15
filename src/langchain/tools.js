import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fetchMenu } from '../api/airbean';

export const getMenu = tool(
    async () => {
        const menu = await fetchMenu();

        return JSON.stringify(menu);
    },
    {
        name: 'get_menu',
        description:
            'Hämtar caféets aktuella meny. Använd ENDAST när du behöver aktuell information om produkter, ingredienser, priser eller utbud. Använd INTE för hälsningar, tack eller allmänt småprat.',
        schema: z.object({}),
    },
);
