import { ChatOllama } from '@langchain/ollama';

export const llm = new ChatOllama({
    model: 'gemma3:4b',
    temperature: 0.5, // "kreativitet"
    topP: 0.5, // val av sannolikhet
    numPredict: 200, // max output token
    think: false, // tänkande
});
