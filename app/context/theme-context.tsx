"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "default" | "holi" | "diwali" | "dushera" | "dhanteras"

const ThemeContext = createContext({
  theme: "default" as Theme,
  setTheme: (theme: Theme) => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default")

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove(
      "theme-holi",
      "theme-diwali",
      "theme-dushera",
      "theme-dhanteras"
    )

    if (theme !== "default") {
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
