import BotSettingsUpdate from "@/components/BotSettingsUpdate";
import BotPreview from "@/components/dashboard/Bot-Preview";
import { db } from "@/db";

import { validateRequest } from "@/lib/validateRequest";
import { bots } from "@/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Settings() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  const data = await db.query.bots.findFirst({
    where: eq(bots.userId, user.id)
  });
  console.log(data);
  if (!data) {
    return redirect("/agent-setup");
  }
  return (
    <div>
      <BotSettingsUpdate data={data} />
      <BotPreview />
    </div>
  );
}
