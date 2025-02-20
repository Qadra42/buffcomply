"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function SettingsForm() {
  const [apiKey, setApiKey] = useState("")
  const [scrapingInterval, setScrapingInterval] = useState("24")
  const [notifications, setNotifications] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración:", { apiKey, scrapingInterval, notifications })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <div>
            <Label htmlFor="scrapingInterval">Scraping Interval (hours)</Label>
            <Input
              id="scrapingInterval"
              type="number"
              value={scrapingInterval}
              onChange={(e) => setScrapingInterval(e.target.value)}
              min="1"
              max="168"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            <Label htmlFor="notifications">Enable email notifications</Label>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="mt-4">
        Save Settings
      </Button>
    </form>
  )
}

