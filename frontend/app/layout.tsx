import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ditdik Workflow Platform",
  description: "Workflow automation management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="teal" className={poppins.variable} suppressHydrationWarning>
      <body className="bg-white text-ink antialiased font-sans">{children}</body>
    </html>
  );
}
