/**
 * NextAuth v4 catch-all API route
 * Handles: /api/auth/signin, /api/auth/callback/google, /api/auth/session, etc.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };