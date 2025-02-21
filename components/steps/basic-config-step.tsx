"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Globe2 } from "lucide-react"

interface BasicConfigStepProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  resultsCount: string
  setResultsCount: (value: string) => void
  googleDomain: string
  setGoogleDomain: (value: string) => void
  language: string
  setLanguage: (value: string) => void
}

const GOOGLE_DOMAINS = {
  "google.com": "Global (Estados Unidos)",
  "google.com.br": "Brasil",
  "google.es": "España",
  "google.com.mx": "México",
  "google.com.ar": "Argentina",
}

const LANGUAGES = {
  en: "Inglés",
  es: "Español",
  pt: "Portugués",
}

export function BasicConfigStep({
  searchQuery,
  setSearchQuery,
  resultsCount,
  setResultsCount,
  googleDomain,
  setGoogleDomain,
  language,
  setLanguage,
}: BasicConfigStepProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="searchQuery">Término de búsqueda</Label>
          <Input
            id="searchQuery"
            placeholder="Ej: mejores casinos online 2024"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="googleDomain">Dominio de Google</Label>
            <Select value={googleDomain} onValueChange={setGoogleDomain}>
              <SelectTrigger id="googleDomain" className="w-full">
                <SelectValue placeholder="Selecciona un dominio" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOOGLE_DOMAINS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center">
                      <Globe2 className="w-4 h-4 mr-2" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Selecciona un idioma" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resultsCount">Número de resultados</Label>
          <Select value={resultsCount} onValueChange={setResultsCount}>
            <SelectTrigger id="resultsCount" className="w-full">
              <SelectValue placeholder="Selecciona cantidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50 resultados</SelectItem>
              <SelectItem value="100">100 resultados</SelectItem>
              <SelectItem value="200">200 resultados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
} 