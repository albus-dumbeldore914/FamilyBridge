/**
 * NextAuth v4 Configuration
 * Provider: Google OAuth
 * Database: Neon PostgreSQL (auto-detects live connection string)
 * Session strategy: JWT
 */

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Check if a real DATABASE_URL is configured (not the dummy placeholder)
const dbUrl = process.env.DATABASE_URL || "";
const isDatabaseConfigured =
  dbUrl.length > 0 &&
  !dbUrl.includes("user:password") &&
  !dbUrl.includes("host.neon.tech");

export const authOptions: NextAuthOptions = {
  // Only connect Prisma adapter when real database is provided
  ...(isDatabaseConfigured ? { adapter: PrismaAdapter(prisma) as any } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: capture user id & email
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // If database is configured, look up existing role
        if (isDatabaseConfigured && user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true },
            });
            if (dbUser?.role) {
              token.role = dbUser.role;
            }
          } catch (err) {
            console.warn("Notice: Could not load user role from DB during JWT callback:", err);
          }
        }
      }

      // Session update event (when user selects role on /select-role)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-familybridge-promptwars",
  debug: process.env.NODE_ENV === "development",
};