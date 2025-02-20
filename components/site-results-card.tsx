"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, ChevronDown, ChevronRight, Download, Search, Globe } from "lucide-react"

type SiteScrapingResult = {
  start_url: string
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function SiteResultsCard({ site }: { site: SiteScrapingResult }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [detailsSearch, setDetailsSearch] = useState("")

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
    link.setAttribute("download", `scraping_results_${new URL(site.start_url).hostname}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredResults = Object.entries(site.results).filter(([url]) =>
    url.toLowerCase().includes(detailsSearch.toLowerCase()),
  )

  const totalMatches = Object.values(site.results).reduce(
    (sum, keywords) => sum + Object.values(keywords).filter(Boolean).length,
    0,
  )

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              {new URL(site.start_url).hostname}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(site.start_url, "_blank")}
                className="hover:text-blue-500 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardTitle>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Último escaneo: {new Date(site.last_scan).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              variant={isExpanded ? "secondary" : "default"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="transition-all duration-200"
            >
              {isExpanded ? "Ocultar detalles" : "Ver detalles"}
              {isExpanded ? (
                <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatsCard
            label="URLs Escaneadas"
            value={site.scraped_sites}
            trend={site.scraped_sites > 5 ? "positive" : "neutral"}
          />
          <StatsCard
            label="Coincidencias Totales"
            value={totalMatches}
            trend={totalMatches > 0 ? "positive" : "negative"}
          />
          <StatsCard
            label="Keywords Encontradas"
            value={site.total_coincidences}
            trend={site.total_coincidences > 0 ? "positive" : "negative"}
          />
          <StatsCard
            label="Duración"
            value={`${site.duration_seconds.toFixed(1)}s`}
            trend={site.duration_seconds < 30 ? "positive" : "neutral"}
          />
        </div>
      </CardHeader>
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
      `}
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar en resultados..."
                value={detailsSearch}
                onChange={(e) => setDetailsSearch(e.target.value)}
                className="pl-8 transition-all duration-200 hover:border-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-[50%] font-semibold">URL</TableHead>
                    {Object.keys(Object.values(site.results)[0]).map((keyword) => (
                      <TableHead key={keyword} className="text-center font-semibold">
                        {keyword}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-semibold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map(([url, keywords]) => {
                    const matchCount = Object.values(keywords).filter(Boolean).length
                    return (
                      <TableRow key={url} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium">
                          {url === site.start_url ? (
                            <Badge variant="outline" className="mr-2 border-blue-500 text-blue-500">
                              Base
                            </Badge>
                          ) : null}
                          <span className="break-all">{url.replace(site.start_url, "") || "/"}</span>
                        </TableCell>
                        {Object.entries(keywords).map(([keyword, found]) => (
                          <TableCell key={keyword} className="text-center">
                            <Badge
                              variant={found ? "success" : "secondary"}
                              className={`
                                transition-all duration-200
                                ${
                                  found
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }
                              `}
                            >
                              {found ? "Sí" : "No"}
                            </Badge>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <Badge
                            variant={matchCount > 0 ? "success" : "secondary"}
                            className={`
                              transition-all duration-200
                              ${
                                matchCount > 0
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }
                            `}
                          >
                            {matchCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </div>
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

