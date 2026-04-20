import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "Class-Board | 동급생 익명 놀이터",
  description: "회원가입 없이 누구나 익명으로 고민상담, 질문, 의견을 남길 수 있는 메모장 형태의 웹 기반 소통 놀이터입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} bg-yellow-50 text-slate-900 antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}

