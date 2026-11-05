import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://rishitpradhan.com"),
  title: "Rishit Pradhan — Biology × Computation",
  description:
    "Researcher, builder, and chemical biologist exploring intelligence across cells, molecules, and machines.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lagoon="false">
      <body>{children}</body>
    </html>
  );
}
