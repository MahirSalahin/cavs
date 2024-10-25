"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, forcedTheme }: { children: React.ReactNode, forcedTheme?: string }) {
  return <NextThemesProvider
    attribute='class'
    defaultTheme='dark'
    // enableSystem={false}
    disableTransitionOnChange={false}
    forcedTheme={forcedTheme}
  >
    {children}
  </NextThemesProvider>
}