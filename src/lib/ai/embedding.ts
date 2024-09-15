import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

interface CrawlerData {
    url: string;
    text: string;
}

interface EmbeddingResult {
    url: string;
    content: string;
    embedding: number[];
}

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string, maxChunkLength: number = 1000): string[] => {
    const words = input.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
        if ((currentChunk + ' ' + word).length <= maxChunkLength) {
            currentChunk += (currentChunk ? ' ' : '') + word;
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = word;
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
};

export const generateEmbeddings = async (
    crawlerData: CrawlerData[]
): Promise<EmbeddingResult[]> => {
    const allChunks: { url: string; content: string }[] = [];

    for (const data of crawlerData) {
        const textChunks = generateChunks(data.text);
        allChunks.push(...textChunks.map(chunk => ({ url: data.url, content: chunk })));
    }

    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: allChunks.map(chunk => chunk.content),
    });

    return allChunks.map((chunk, i) => ({
        url: chunk.url,
        content: chunk.content,
        embedding: embeddings[i],
    }));
};