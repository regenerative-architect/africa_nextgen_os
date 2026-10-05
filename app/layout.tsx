import type { Metadata } from "next";
import "./relay.css";

export const metadata: Metadata = {
  title: "African Children | Early-Warning & Intervention Relay",
  description: "Evidence, local understanding, human review and verified outcomes. An independent offline-first humanitarian relay.",
  icons: {
    icon: "/relay-icon.svg",
    shortcut: "/relay-icon.svg",
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
