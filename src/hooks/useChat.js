import { useState, useEffect } from 'react';
import { llm } from '../langchain/llm';
import {
    HumanMessage,
    AIMessage,
    SystemMessage,
} from '@langchain/core/messages';
import { messagePrompt } from '../langchain/prompts';
import menu from '../data/menu';
import { interpretOrder } from '../langchain/orders';

export const useChat = () => {
    // messages innehåller det vi hämtar från localStorage
    const [messages, setMessages] = useState(() => {
        const chatHistory = JSON.parse(localStorage.getItem('messages')) || [
            {
                role: 'assistant',
                content:
                    'Hejsan! Jag är din hjälpsamma AI-assistent! Vad kan jag hjälpa dig med?',
            },
        ];

        return chatHistory.map((message) => {
            if (message.role === 'user') {
                return new HumanMessage(message.content);
            }

            return new AIMessage(message.content);
        });
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [order, setOrder] = useState(null);
    const [orderError, setOrderError] = useState(null);

    // useEffect uppdaterar localStorage när nya meddelanden läggs till
    useEffect(() => {
        const chatHistory = messages.map((message) => ({
            role: message?.getType() === 'human' ? 'user' : 'assistant',
            content: message.content,
        }));

        localStorage.setItem('messages', JSON.stringify(chatHistory));
    }, [messages]);

    // Funktion: getAnswer
    const getAnswer = async (question) => {
        const userMessage = new HumanMessage(question);
        const chain = messagePrompt.pipe(llm);

        const history = [...messages, userMessage];
        setMessages(history);
        setIsLoading(true);
        setError(false);

        try {
            const answer = await chain.invoke({
                menu,
                history: messages,
                question: userMessage,
            });

            console.log(answer);

            const aiMessage = new AIMessage(answer.content);
            setMessages([...history, aiMessage]);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Funktion: createOrderPreview
    const createOrderPreview = async (question) => {
        setOrder(null);
        setOrderError(null);

        try {
            const answer = await interpretOrder(question);
            setOrder(answer);
        } catch (error) {
            setOrderError(error.message);
        }
    };

    // Funktion: clearHistory
    const clearHistory = () => {
        setMessages([
            new AIMessage('Hejsan! Jag är din hjälpsamma AI-assistent!'),
        ]);
    };

    return {
        messages,
        getAnswer,
        isLoading,
        error,
        clearHistory,

        createOrderPreview,
        order,
        orderError,
    };
};
