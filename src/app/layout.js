// app/layout.js
'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/layout/TopNav'
import { Toaster as SonnerToaster } from 'sonner'
import { Toaster as HotToaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/auth/AuthContext'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Job Application Assistant',
  description: 'AI-powered job application assistant',
}

const globalStyles = `
  .highlight-point {
    transition: background-color 0.2s;
  }
  
  .highlight-point:hover {
    opacity: 0.8;
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{globalStyles}</style>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col h-screen">
            <TopNav />
            <main className="flex-1 overflow-auto bg-gray-100">
              {children}
            </main>
          </div>
          <HotToaster position="top-right" richColors />
          <SonnerToaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}

