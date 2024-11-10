import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const isAdSenseEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true'
export const metadata = {
  title: '我的导航网站',
  description: '发现和组织您最喜爱的网站',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {/* AdSense 广告单元 */}
        {isAdSenseEnabled && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        )}
        {children}
      </body>
    </html>
  )
}