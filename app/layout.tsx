  import type { Metadata } from "next"
  import { Inter } from "next/font/google"
  import "./globals.css"
  import Navbar from "@/components/navbar"

  const inter = Inter({ subsets: ["latin"] })

  export const metadata: Metadata = {
    title: "Air Quality Monitor",
    description: "Real-time air pollution monitoring dashboard",
    generator: 'v0.dev'
  }

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen`}>
          <Navbar />
          <main className="pt-16"> {/* Add padding to account for fixed navbar */}
            {children}
          </main>
        </body>
      </html>
    )
  }