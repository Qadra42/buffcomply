"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
  name: string
  keywords: string[]
}

interface ReviewStepProps {
  searchQuery: string
  resultsCount: string
  googleDomain: string
  language: string
  categories: Category[]
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

export function ReviewStep({
  searchQuery,
  resultsCount,
  googleDomain,
  language,
  categories,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración Básica</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Término de búsqueda</p>
              <p className="font-medium">{searchQuery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Número de resultados</p>
              <p className="font-medium">{resultsCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dominio de Google</p>
              <p className="font-medium">{GOOGLE_DOMAINS[googleDomain as keyof typeof GOOGLE_DOMAINS]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Idioma</p>
              <p className="font-medium">{LANGUAGES[language as keyof typeof LANGUAGES]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Categorías y Keywords</h3>
          <div className="space-y-6">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{category.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.keywords.map((keyword, keywordIndex) => (
                    <Badge key={keywordIndex} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 