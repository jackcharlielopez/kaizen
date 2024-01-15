import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Session_Provider from "./_components/Session_Provider";
import TrpcProvider from "./_trpc/TrpcProvider";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaizen",
  description:
    "Tutoring app leveraging AI (artificial intelligence) to support learning for kids 4-12 years old",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Session_Provider>
          <TrpcProvider>
            <MantineProvider>
              <Notifications position="top-right" limit={5} />
              {children}
            </MantineProvider>
          </TrpcProvider>
        </Session_Provider>
      </body>
    </html>
  );
}
