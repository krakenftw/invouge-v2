import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/validateRequest";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { agents } from "@/schema";
import AgentSetupInteractive from "@/components/agentSetupInteractive";

export default async function AgentSetup() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  const agentData = await db.query.agents.findFirst({
    where: eq(agents.id, user.id)
  });
  if (agentData) {
    return redirect("/dashboard");
  }
  return (
    <div className='flex flex-col gap-2 w-screen'>
      <div className='p-5 flex flex-col gap-4'>
        <h1 className='text-3xl font-bold ml-2'>Agent Setup</h1>
        <AgentSetupInteractive />
      </div>
      <div className='flex w-2/5'></div>
    </div>
  );
}
