"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Search, Globe2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Category = {
  name: string
  keywords: string[]
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

export function GoogleSearchForm() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [resultsCount, setResultsCount] = useState("100")
  const [googleDomain, setGoogleDomain] = useState("google.com")
  const [language, setLanguage] = useState("en")
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "Afiliados",
      keywords: ["review", "mejor", "top", "comparación"],
    },
    {
      name: "Bonos",
      keywords: ["bono bienvenida", "sin depósito", "giros gratis"],
    },
  ])

  const handleAddCategory = () => {
    setCategories([...categories, { name: "", keywords: [] }])
  }

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const handleCategoryNameChange = (index: number, name: string) => {
    const newCategories = [...categories]
    newCategories[index].name = name
    setCategories(newCategories)
  }

  const handleAddKeyword = (categoryIndex: number, keyword: string) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.push(keyword)
    setCategories(newCategories)
  }

  const handleRemoveKeyword = (categoryIndex: number, keywordIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.splice(keywordIndex, 1)
    setCategories(newCategories)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      console.error('La búsqueda no puede estar vacía')
      return
    }
    
    try {
      // Extraer todas las keywords como array
      const allKeywords = categories
        .flatMap(cat => cat.keywords)
        .filter(k => k.trim() !== '')

      // Construir la URL con los parámetros
      const params = new URLSearchParams()
      params.append('query', searchQuery)
      // Agregar cada keyword individualmente
      allKeywords.forEach(keyword => {
        params.append('keywords', keyword)
      })
      params.append('country', googleDomain.split('.').pop() || 'com')
      params.append('max_results', resultsCount)
      params.append('max_depth', '1')

      const response = await fetch(
        `http://localhost:8000/api/v1/google-search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error en la búsqueda')
      }

      const data = await response.json()
      console.log(data, "??????")
      router.push(`/results/`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Configuración de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="searchQuery">Término de Búsqueda</Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: mejores casinos online 2024"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resultsCount">Número de Resultados</Label>
                <Select value={resultsCount} onValueChange={setResultsCount}>
                  <SelectTrigger id="resultsCount" className="mt-1.5">
                    <SelectValue placeholder="Seleccionar cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 resultados</SelectItem>
                    <SelectItem value="200">200 resultados</SelectItem>
                    <SelectItem value="300">300 resultados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="googleDomain">Dominio de Google</Label>
                <Select value={googleDomain} onValueChange={setGoogleDomain}>
                  <SelectTrigger id="googleDomain" className="mt-1.5">
                    <SelectValue placeholder="Seleccionar dominio" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GOOGLE_DOMAINS).map(([domain, label]) => (
                      <SelectItem key={domain} value={domain}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="mt-1.5">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-green-500" />
            Categorías de Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-4 p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center mb-2">
                <Input
                  value={category.name}
                  onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="mr-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  className="hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              {category.keywords.map((keyword, keywordIndex) => (
                <div key={keywordIndex} className="flex items-center mt-2">
                  <Input
                    value={keyword}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      newCategories[categoryIndex].keywords[keywordIndex] = e.target.value
                      setCategories(newCategories)
                    }}
                    placeholder="Keyword"
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveKeyword(categoryIndex, keywordIndex)}
                    className="hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddKeyword(categoryIndex, "")}
                className="mt-2 hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Keyword
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddCategory}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" /> Agregar Categoría
          </Button>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200"
      >
        <Search className="h-4 w-4 mr-2" /> Iniciar Búsqueda
      </Button>
    </form>
  )
}

