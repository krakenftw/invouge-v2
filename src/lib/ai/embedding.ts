import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';
import { embeddings } from '@/schema';
import { db } from '@/db';

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

const generateChunks = (input: string, maxChunkLength: number = 200): string[] => {
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

export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    console.log(embedding)
    return embedding;
};

export const findRelevantContent = async (userQuery: string, botId: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5) && eq(embeddings.botId, botId))
        .orderBy(t => desc(t.similarity))
        .limit(5);

    let data = "";
    similarGuides.forEach(eachGuide => {
        data += eachGuide.name
    })
    return data;
};