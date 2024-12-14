import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "@/lib/ToastProvider";
import SupaProvider from "@/Context";
import StyledComponentsRegistry from "@/Components/StyledRegistry";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OrderFlow Manager",
  description: "Seu software ideal para controlar o restaurante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
            <ToastProvider>
              <SupaProvider>
                {children}
              </SupaProvider>
            </ToastProvider>
          </Theme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
