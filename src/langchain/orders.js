import { llm } from './llm';
import { orderSchema } from './schema';
import menu from '../data/menu';
import { orderPrompt } from './prompts';

const structuredLLM = llm.withStructuredOutput(orderSchema);

const orderChain = orderPrompt.pipe(structuredLLM);

export const interpretOrder = async (question) => {
    const order = await orderChain.invoke({
        menu: JSON.stringify(menu),
        question,
    });

    console.log('ORDER', order);

    return order;
};
