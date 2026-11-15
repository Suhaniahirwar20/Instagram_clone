import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { CreateModalProvider } from "@/lib/createModelContext";
import AuthProvider from "@/providers/AuthProvider";
import AuthGuard from "@/lib/AuthGuard";
import { Toaster } from "@/components/ui/toast";
import SocketProvider from "@/lib/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstAI - Share moments with the world",
  description: "Share moments and create content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <CreateModalProvider>
              <AuthGuard>
                <SocketProvider>{children}</SocketProvider>
              </AuthGuard>
              <Toaster />
            </CreateModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
