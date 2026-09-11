import type { Metadata } from "next";
import "./globals.css";
import { FloatingGeminiBot } from "@/components/FloatingGeminiBot";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "FAMILYBRIDGE — Your family shouldn't have to understand the system after you're gone",
  description:
    "An AI-powered Family Continuity & Benefits Assistant built with Google Gemini for Prompt Wars x Techverse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0B] text-[#FAFAFA] antialiased min-h-screen selection:bg-[#FF4405] selection:text-white">
        <AuthProvider>
          {children}
          <FloatingGeminiBot />
        </AuthProvider>
      </body>
    </html>
  );
}