import { llm } from './llm';
import { getMenu } from './tools';
import { ToolMessage } from '@langchain/core/messages';
import { messagePrompt } from './prompts';

// Tillgängliga verktyg
const tools = [getMenu];

// Koppa verktygen till modellen
const llmWithTools = llm.bindTools(tools);

// Skapa kedja
const chain = messagePrompt.pipe(llmWithTools);

export const invokeAssistant = async (history, question) => {
    const messages = await messagePrompt.formatMessages({
        history,
        question,
    });

    for (let i = 0; i < 5; i++) {
        const response =
            i === 0
                ? await chain.invoke({ history, question })
                : await llmWithTools.invoke(messages);

        console.log('CONTENT', response.content);
        console.log('TOOL CALLS', response.tool_calls);

        messages.push(response);

        // Om modellen inte vill använda något verktyg
        // Returnerar svaret till useChat
        if (!response.tool_calls.length) {
            return {
                content: response.content,
            };
        }

        // Kör verktygen som modellen har valt ut
        for (const toolCall of response.tool_calls) {
            const selectedTool = tools.find(
                (tool) => tool.name === toolCall.name,
            );

            if (!selectedTool) {
                throw new Error(`Verktyget ${toolCall.name} hittades inte.`);
            }

            const result = await selectedTool.invoke(toolCall.args);
            console.log('TOOL RESULT', JSON.parse(result));

            // if (toolCall.name === 'create_booking') {
            //     const data =
            //         typeof result === 'string' ? JSON.parse(result) : result;

            //     if (data.success) {
            //         booking = data.booking;
            //     }
            // }

            // Skicka verktygets resultat tillbaks till modellen
            messages.push(
                new ToolMessage({
                    content:
                        typeof result === 'string'
                            ? result
                            : JSON.stringify(result),
                    tool_call_id: toolCall.id,
                }),
            );
        }
    }
};
