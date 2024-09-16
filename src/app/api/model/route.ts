import { Crawler } from "@/lib/crawler";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validateRequest";
import { handleDatabaseUpdate } from "@/actions/agent.controller";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { agents, embeddings } from "@/schema";
import { generateEmbeddings } from "@/lib/ai/embedding";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ status: 401, error: "Unauthorized access" });
    }

    const {
      websites,
      websiteName,
    }: { websites: string[]; websiteName: string } = await request?.json();
    if (!websites || !websiteName) {
      return NextResponse.json({ error: "All fields required!", status: 402 });
    }

    const alreadyHavingAgent = await db.query.agents.findFirst({
      where: eq(agents.userId, user.id),
    });

    if (alreadyHavingAgent) {
      return NextResponse.json({
        error: "Agent already created!",
        status: 400,
      });
    }

    const botId = await handleDatabaseUpdate(user, websiteName);

    const crawler = new Crawler(websites, 10, 200);
    await crawler.start();

    const generatedEmbeddings = await generateEmbeddings(crawler.pages);

    console.log(generateEmbeddings)

    await db.insert(embeddings).values(
      generatedEmbeddings.map(embedding => ({
        botId: botId,
        ...embedding,
      })),
    );


    return NextResponse.json({
      status: 200,
      data: botId,
    });
  } catch (err) {
    console.log("Error while handling newModel route", err);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

