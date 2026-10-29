import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "deBridge Clone | Instant Cross-Chain Swaps",
  description: "A deBridge-style interface with live MetaMask connection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-[#03111C] text-[#E6EDE4] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
