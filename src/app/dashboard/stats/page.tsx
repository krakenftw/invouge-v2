import VisitorChart from "@/components/dashboard/VisitorChart";
import { db } from "@/db";
import { validateRequest } from "@/lib/validateRequest";
import { bots } from "@/schema";
import { eq } from "drizzle-orm";

export default async function Stats() {
  const { user } = await validateRequest();
  if (!user) {
    return;
  }
  const bot = await db.query.bots.findFirst({
    where: eq(bots.userId, user.id)
  });
  if (!bot) {
    return;
  }
  const visitors = await db.query.visitors.findMany({
    where: eq(bots.id, bot.id)
  });
  return (
    <div className='flex flex-col gap-4'>
      <div className='border-[1px] border-border p-4 rounded-lg'>
        Number of visitors: {visitors.length}
      </div>
      <VisitorChart />
      <div className='border-[1px] border-border p-4 rounded-lg'>
        Bot Replies: {bot.botInteractions}
      </div>
    </div>
  );
}
