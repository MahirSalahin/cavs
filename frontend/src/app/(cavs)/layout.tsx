
import Layout from "@/components/Layout";
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
        <Layout>
          {children}
        </Layout>
      </ThemeProvider >
    </>
  );
}
