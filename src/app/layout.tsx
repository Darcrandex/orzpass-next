import ProgressBar from '@/components/ProgressBar'
import AntdProvider from '@/lib/AntdProvider'
import QueryProvider from '@/lib/QueryProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'orzpass',
  description: 'orzpass is a password manager that helps you to manage your passwords'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AntdProvider>
            <ProgressBar />
            {children}
          </AntdProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
