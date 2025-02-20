"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, ChevronDown, ChevronRight, Download, Search, Globe } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type SiteScrapingResult = {
  title: string
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function SiteResultsCard({ site }: { site: SiteScrapingResult }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [detailsSearch, setDetailsSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedConditions, setSelectedConditions] = useState<Record<string, boolean>>({})
  const ITEMS_PER_PAGE = 20

  // Obtener todas las keywords disponibles
  const availableKeywords = Object.keys(Object.values(site.results)[0] || {})

  // Inicializar las condiciones si están vacías
  useEffect(() => {
    if (Object.keys(selectedConditions).length === 0) {
      const initial = availableKeywords.reduce((acc, keyword) => ({
        ...acc,
        [keyword]: false
      }), {})
      setSelectedConditions(initial)
    }
  }, [])

  // Filtrar y paginar los resultados
  const filteredResults = Object.entries(site.results)
    .filter(([url, keywords]) => {
      // Filtrar por búsqueda de texto
      const matchesSearch = url.toLowerCase().includes(detailsSearch.toLowerCase())
      
      // Filtrar por condiciones seleccionadas
      const activeConditions = Object.entries(selectedConditions)
        .filter(([_, isSelected]) => isSelected)
        .map(([keyword]) => keyword)
      
      if (activeConditions.length === 0) {
        return matchesSearch
      }

      // Debe cumplir con todas las condiciones seleccionadas
      const matchesConditions = activeConditions.every(keyword => keywords[keyword])
      
      return matchesSearch && matchesConditions
    })

  const paginatedResults = filteredResults
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)

  // Función para exportar solo los resultados filtrados
  const exportFilteredResults = () => {
    const csvRows = [
      ['URL', ...Object.keys(Object.values(site.results)[0])],
      ...filteredResults.map(([url, keywords]) => [
        url,
        ...Object.values(keywords).map(v => v ? 'Sí' : 'No')
      ])
    ]

    const csvContent = "data:text/csv;charset=utf-8," + 
      csvRows.map(row => row.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${site.title}_filtered_results.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = () => {
    const csvRows = [
      ["URL", ...Object.keys(Object.values(site.results)[0])],
      ...Object.entries(site.results).map(([url, keywords]) => [
        url,
        ...Object.values(keywords).map((v) => (v ? "Sí" : "No")),
      ]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((row) => row.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `scraping_results_${site.start_urls.map(url => new URL(url).hostname).join("_")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalMatches = Object.values(site.results).reduce(
    (sum, keywords) => sum + Object.values(keywords).filter(Boolean).length,
    0,
  )

  const mainDomain = new URL(site.start_urls[0]).hostname

  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <CardTitle className="truncate">{site.title}</CardTitle>
            <p className="text-sm text-gray-500">
              Último escaneo: {site.last_scan}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="border border-gray-200 bg-white hover:bg-gray-50 whitespace-nowrap"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-black text-white hover:bg-gray-800 whitespace-nowrap"
            >
              <ChevronRight className={`h-4 w-4 mr-2 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              Ver detalles
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Sitios analizados:
          </p>
          <div className="flex flex-wrap gap-2">
            {site.start_urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
              >
                <Globe className="h-4 w-4" />
                {new URL(url).hostname}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatsCard
            label="URLs Escaneadas"
            value={Object.keys(site.results).length}
            trend="neutral"
          />
          <StatsCard
            label="Coincidencias Totales"
            value={site.total_coincidences}
            trend={site.total_coincidences > 0 ? "positive" : "neutral"}
          />
          <StatsCard
            label="Keywords Encontradas"
            value={Object.keys(Object.values(site.results)[0] || {}).length}
            trend="neutral"
          />
          <StatsCard
            label="Duración"
            value={`${site.duration_seconds.toFixed(1)}s`}
            trend="neutral"
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar en resultados..."
                    value={detailsSearch}
                    onChange={(e) => {
                      setDetailsSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportFilteredResults}
                >
                  Exportar Filtrados
                </Button>
              </div>

              {/* Filtros por condición */}
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                {availableKeywords.map(keyword => (
                  <div key={keyword} className="flex items-center">
                    <Checkbox
                      id={keyword}
                      checked={selectedConditions[keyword]}
                      onCheckedChange={(checked: boolean) => {
                        setSelectedConditions(prev => ({
                          ...prev,
                          [keyword]: checked
                        }))
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={keyword} className="ml-2 text-sm">
                      {keyword}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">URL</th>
                    {availableKeywords.map((keyword) => (
                      <th key={keyword} className="px-6 py-3">{keyword}</th>
                    ))}
                    <th className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map(([url, keywords]) => {
                    const total = Object.values(keywords).filter(Boolean).length
                    return (
                      <tr key={url} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <a 
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        {Object.entries(keywords).map(([keyword, found]) => (
                          <td key={keyword} className="px-6 py-4">
                            {found ? "Sí" : "No"}
                          </td>
                        ))}
                        <td className="px-6 py-4">{total}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function StatsCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string | number
  trend: "positive" | "negative" | "neutral"
}) {
  const getBgColor = () => {
    switch (trend) {
      case "positive":
        return "bg-gradient-to-br from-green-50 to-green-100/50"
      case "negative":
        return "bg-gradient-to-br from-red-50 to-red-100/50"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100/50"
    }
  }

  const getTextColor = () => {
    switch (trend) {
      case "positive":
        return "text-green-700"
      case "negative":
        return "text-red-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div
      className={`
      rounded-xl p-4 transition-all duration-200
      hover:shadow-md ${getBgColor()}
    `}
    >
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${getTextColor()}`}>{value}</p>
    </div>
  )
}
