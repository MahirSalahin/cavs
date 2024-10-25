import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Particles from "@/components/ui/particles";
// import Particles from "@/components/ui/particles";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CAVS",
  description: "CUET Anonymous Voting System is the new way to build you opinion stronger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <div className='fixed z-[-1] left-[28%] top-0 h-[150px] w-[200px] rotate-12 rounded-3xl bg-gradient-to-l from-blue-600 to-sky-400 blur-3xl filter block opacity-20 lg:top-32 lg:-right-20 lg:h-72 lg:w-[350px] xl:h-80 xl:w-[500px]'></div>
        <div className='fixed z-[-1] left-[10%] top-50% h-[150px] w-[200px] rotate-12 rounded-3xl bg-gradient-to-l bg-purple-600 to-indigo-600 blur-3xl filter block opacity-20 lg:top-44 lg:-right-20 lg:h-72 lg:w-[350px] xl:h-80 xl:w-[500px]'></div>
        <div className='fixed z-[-1] bottom-44 -left-64 h-[150px] w-[900px] -rotate-45 rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-20 blur-3xl filter block lg:bottom-24 lg:-left-20 lg:h-28 lg:w-[250px] lg:-rotate-12 lg:xl:h-40 xl:w-[400px]'></div>


        <div className="!z-[-1]">
          <Particles
            className="fixed top-0 left-0 right-0 !z-[-1] inset-0"
            quantity={100}
            ease={80}
            color={'#fff'}
            refresh
          />
        </div>
        <Toaster />
        {/* <ThemeProvider> */}
          <NextTopLoader
            showSpinner={false}
            color="#4646d7"
          />
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
