import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import { LOCALE_META, getLocale } from "@/lib/i18n";
import "./globals.css";

const readex = Readex_Pro({
  subsets: ["arabic", "latin", "latin-ext"],
  variable: "--font-readex",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CRM", template: "%s · CRM" },
  description: "CRM pour PME : WhatsApp, pipeline et contacts en darija, français et arabe.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const meta = LOCALE_META[locale];

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={readex.variable}>
      <body>{children}</body>
    </html>
  );
}
