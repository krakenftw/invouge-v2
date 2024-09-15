"use server";
import { cookies } from "next/headers";

import { type Session, type User } from "lucia";
import { lucia } from "@/auth";
import { db } from "@/db";
import { users } from "@/schema"
import { eq } from "drizzle-orm";

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch { }
  const userData = await db.query.users.findFirst({
    where: eq(users.id, result.user?.id),
  });
  result.user = userData!;
  return result;
};
