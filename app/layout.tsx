import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AuditPeer — IT/Cybersecurity Audit Community',
  description: 'The peer Q&A community for IT and cybersecurity audit professionals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
