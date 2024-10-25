
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <Nav />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}
