import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeApplier } from "@/components/ThemeApplier";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Manav Garg - Portfolio",
  description: "Personal portfolio of Manav Garg",
};

async function getTheme() {
  try {
    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    const text = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(text);
    return data.theme;
  } catch {
    return undefined;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=true"
        />
        <meta name="color-scheme" content="dark light" />
        <meta
          name="description"
          content={metadata.description?.toString() ?? ""}
        />
        <meta name="og:title" content={metadata.title?.toString() ?? ""} />
        <meta
          name="og:description"
          content={metadata.description?.toString() ?? ""}
        />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeApplier theme={theme} />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
