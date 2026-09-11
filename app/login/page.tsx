"use client";

/**
 * /login — Google OAuth Sign-In Page
 * Miro.com aesthetic: Deep Navy #050038, Yellow #FFD02F, Clean White Card
 */

import React, { useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role) {
        const dashMap: Record<string, string> = {
          primary: "/dashboard/primary",
          guardian: "/dashboard/guardian",
          child: "/dashboard/child",
        };
        router.replace(dashMap[role] ?? "/select-role");
      } else {
        router.replace("/select-role");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#4262FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getErrorMessage = (err: string | null) => {
    if (!err) return null;
    switch (err) {
      case "OAuthSignin":
      case "OAuthCallback":
        return "Google could not verify the login. Ensure the redirect URI 'http://localhost:3000/api/auth/callback/google' is added in your Google Cloud Console.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account.";
      case "AccessDenied":
        return "Access was denied by Google.";
      case "Configuration":
        return "OAuth configuration error. Verify your client ID and secret.";
      default:
        return `Sign in issue: ${err}. Please try again.`;
    }
  };

  const errorMessage = getErrorMessage(errorParam);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-8 shadow-skiff-lg space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center shadow-skiff">
            <Lock className="w-6 h-6 text-[#FF4405]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">
            Sign In to Your Vault
          </h1>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Connect with your verified Google account. Your role (Father, Mother, or Child) will be linked directly to your zero-knowledge profile.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 flex items-start gap-3 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/select-role" })}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#222226] text-[#FAFAFA] font-medium text-sm transition group shadow-skiff"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF4405] group-hover:translate-x-0.5 transition" />
        </button>

        <div className="pt-2 border-t border-[#27272A] text-center font-mono text-[11px] text-[#71717A]">
          Zero-trust encryption • Single Sign-On
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#27272A] bg-[#0A0A0B]/80 backdrop-blur-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center shadow-skiff">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#FAFAFA] tracking-tight">
            FAMILYBRIDGE
          </span>
          <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30">
            Secure Auth
          </span>
        </div>
      </header>

      {/* Main Container with Suspense */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-skiff-grid">
        <Suspense fallback={<div className="w-8 h-8 border-2 border-[#FF4405] border-t-transparent rounded-full animate-spin" />}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="py-4 text-center text-xs font-mono text-[#71717A] border-t border-[#27272A]">
        FAMILYBRIDGE • Prompt Wars x Techverse • Zero-Knowledge Vault
      </footer>
    </div>
  );
}