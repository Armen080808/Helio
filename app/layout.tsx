import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helio — Run your freelance business on autopilot",
  description:
    "Proposals, contracts, invoicing, scheduling, and CRM — unified in one AI-native platform. Built for freelancers and service businesses.",
  openGraph: {
    title: "Helio — Run your freelance business on autopilot",
    description:
      "Stop juggling 7+ tools. Helio replaces them all with one AI-native platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
