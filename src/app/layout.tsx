import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "CET-6 Study Companion · 六级备考督学",
    template: "%s · CET-6 Study Companion",
  },
  description:
    "面向中国大学生的六级备考督学系统：入学填报 → 自动生成学习计划 → 每日执行 → 打卡日历 → 每周反馈。",
  applicationName: "CET-6 Study Companion",
  appleWebApp: {
    capable: true,
    title: "六级备考督学",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7EC" },
    { media: "(prefers-color-scheme: dark)", color: "#141410" },
  ],
};

/**
 * No inline theme script: React hoists <script> into <body>, which desynchronises
 * the server and client trees and throws a hydration error. Instead the default
 * palette follows the OS via a media query in globals.css, and ThemeProvider
 * adds an explicit `.light` / `.dark` class once the stored preference is known.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      // globals.css 给 <html> 设了 scroll-behavior: smooth，Next.js 需要知道这一点，
      // 否则路由切换时会警告并自己接管滚动。
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
