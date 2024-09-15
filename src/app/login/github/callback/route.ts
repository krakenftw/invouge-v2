import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github, lucia } from "@/auth";
import { users } from "@/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || state !== storedState) {
    return NextResponse.json({ status: 400, error: "Invalid request" });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await fetchGithubUser(tokens.accessToken);
    const primaryEmail = await fetchGithubPrimaryEmail(tokens.accessToken);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.githubId, githubUser.id),
    });

    if (existingUser) {
      return await handleExistingUser(existingUser, githubUser, primaryEmail);
    } else {
      return await handleNewUser(githubUser, primaryEmail);
    }
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
}

async function fetchGithubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

async function fetchGithubPrimaryEmail(accessToken: string): Promise<string> {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const emails = await response.json();
  return emails[0].email;
}

async function handleExistingUser(existingUser: any, githubUser: GitHubUser, primaryEmail: string): Promise<Response> {
  const session = await lucia.createSession(existingUser.id, {
    name: githubUser.name,
    email: primaryEmail,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}

async function handleNewUser(githubUser: GitHubUser, primaryEmail: string): Promise<Response> {
  const uuid = uuidv4();
  await db.insert(users).values({
    id: uuid,
    email: primaryEmail,
    name: githubUser.name,
    github_id: githubUser.id,
    username: githubUser.login,
    password: "",
    profile_picture: githubUser.avatar_url,
  });

  const session = await lucia.createSession(uuid, {
    name: githubUser.name,
    email: primaryEmail,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}