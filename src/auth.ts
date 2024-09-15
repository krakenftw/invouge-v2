import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { adapter } from "./db";


export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes: any) => {
        return {
            githubId: attributes.github_id,
            username: attributes.username,
        };
    },
});

export const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,
);

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}
