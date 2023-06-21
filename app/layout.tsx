'use client'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
        {children}
        </ThemeProvider>  
      </body>
    </html>
  )
}

