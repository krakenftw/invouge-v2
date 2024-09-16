import LinkToBot from "@/components/dashboard/LinkToBot";
import { db } from "@/db";
import { validateRequest } from "@/lib/validateRequest";
import { bots } from "@/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  const bot = await db.query.bots.findFirst({
    where: eq(bots.userId, user.id)
  });
  if (!bot) {
    redirect("/agent-setup");
  }
  const botCode: string = `<chatBotInvouge agent-id="${bot.id}"></chatBotInvouge><script src="bot.js"></script>`;

  return (
    <div className='flex flex-col gap-4'>
      <LinkToBot botCode={botCode} />
      <div className='flex flex-col gap-4 rounded-lg border border-border p-4'>
        <h1 className='text-lg'>How to add bot to website</h1>
        <p className='md:text-md text-sm'>
          · Open the HTML file of your website where you want to add
          the bot
        </p>

        <p className='md:text-md text-sm'>
          · Paste the copied code snippet into the appropriate section
          of your HTML file. Typically, this is placed within the $
          {"<body>"} tag or at the end of the ${"<head>"} section
        </p>
      </div>
    </div>
  );
}
