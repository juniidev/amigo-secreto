import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FooterCopyright from "@/components/FooterCopyright";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amigo Secreto | Organiza tu intercambio sin enredos",
  description:
    "Crea tu sorteo de amigo secreto en segundos, configura exclusiones y comparte los enlaces directos por WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-rose-100 selection:text-rose-900`}
      >
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
          {children}
        </main>

        <FooterCopyright />
      </body>
    </html>
  );
}
