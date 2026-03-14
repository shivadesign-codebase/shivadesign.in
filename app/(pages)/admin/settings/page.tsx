"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { CldUploadButton } from "next-cloudinary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ThemeSettingsPage() {

  const { theme, setTheme } = useTheme()

  const [introVideoLink, setIntroVideoLink] = useState("")
  const [marqueeText, setMarqueeText] = useState("")

  const handleVideoUpload = (result: any) => {
    const uploadedVideoUrl = result?.info?.secure_url

    if (uploadedVideoUrl) {
      setIntroVideoLink(uploadedVideoUrl)
      toast.success("Video uploaded successfully")
    } else {
      toast.error("Failed to upload video")
    }
  }

  const themes = [
    { name: "Default", value: "default" },
    { name: "Holi 🌈", value: "theme-holi" },
    { name: "Diwali 🪔", value: "theme-diwali" },
    { name: "Dushera 🏹", value: "theme-dushera" },
    { name: "Dhanteras 🪙", value: "theme-dhanteras" },
  ]

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setIntroVideoLink(data.introVideoLink || "")
        setMarqueeText(data.marqueeText || "")
        setTheme(data.theme || "default")
      })
  }, [])

  const saveSettings = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        introVideoLink,
        marqueeText,
        theme
      })
    })

    toast.success("Settings saved")
  }

  return (
    <div className="mx-auto p-4 md:p-6 flex flex-row gap-6">

      <Card className="shadow-lg border-muted w-3/4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Website Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">

          {/* VIDEO SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Hero Intro Video
            </h3>

            <CldUploadButton
              onSuccess={handleVideoUpload}
              uploadPreset="shivadesign"
              options={{
                maxFiles: 1,
                resourceType: "video",
              }}
            >
              <div>
                Upload Video
              </div>
            </CldUploadButton>

          </div>

          {/* MARQUEE SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Marquee Announcement
            </h3>

            <Input
              placeholder="Enter marquee announcement..."
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
            />
          </div>

          {/* THEME SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Website Theme
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((t) => (
                <Button
                  key={t.value}
                  variant={theme === t.value ? "default" : "outline"}
                  onClick={() => setTheme(t.value)}
                  className="w-full"
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              className="px-6"
            >
              Save Settings
            </Button>
          </div>

        </CardContent>
      </Card>

      {introVideoLink && (
        <div className="flex justify-center pt-4">
          <div className="relative border-10 border-black bg-black rounded-4xl h-110 w-55 shadow-xl">

            {/* screen */}
            <div className="absolute inset-0 rounded-3xl] overflow-hidden">
              <video
                src={introVideoLink}
                controls
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
