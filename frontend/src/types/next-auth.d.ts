// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      provider?: string;  
    };
  }

  interface User {
    plan?: string;
    provider?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    plan?: string;
    provider?: string;
    error?: string;
  }
}

export {};
