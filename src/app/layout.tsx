import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "~/components/Navbar";

export const metadata: Metadata = {
  title: "Rentability",
  description:
    "Your go-to platform for renting and listing services with ease.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-neutral-100 dark:bg-neutral-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
