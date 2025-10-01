import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Practicum Report Management System - Backend',
  description: 'Backend API server for the Student Practicum Report Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}