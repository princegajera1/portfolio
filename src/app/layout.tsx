import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import dynamic from "next/dynamic";
import { PortfolioDataProvider } from "@/context/PortfolioDataContext";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Gajera Prince | Full Stack Developer",
  description: "Portfolio of Gajera Prince, a Full Stack Developer & Generative AI Enthusiast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}>
      <body className="bg-[#0a0a0f] text-gray-200 antialiased overflow-x-hidden font-sans selection:bg-[#8b5cf6]/30 selection:text-[#00f0ff]">
        {/* Subtle noise texture */}
        <div className="noise-overlay" />
        
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00f0ff]/15 blur-[150px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#6366f1]/10 blur-[150px] animate-float-delayed"></div>
          <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-[#8b5cf6]/10 blur-[120px] animate-float"></div>
        </div>

        <PortfolioDataProvider>
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
          <CustomCursor />
          <Toaster position="bottom-right" theme="dark" />
        </PortfolioDataProvider>
      </body>
    </html>
  );
}
