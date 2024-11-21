import { ThemeProvider } from "@/src/components/theme-provider";
import "@fontsource/merriweather";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetingBot",
  description:
    "Open Source Meeting Bot API: Easily create automated applications that leverage recordings across popular video meeting platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-serif antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
