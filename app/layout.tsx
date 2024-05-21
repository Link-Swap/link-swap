import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/web3-provider";
import { SwapChainProvider } from "@/components/core/provider/chain-select-provider";
import { SwapCurrencyProvider } from "@/components/core/provider/currency-select-provider";
import { DataFeedProvider } from "@/components/core/provider/data-feed-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/core/nav/navbar";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkSwap | Chainlink powered Cross Chain Token Swapping and Transfer",
  description: "Cross Chain Token Swapping and Transfer using purely Chainlink services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SwapChainProvider>
            <DataFeedProvider>
              <SwapCurrencyProvider>
                <Web3Provider>
                  <NavBar />
                  {children}
                  <Toaster />
                </Web3Provider>
              </SwapCurrencyProvider>
            </DataFeedProvider>
          </SwapChainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
