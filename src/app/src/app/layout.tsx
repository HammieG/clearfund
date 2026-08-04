import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = { title: "ClearFund | Transparent giving", description: "A public ledger for verified grassroots giving." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main>{children}</main></body></html>;
}
