"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "Default", value: "default" },
    { name: "Holi 🌈", value: "theme-holi" },
    { name: "Diwali 🪔", value: "theme-diwali" },
    { name: "Dushera 🏹", value: "theme-dushera" },
    { name: "Dhanteras 🪙", value: "theme-dhanteras" },
  ]

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Website Theme</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {themes.map((t) => (
          <Button
            key={t.value}
            variant={theme === t.value ? "default" : "outline"}
            onClick={() => setTheme(t.value)}
          >
            {t.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
