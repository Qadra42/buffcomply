"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Download, ExternalLink, ArrowUpDown, Globe2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GoogleResult = {
  position: number
  url: string
  title: string
  description: string
  keywords: Record<string, boolean>
}

type GoogleSearchResult = {
  searchQuery: string
  totalResults: number
  searchTime: number
  domain: string
  language: string
  results: GoogleResult[]
}

const mockResults: GoogleSearchResult = {
  searchQuery: "mejores casinos online 2024",
  totalResults: 100,
  searchTime: 2.34,
  domain: "google.com",
  language: "es",
  results: [
    {
      position: 1,
      url: "https://example.com/mejores-casinos",
      title: "Top 10 Mejores Casinos Online 2024 - Guía Completa",
      description:
        "Encuentra los mejores casinos online con bonos exclusivos y juegos emocionantes. Análisis detallado de las mejores opciones para 2024.",
      keywords: {
        "bono bienvenida": true,
        mejor: true,
        top: true,
        review: false,
      },
    },
    {
      position: 2,
      url: "https://casino-review.com/top-casinos",
      title: "Casinos Online: Comparativa y Reviews 2024",
      description:
        "Reviews detalladas de los mejores casinos online. Incluye información sobre bonos, métodos de pago y juegos disponibles.",
      keywords: {
        "bono bienvenida": false,
        mejor: true,
        top: true,
        review: true,
      },
    },
    // Más resultados simulados...
  ],
}

export function GoogleSearchResults() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"position" | "matches">("position")
  const [activeView, setActiveView] = useState<"list" | "details">("list")

  const filteredResults = mockResults.results
    .filter(
      (result) =>
        result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "matches") {
        const matchesA = Object.values(a.keywords).filter(Boolean).length
        const matchesB = Object.values(b.keywords).filter(Boolean).length
        return matchesB - matchesA
      }
      return a.position - b.position
    })

  const handleDownload = () => {
    const csvRows = [
      ["Posición", "URL", "Título", "Descripción", ...Object.keys(mockResults.results[0].keywords)],
      ...filteredResults.map((result) => [
        result.position,
        result.url,
        result.title,
        result.description,
        ...Object.values(result.keywords).map((v) => (v ? "Sí" : "No")),
      ]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((row) => row.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `google_results_${mockResults.searchQuery.replace(/\s+/g, "_")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Globe2 className="h-6 w-6 text-blue-500" />
              Resultados de Búsqueda en Google
            </CardTitle>
            <Button onClick={handleDownload} className="bg-green-500 hover:bg-green-600 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatsCard label="Término de Búsqueda" value={mockResults.searchQuery} variant="blue" />
            <StatsCard label="Resultados Totales" value={mockResults.totalResults} variant="green" />
            <StatsCard label="Tiempo de Búsqueda" value={`${mockResults.searchTime}s`} variant="orange" />
            <StatsCard
              label="Dominio / Idioma"
              value={`${mockResults.domain} / ${mockResults.language.toUpperCase()}`}
              variant="purple"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar en resultados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px] transition-all duration-200 hover:border-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSortBy(sortBy === "position" ? "matches" : "position")}
                className="hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenar por {sortBy === "position" ? "coincidencias" : "posición"}
              </Button>
            </div>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "list" | "details")}>
              <TabsList>
                <TabsTrigger value="list">Vista Lista</TabsTrigger>
                <TabsTrigger value="details">Vista Detallada</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Tabs value={activeView} className="w-full">
              <TabsContent value="list">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[80px] font-semibold">Posición</TableHead>
                      <TableHead className="font-semibold">URL / Título</TableHead>
                      <TableHead className="font-semibold">Keywords Encontradas</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => {
                      const matchCount = Object.values(result.keywords).filter(Boolean).length
                      return (
                        <TableRow key={result.position} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell className="font-medium text-center">
                            <Badge
                              variant={result.position <= 3 ? "success" : "secondary"}
                              className={`
                                ${result.position <= 3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              `}
                            >
                              #{result.position}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                                {result.url}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 hover:text-blue-500"
                                  onClick={() => window.open(result.url, "_blank")}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="font-medium">{result.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.keywords).map(
                                ([keyword, found]) =>
                                  found && (
                                    <Badge
                                      key={keyword}
                                      variant="success"
                                      className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    >
                                      {keyword}
                                    </Badge>
                                  ),
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:text-blue-500"
                              onClick={() => window.open(result.url, "_blank")}
                            >
                              Visitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="details">
                <div className="grid gap-4 p-4">
                  {filteredResults.map((result) => (
                    <Card key={result.position} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <Badge
                              variant={result.position <= 3 ? "success" : "secondary"}
                              className={`
                                ${result.position <= 3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              `}
                            >
                              Posición #{result.position}
                            </Badge>
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                            >
                              {result.url}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <p className="text-gray-600">{result.description}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">Keywords Encontradas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.keywords).map(([keyword, found]) => (
                              <Badge
                                key={keyword}
                                variant={found ? "success" : "secondary"}
                                className={`
                                  ${found ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}
                                `}
                              >
                                {keyword}: {found ? "Encontrada" : "No encontrada"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  label,
  value,
  variant,
}: {
  label: string
  value: string | number
  variant: "blue" | "green" | "orange" | "purple"
}) {
  const getGradient = () => {
    switch (variant) {
      case "blue":
        return "from-blue-50 to-blue-100/50"
      case "green":
        return "from-green-50 to-green-100/50"
      case "orange":
        return "from-orange-50 to-orange-100/50"
      case "purple":
        return "from-purple-50 to-purple-100/50"
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "blue":
        return "text-blue-700"
      case "green":
        return "text-green-700"
      case "orange":
        return "text-orange-700"
      case "purple":
        return "text-purple-700"
    }
  }

  return (
    <div
      className={`
      rounded-xl p-4 transition-all duration-200
      hover:shadow-md bg-gradient-to-br ${getGradient()}
    `}
    >
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-lg font-bold mt-1 truncate ${getTextColor()}`}>{value}</p>
    </div>
  )
}

