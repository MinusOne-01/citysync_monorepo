import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../modules/auth/components/AuthProvider";
import NotificationsOverlay from "../modules/notifications/components/NotiOverlay";
import { Nunito, Poppins, Inter } from "next/font/google";
import { PageContainer } from "../components/layout/PageContainer";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const font2 = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const font3 = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CitySync App",
  description: "App to find and join meetups in your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font2.className} bg-sky-300 text-slate-900 antialiased`}>

        <AuthProvider><NotificationsOverlay/> {children}</AuthProvider>

      </body>
    </html>
  );
}
