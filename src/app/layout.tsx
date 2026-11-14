import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "BillBack",
  description: "Find errors in your medical bills and fight back, in 60 seconds.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
