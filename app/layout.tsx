import type { Metadata } from 'next'
import React from 'react'
import { Roboto, Lobster, Gloock } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/Header'
import NextTopLoader from 'nextjs-toploader'
import Script from 'next/script'
// @ts-ignore
import './globals.css'

const robeto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto'
})

const lobster = Lobster({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lobster'
})

const glock = Gloock({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-glock'
})

export const metadata: Metadata = {
  title: 'Social X',
  description:
    'Discover new way to rot your brain with Social X, the next generation social media platform designed for seamless connectivity and engaging interactions.',
  keywords:
    ' social media, networking, online community, posts, friends, sharing, messaging, profiles, social networking, content creation'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <Script
          src='https://widget.cloudinary.com/v2.0/global/all.js'
          strategy='afterInteractive' // 🔑 Better loading strategy
        />
      </head>
      <body
        className={`
        ${robeto.variable}
        ${lobster.variable}
        ${glock.variable}
        bg-light-100
        `}
      >
        <AuthProvider>
          <NextTopLoader showSpinner={false} />
          <Header />
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
