import DeleteBot from "@/components/dashboard/DeleteBot";
import SidebarButtons from "@/components/dashboard/SideBarButtons";
import { db } from "@/db";
import { validateRequest } from "@/lib/validateRequest";
import { bots } from "@/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function SettingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  const bot = await db.query.bots.findFirst({
    where: eq(bots.userId, user.id)
  });
  if (!bot) {
    return redirect("/agent-setup");
  }
  return (
    <div className='flex flex-grow gap-4 md:gap-0 flex-col-reverse justify-between md:flex-row'>
      <div className='flex justify-between border border-l-0 rounded-lg border-border rounded-tl-none rounded-bl-none flex-row md:flex-col p-3 m-2 md:m-0 md:mb-4'>
        <SidebarButtons />
        <div className='flex items-center justify-center'>
          <DeleteBot user={user} />
        </div>
      </div>

      <div className='w-full px-4'>{children}</div>
    </div>
  );
}
