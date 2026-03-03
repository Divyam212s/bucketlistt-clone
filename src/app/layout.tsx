import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import StoreProvider from "@/store/Provider";
import "./globals.css";
import "./mediaQueriesCss.css"

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bucketlistt | curated Adventures",
  description: "Experience the world through curated bucket-list adventures designed for the discerning traveler.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.variable} font-sans antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
