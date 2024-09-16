import { db } from "@/db";
import { findRelevantContent } from "@/lib/ai/embedding";
import { bots } from "@/schema";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query, botId } = await req.json();

  if (!query || !botId) {
    return NextResponse.json({ error: "All fields Required" }, { status: 400 });
  }

  const dataPresent = await db.query.bots.findFirst({
    where: eq(bots.id, botId),
  });

  if (!dataPresent) {
    return NextResponse.json({ status: 400, error: "Bot not registered" });
  }

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });


  const content = await findRelevantContent(query, botId)

  try {
    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      system: `You are a helpful assistant. Check your knowledge base before answering any questions. keep the answers as short as possible while still giving enough information.
    Only respond to questions using information from given data but do not mention that given data.
    (important) if no relevant information is found in given data, respond, "Sorry, I don't know." here is the data -` + content,
      prompt: query,
    });
    return NextResponse.json({
      test: text
    });
  } catch (error) {
    console.log("error", error)
    return NextResponse.json({
      error: "Internal server error",
      errorDetails: error
    });
  }


}



