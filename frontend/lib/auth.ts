// auth.ts
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { google } from "googleapis";

async function refreshAccessToken(token: any) {
  try {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    client.setCredentials({
      refresh_token: token.refreshToken,
    });

    const { credentials } = await client?.refreshAccessToken();

    return {
      ...token,
      accessToken: credentials.access_token,
      accessTokenExpires: credentials.expiry_date ?? (Date.now() + 3600 * 1000),
      refreshToken: credentials.refresh_token ?? token.refreshToken,
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error(" Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;

        // Fix: detect if expires_at is in seconds or ms
        const expiresAt = account.expires_at ?? Math.floor(Date.now() / 1000);
        token.accessTokenExpires = expiresAt < 10 ** 12
          ? expiresAt * 1000
          : expiresAt;
      }

      const db = (await clientPromise).db();
      const dbUser = await db.collection("users").findOne({ email: token.email });

      token.plan = dbUser?.plan || "free";
      token.provider = account?.provider || dbUser?.provider || "google";

      if (dbUser && !dbUser.provider && token.provider) {
        await db.collection("users").updateOne(
          { email: token.email },
          { $set: { provider: token.provider, plan: token.plan } }
        );
      }

      // If access token is still valid, return it
      if (Date.now() < ((token as any).accessTokenExpires ?? 0)) {
        return token;
      }


      // Otherwise, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.plan = token.plan as string;
        session.user.provider = token.provider as string;
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
