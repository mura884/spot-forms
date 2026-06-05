import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'スポット社労士くん 無料相談フォーム',
  robots: 'noindex,nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
